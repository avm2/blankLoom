const checkoutRoot = document.getElementById("checkout-root");

function renderCheckout() {
  const cart = getCart();

  if (cart.length === 0) {
    checkoutRoot.innerHTML = `<div class="empty-cart"><p>Your bag is empty.</p><a href="shop.html" class="btn-primary">Browse the catalog</a></div>`;
    return;
  }

  const total = cartTotal();
  const summaryLines = cart.map(item => {
    const p = getProduct(item.id);
    if (!p) return "";
    return `<div class="summary-line"><span>${p.name} (${item.size}) × ${item.qty}</span><span>${formatPrice(p.price * item.qty)}</span></div>`;
  }).join("");

  checkoutRoot.innerHTML = `
    <div class="checkout-wrap">
      <form class="checkout-form" id="order-form" novalidate>
        <div class="form-row">
          <label for="name">Full name</label>
          <input type="text" id="name" name="name" required>
          <div class="field-error" id="err-name">Please enter your name.</div>
        </div>

        <div class="form-row">
          <label for="mobile">Mobile number</label>
          <input type="tel" id="mobile" name="mobile" placeholder="10-digit mobile number" required>
          <div class="field-error" id="err-mobile">Enter a valid 10-digit mobile number.</div>
        </div>

        <div class="form-row">
          <label for="email">Email (optional — for order confirmation)</label>
          <input type="email" id="email" name="email">
        </div>

        <div class="form-row">
          <label for="address">Address (house no, street, area)</label>
          <textarea id="address" name="address" required></textarea>
          <div class="field-error" id="err-address">Please enter your delivery address.</div>
        </div>

        <div class="form-row two">
          <div>
            <label for="city">City</label>
            <input type="text" id="city" name="city" required>
            <div class="field-error" id="err-city">Required.</div>
          </div>
          <div>
            <label for="state">State</label>
            <input type="text" id="state" name="state" required>
            <div class="field-error" id="err-state">Required.</div>
          </div>
        </div>

        <div class="form-row">
          <label for="pincode">Pincode</label>
          <input type="text" id="pincode" name="pincode" placeholder="6-digit pincode" required>
          <div class="field-error" id="err-pincode">Enter a valid 6-digit pincode.</div>
        </div>

        <div class="form-row">
          <label for="notes">Order notes (optional)</label>
          <textarea id="notes" name="notes" placeholder="Landmark, delivery instructions, etc."></textarea>
        </div>

        <button type="submit" class="btn-primary" id="submit-btn" style="width:100%;">Place Order — Pay on Delivery</button>
        <div class="form-status" id="form-status"></div>
      </form>

      <div class="order-summary">
        <h3>Order Summary</h3>
        ${summaryLines}
        <div class="summary-total"><span>Total</span><span>${formatPrice(total)}</span></div>
        <div class="stock-note" style="margin-top:16px;">Payment is collected on delivery. We'll confirm your order by email/call before dispatch.</div>
      </div>
    </div>
  `;

  document.getElementById("order-form").addEventListener("submit", handleSubmit);
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
    input.style.borderColor = "var(--line)";
  }
  return valid;
}

async function handleSubmit(e) {
  e.preventDefault();

  const validName = validateField("name", v => v.length >= 2);
  const validMobile = validateField("mobile", v => /^[6-9]\d{9}$/.test(v));
  const validAddress = validateField("address", v => v.length >= 8);
  const validCity = validateField("city", v => v.length >= 2);
  const validState = validateField("state", v => v.length >= 2);
  const validPincode = validateField("pincode", v => /^\d{6}$/.test(v));

  if (!(validName && validMobile && validAddress && validCity && validState && validPincode)) {
    document.getElementById("form-status").className = "form-status error";
    document.getElementById("form-status").textContent = "Please fix the highlighted fields.";
    return;
  }

  const cart = getCart();
  const items = cart.map(item => {
    const p = getProduct(item.id);
    return { name: p.name, code: p.code, size: item.size, qty: item.qty, price: p.price };
  });

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
    total: cartTotal()
  };

  const submitBtn = document.getElementById("submit-btn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Placing order...";
  document.getElementById("form-status").className = "form-status";
  document.getElementById("form-status").textContent = "";

  try {
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
      <div class="confirmation">
        <h1>Order placed.</h1>
        <p>We've received your order and sent a confirmation to your mobile/email. We'll reach out to confirm before dispatch.</p>
        <div class="order-id mono">${data.orderId}</div>
        <a href="shop.html" class="btn-primary">Continue Shopping</a>
      </div>
    `;
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Place Order — Pay on Delivery";
    document.getElementById("form-status").className = "form-status error";
    document.getElementById("form-status").textContent = err.message;
  }
}

renderCheckout();
