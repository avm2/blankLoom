const express = require("express");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const router = express.Router();
const ORDERS_FILE = path.join(__dirname, "..", "data", "orders.json");

// ---------- helpers ----------
function readOrders() {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveOrder(order) {
  const orders = readOrders();
  orders.push(order);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function generateOrderId() {
  const date = new Date();
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BL-${stamp}-${rand}`;
}

function isValidOrder(body) {
  const { name, mobile, address, city, state, pincode, items, total } = body;
  if (!name || name.trim().length < 2) return "Name is required.";
  if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) return "A valid 10-digit mobile number is required.";
  if (!address || address.trim().length < 8) return "Address is required.";
  if (!city || !state) return "City and state are required.";
  if (!pincode || !/^\d{6}$/.test(pincode)) return "A valid 6-digit pincode is required.";
  if (!Array.isArray(items) || items.length === 0) return "Cart is empty.";
  if (typeof total !== "number" || total <= 0) return "Invalid order total.";
  return null;
}

// ---------- mail transport ----------
// Uses Gmail SMTP with an App Password by default. See README for setup,
// or swap the transport config for any other SMTP provider.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

function buildOwnerEmail(order) {
  const itemsHtml = order.items
    .map(i => `<tr><td>${i.name} (${i.code})</td><td>${i.size}</td><td>${i.qty}</td><td>₹${i.price}</td><td>₹${i.price * i.qty}</td></tr>`)
    .join("");

  return `
    <h2>New order — ${order.orderId}</h2>
    <p><strong>${order.name}</strong> · ${order.mobile}</p>
    <p>${order.address}, ${order.city}, ${order.state} - ${order.pincode}</p>
    ${order.notes ? `<p><em>Notes: ${order.notes}</em></p>` : ""}
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
      <tr><th>Item</th><th>Size</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
      ${itemsHtml}
    </table>
    <p><strong>Total: ₹${order.total}</strong></p>
    <p>Payment: Cash on Delivery</p>
  `;
}

function buildCustomerEmail(order) {
  return `
    <h2>Thanks for your order, ${order.name}!</h2>
    <p>Your Blankloom order <strong>${order.orderId}</strong> has been received.</p>
    <p>We'll confirm with you by phone before we dispatch it to:</p>
    <p>${order.address}, ${order.city}, ${order.state} - ${order.pincode}</p>
    <p><strong>Total to pay on delivery: ₹${order.total}</strong></p>
    <p>— Blankloom</p>
  `;
}

// ---------- route ----------
router.post("/", async (req, res) => {
  const error = isValidOrder(req.body);
  if (error) {
    return res.status(400).json({ success: false, error });
  }

  const order = {
    orderId: generateOrderId(),
    createdAt: new Date().toISOString(),
    ...req.body
  };

  try {
    saveOrder(order);
  } catch (e) {
    console.error("Failed to save order:", e);
    return res.status(500).json({ success: false, error: "Could not save order. Please try again." });
  }

  // Send emails, but don't fail the order if email delivery has an issue —
  // the order is already saved to disk as the source of truth.
  try {
    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
      await transporter.sendMail({
        from: `"Blankloom" <${process.env.MAIL_USER}>`,
        to: process.env.OWNER_EMAIL || process.env.MAIL_USER,
        subject: `New order ${order.orderId} — ₹${order.total}`,
        html: buildOwnerEmail(order)
      });

      if (req.body.email) {
        await transporter.sendMail({
          from: `"Blankloom" <${process.env.MAIL_USER}>`,
          to: req.body.email,
          subject: `Your Blankloom order ${order.orderId}`,
          html: buildCustomerEmail(order)
        });
      }
    } else {
      console.warn("MAIL_USER/MAIL_PASS not set — skipping email send. Order was still saved.");
    }
  } catch (mailErr) {
    console.error("Email sending failed (order was still saved):", mailErr.message);
  }

  res.json({ success: true, orderId: order.orderId });
});

module.exports = router;
