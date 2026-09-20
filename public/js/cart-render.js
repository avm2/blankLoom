/* ============================================================
   BLANKLOOM — CART PAGE RENDERER
   ------------------------------------------------------------
   Renders the REAL cart (stored in the browser via cart.js).
   Free shipping threshold is set in site-data.js -> cartPage.
   ============================================================ */

function renderNav() {
  const navEl = document.getElementById("primary-nav");
  const mobileNavEl = document.getElementById("mobile-nav");
  const linksHTML = SITE_DATA.nav.map(item => `<a href="${item.href}">${item.label}</a>`).join("");
  navEl.innerHTML = linksHTML;
  mobileNavEl.innerHTML = linksHTML;
}

function renderAnnouncement() {
  const el = document.getElementById("announce-content");
  const items = [`<span class="hl">${SITE_DATA.announcement.highlight}</span>`]
    .concat(SITE_DATA.announcement.items.map(i => `<span>${i}</span>`));
  el.innerHTML = items.join('<span class="sep">•</span>');
}

function renderShippingProgress(total) {
  const threshold = SITE_DATA.cartPage.freeShippingThreshold;
  const el = document.getElementById("ship-progress");
  const unlocked = total >= threshold;
  const pct = Math.min(100, Math.round((total / threshold) * 100));

  el.className = "ship-progress" + (unlocked ? "" : " pending");
  el.innerHTML = unlocked
    ? `
      <div class="row"><span class="label">FREE SHIPPING</span><span>${formatPrice(total)} / ${formatPrice(threshold)}</span></div>
      <div class="track"><div class="fill" style="width:100%;"></div></div>
      <div class="note">✅ <b>You've unlocked FREE Shipping!</b></div>
    `
    : `
      <div class="row"><span class="label">FREE SHIPPING</span><span>${formatPrice(total)} / ${formatPrice(threshold)}</span></div>
      <div class="track"><div class="fill" style="width:${pct}%;"></div></div>
      <div class="note">Only <b>${formatPrice(threshold - total)}</b> away from FREE shipping!</div>
    `;
}

function renderCart() {
  const cart = getCart();
  const root = document.getElementById("cart-root");

  if (cart.length === 0) {
    document.getElementById("ship-progress").style.display = "none";
    root.innerHTML = `<div class="empty-cart"><p>Your bag is empty.</p><a href="shop.html" class="btn-primary" style="margin-top:16px;">Browse the catalog</a></div>`;
    return;
  }

  document.getElementById("ship-progress").style.display = "block";
  const total = cartTotal();
  renderShippingProgress(total);

  const itemsHTML = cart.map(item => {
    const p = getProduct(item.id);
    if (!p) return "";
    return `
      <div class="cart-item">
        <div class="thumb">${productMedia(p)}</div>
        <div>
          <div class="name"><a href="product.html?id=${p.id}">${p.name}</a></div>
          <div class="meta">${p.color} · Size ${item.size}</div>
          <button class="remove" type="button" onclick="handleRemove('${item.id}','${item.size}')">🗑 Remove</button>
        </div>
        <div class="qty-stepper">
          <button type="button" onclick="handleQty('${item.id}','${item.size}', ${item.qty - 1})" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button type="button" onclick="handleQty('${item.id}','${item.size}', ${item.qty + 1})" aria-label="Increase quantity">+</button>
        </div>
        <div class="item-price">${formatPrice(p.price * item.qty)}</div>
      </div>
    `;
  }).join("");

  const threshold = SITE_DATA.cartPage.freeShippingThreshold;
  const shippingLine = total >= threshold ? "Free" : formatPrice(0) + " (calculated at checkout)";

  root.innerHTML = `
    <div class="cart-layout">
      <div class="cart-list">${itemsHTML}</div>
      <div class="order-summary">
        <h3>Order Summary</h3>
        <div class="summary-line"><span>Subtotal</span><span>${formatPrice(total)}</span></div>
        <div class="summary-line"><span>Shipping</span><span>${total >= threshold ? "Free" : "Calculated at checkout"}</span></div>
        <div class="summary-total"><span>Total</span><span>${formatPrice(total)}</span></div>
        <a href="checkout.html" class="btn-checkout">Proceed to Checkout</a>
        <div class="cod-note">Pay on delivery · We'll confirm your order by phone before dispatch</div>
      </div>
    </div>
  `;
}

function handleRemove(id, size) {
  removeFromCart(id, size);
  renderCart();
}
function handleQty(id, size, qty) {
  if (qty < 1) { handleRemove(id, size); return; }
  updateQty(id, size, qty);
  renderCart();
}

function renderFooter() {
  const f = SITE_DATA.footer;
  document.getElementById("footer-description").textContent = f.description;
  document.getElementById("footer-eco-title").textContent = f.ecoBadge.title;
  document.getElementById("footer-eco-subtitle").textContent = f.ecoBadge.subtitle;
  document.getElementById("footer-columns").innerHTML = f.columns.map(col => `
    <div class="foot-col"><h4>${col.title}</h4>${col.links.map(l => `<a href="${l.href}">${l.label}</a>`).join("")}</div>
  `).join("");
  document.getElementById("footer-copyright").textContent = f.copyright;
  document.getElementById("footer-legal").textContent = f.legalLinks;
}

function initMobileMenu() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("mobile-nav");
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.textContent = isOpen ? "✕" : "☰";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  renderAnnouncement();
  renderCart();
  renderFooter();
  initMobileMenu();
});
