/* ============================================================
   BLANKLOOM — CHECKOUT PAGE RENDERER
   ------------------------------------------------------------
   Renders the real cart as an order summary, validates the
   form, and submits to /api/order (same backend as before —
   saves to data/orders.json and emails you via Nodemailer).
   ============================================================ */

const checkoutRoot = document.getElementById("checkout-shell");

function renderCheckout() {
  const cart = getCart();

  if (cart.length === 0) {
    checkoutRoot.innerHTML = `<div class="empty-cart" style="grid-column:1/-1;"><p>Your bag is empty.</p><a href="shop.html" class="btn-primary" style="margin-top:16px;">Browse the catalog</a></div>`;
    return;
  }

  const summaryItemsHTML = cart.map(item => {
    const p = getProduct(item.id);
    if (!p) return "";
    return `
      <div class="os-item">
        <div class="thumb"><span class="qty-badge">${item.qty}</span>${productMedia(p)}</div>
        <div><div class="name">${p.name}</div><div class="meta">${p.color} · ${item.size}</div></div>
        <div class="price">${formatPrice(p.price * item.qty)}</div>
      </div>
    `;
  }).join("");

  checkoutRoot.innerHTML = `
    <div class="checkout-form">
      <div class="step">
        <div class="step-head"><div class="step-num">1</div><h3>Contact Information</h3></div>
        <div class="step-body">
          <div class="form-row">
            <label for="name">Full Name</label>
            <input type="text" id="name" required>
            <div class="field-error" id="err-name">Please enter your name.</div>
          </div>
          <div class="form-row">
            <label for="mobile">Mobile Number</label>
            <input type="tel" id="mobile" placeholder="10-digit mobile number" required>
            <div class="field-error" id="err-mobile">Enter a valid 10-digit mobile number.</div>
          </div>
          <div class="form-row">
            <label for="email">Email (optional — for order confirmation)</label>
            <input type="email" id="email">
          </div>
        </div>
      </div>

      <div class="step">
        <div class="step-head"><div class="step-num">2</div><h3>Shipping Destination</h3></div>
        <div class="step-body">
          <div class="form-row">
            <label for="address">Address (house no, street, area)</label>
            <textarea id="address" required></textarea>
            <div class="field-error" id="err-address">Please enter your delivery address.</div>
          </div>
          <div class="form-row two">
            <div><label for="city">City</label><input type="text" id="city" required><div class="field-error" id="err-city">Required.</div></div>
            <div><label for="state">State</label><input type="text" id="state" required><div class="field-error" id="err-state">Required.</div></div>
          </div>
          <div class="form-row">
            <label for="pincode">Pincode</label>
            <input type="text" id="pincode" placeholder="6-digit pincode" required>
            <div class="field-error" id="err-pincode">Enter a valid 6-digit pincode.</div>
          </div>
          <div class="form-row">
            <label for="notes">Order notes (optional)</label>
            <textarea id="notes" placeholder="Landmark, delivery instructions, etc."></textarea>
          </div>
        </div>
      </div>

      <div class="step">
        <div class="step-head"><div class="step-num">3</div><h3>Payment Method</h3></div>
        <div class="step-body">
          <div class="payment-option">
            <div class="radio"></div>
            <span class="ic" aria-hidden="true">💵</span>
            <div><b>Cash on Delivery</b><span>Pay in cash when your order arrives</span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="order-summary">
      <h3>Order Summary</h3>
      ${summaryItemsHTML}

      <div class="coupon-row">
        <input type="text" id="coupon-input" placeholder="Enter coupon code" autocomplete="off">
        <button type="button" id="coupon-apply-btn">Apply</button>
      </div>
      <div class="coupon-status" id="coupon-status"></div>

      <div class="summary-line" style="padding-top:16px; border-top:1px solid var(--border);"><span>Subtotal</span><span id="summary-subtotal"></span></div>
      <div class="summary-line" id="discount-line" style="display:none; color:var(--emerald);"><span>Discount (<span id="discount-code"></span>)</span><span id="summary-discount"></span></div>
      <div class="summary-line"><span>Shipping</span><span id="summary-shipping"></span></div>
      <div class="summary-total"><span>Total (Pay on Delivery)</span><span id="summary-total"></span></div>
      <button type="button" class="btn-place" id="submit-btn">Place Order — Pay on Delivery</button>
      <div class="form-status" id="form-status"></div>
      <div class="trust-row">
        <span>🔒 Secure form</span>
        <span>↩ Easy Returns</span>
        <span>📞 Confirmed by Call</span>
      </div>
    </div>
  `;

  document.getElementById("submit-btn").addEventListener("click", handleSubmit);

  document.getElementById("coupon-apply-btn").addEventListener("click", applyCoupon);
  document.getElementById("coupon-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); applyCoupon(); }
  });

  updateSummaryTotals();
}

// Tracks the currently applied coupon (or null). Recomputed on every
// cart/coupon change via updateSummaryTotals(), which is also what
// handleSubmit() reads from when building the order to send.
let appliedCoupon = null;

function updateSummaryTotals() {
  const subtotal = cartTotal();
  let discount = 0;

  if (appliedCoupon) {
    discount = appliedCoupon.type === "percent"
      ? Math.round(subtotal * appliedCoupon.value / 100)
      : appliedCoupon.value;
    // Never let a coupon fully zero out (or exceed) the order total.
    discount = Math.max(0, Math.min(discount, subtotal - 1));
  }

  const total = subtotal - discount;

  document.getElementById("summary-subtotal").textContent = formatPrice(subtotal);
  document.getElementById("summary-shipping").textContent =
    total >= SITE_DATA.cartPage.freeShippingThreshold ? "Free" : "Calculated on confirmation";
  document.getElementById("summary-total").textContent = formatPrice(total);

  const discountLine = document.getElementById("discount-line");
  if (appliedCoupon && discount > 0) {
    discountLine.style.display = "flex";
    document.getElementById("discount-code").textContent = appliedCoupon.code;
    document.getElementById("summary-discount").textContent = "− " + formatPrice(discount);
  } else {
    discountLine.style.display = "none";
  }

  return { subtotal, discount, total };
}

function applyCoupon() {
  const input = document.getElementById("coupon-input");
  const status = document.getElementById("coupon-status");
  const code = input.value.trim().toUpperCase();

  if (!code) {
    status.className = "coupon-status error";
    status.textContent = "Enter a coupon code first.";
    return;
  }

  const match = (SITE_DATA.coupons || []).find(c => c.code.toUpperCase() === code);

  if (!match) {
    appliedCoupon = null;
    status.className = "coupon-status error";
    status.textContent = "Invalid coupon code.";
    updateSummaryTotals();
    return;
  }

  appliedCoupon = match;
  status.className = "coupon-status success";
  status.textContent = `Applied — ${match.description}`;
  updateSummaryTotals();
}

function validateField(id, testFn) {
  const input = document.getElementById(id);
  const err = document.getElementById("err-" + id);
  const valid = testFn(input.value.trim());
  if (!valid) {
    err.style.display = "block";
    input.style.borderColor = "var(--error)";
  } else {
    err.style.display = "none";
    input.style.borderColor = "var(--border)";
  }
  return valid;
}

async function handleSubmit() {
  const statusEl = document.getElementById("form-status");
  try {
    const validName = validateField("name", v => v.length >= 2);
    const validMobile = validateField("mobile", v => /^[6-9]\d{9}$/.test(v));
    const validAddress = validateField("address", v => v.length >= 8);
    const validCity = validateField("city", v => v.length >= 2);
    const validState = validateField("state", v => v.length >= 2);
    const validPincode = validateField("pincode", v => /^\d{6}$/.test(v));

    if (!(validName && validMobile && validAddress && validCity && validState && validPincode)) {
      statusEl.className = "form-status error";
      statusEl.textContent = "Please fix the highlighted fields.";
      return;
    }

    const cart = getCart();
    const items = [];
    let hasStaleItems = false;
    cart.forEach(item => {
      const p = getProduct(item.id);
      if (!p) { hasStaleItems = true; return; }
      items.push({ name: p.name, code: p.sku, size: item.size, qty: item.qty, price: p.price });
    });

    if (items.length === 0) {
      statusEl.className = "form-status error";
      statusEl.textContent = "Your cart has out-of-date items. Please clear your cart and add products again from the catalog.";
      return;
    }

    if (hasStaleItems) {
      statusEl.className = "form-status error";
      statusEl.textContent = "Some items in your cart are out of date and were skipped. Please review your cart before placing the order.";
      return;
    }

    const totals = updateSummaryTotals();

    const order = {
      name: document.getElementById("name").value.trim(),
      mobile: document.getElementById("mobile").value.trim(),
      email: document.getElementById("email").value.trim(),
      address: document.getElementById("address").value.trim(),
      city: document.getElementById("city").value.trim(),
      state: document.getElementById("state").value.trim(),
      pincode: document.getElementById("pincode").value.trim(),
      notes: document.getElementById("notes").value.trim(),
      items,
      subtotal: totals.subtotal,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      discount: totals.discount,
      total: totals.total
    };

    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Placing order...";
    statusEl.className = "form-status";
    statusEl.textContent = "";

    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Something went wrong. Please try again.");
    }

    clearCart();
    checkoutRoot.innerHTML = `
      <div class="confirmation" style="grid-column:1/-1;">
        <div class="check" aria-hidden="true">✓</div>
        <h1>Order placed.</h1>
        <p>We've received your order and will confirm by phone before dispatch.</p>
        <div class="order-id mono">${data.orderId}</div>
        <a href="shop.html" class="btn-primary">Continue Shopping</a>
      </div>
    `;
  } catch (err) {
    console.error("Checkout error:", err);
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Place Order — Pay on Delivery";
    }
    statusEl.className = "form-status error";
    statusEl.textContent = err.message || "Something went wrong. Please try again.";
  }
}

function renderNav() {} // checkout uses a minimal header, no nav

document.addEventListener("DOMContentLoaded", renderCheckout);