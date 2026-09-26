/* ============================================================
   BLANKLOOM — PRODUCT PAGE RENDERER
   ------------------------------------------------------------
   Reads the product whose id matches ?id= in the URL from
   SITE_DATA.products. Edit site-data.js to change product
   content — not this file.
   ============================================================ */

let selectedSize = null;
let selectedQty = 1;
let currentProduct = null;

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

function renderProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  currentProduct = getProduct(id) || SITE_DATA.products[0];
  const p = currentProduct;

  document.title = `${p.name} — Blankloom`;
  document.querySelector('meta[name="description"]').setAttribute("content", p.description);
  document.getElementById("breadcrumb-name").textContent = p.name;

  const inStock = p.stockCount > 0;

  // Gallery: use real photos if provided, otherwise fall back to the
  // placeholder icon with no thumbnail strip.
  const hasPhotos = p.images && p.images.length > 0;
  const galleryImages = hasPhotos ? p.images.slice(0, 4) : [];

  function renderMainMedia(src) {
    const badges = `
      <div class="media-badges">
        <span class="b-drop">Drop 04 / Exclusive</span>
        <span class="b-gsm">220 GSM Heavyweight</span>
      </div>
    `;
    document.getElementById("main-media").innerHTML = src
      ? `${badges}<img src="${src}" alt="${p.name}">`
      : `${badges}<div>${printSVG(p.print)}</div>`;
  }

  if (hasPhotos) {
    renderMainMedia(galleryImages[0]);
    document.getElementById("thumbs").innerHTML = galleryImages.map((src, i) => `
      <button type="button" class="thumb${i === 0 ? " active" : ""}" data-src="${src}" aria-label="View photo ${i + 1} of ${p.name}">
        <img src="${src}" alt="">
      </button>
    `).join("");
    document.querySelectorAll(".thumb").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".thumb").forEach(t => t.classList.remove("active"));
        btn.classList.add("active");
        renderMainMedia(btn.dataset.src);
      });
    });
  } else {
    renderMainMedia(null);
    document.getElementById("thumbs").innerHTML = "";
  }

  document.getElementById("info-badges").innerHTML = `
    <span class="b-bestseller">${p.rating.count > 60 ? "Bestseller" : "New Arrival"}</span>
    <span class="${inStock ? "b-instock" : "b-outofstock"}">${inStock ? "● In Stock · Ships Today" : "Out of Stock"}</span>
  `;
  document.getElementById("pd-title").textContent = p.name;
  document.getElementById("pd-rating").innerHTML = `<span class="stars" aria-hidden="true">★★★★★</span> ${p.rating.score} (${p.rating.count} Reviews)`;

  document.getElementById("pd-price").innerHTML = `
    <span class="now">${formatPrice(p.price)}</span>
    ${p.originalPrice ? `<span class="was">${formatPrice(p.originalPrice)}</span><span class="save">SAVE ${Math.round((1 - p.price / p.originalPrice) * 100)}%</span>` : ""}
  `;

  document.getElementById("color-label").textContent = `Colour: ${p.color}`;

  document.getElementById("pd-sizes").innerHTML = p.sizes.map(s =>
    `<button type="button" class="size-box" data-size="${s}">${s}</button>`
  ).join("");
  document.querySelectorAll(".size-box").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".size-box").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSize = btn.dataset.size;
      document.getElementById("size-note").textContent = "";
      document.getElementById("size-note").className = "size-note";
    });
  });

  document.getElementById("size-note").innerHTML = p.stockCount <= 10 && inStock
    ? `⚠ Only ${p.stockCount} left · <b>Boxy Relaxed Silhouette</b>`
    : `<b>Boxy Relaxed Silhouette</b>`;

  document.getElementById("qty-val").textContent = selectedQty;
  document.getElementById("qty-minus").addEventListener("click", () => {
    selectedQty = Math.max(1, selectedQty - 1);
    document.getElementById("qty-val").textContent = selectedQty;
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    selectedQty = Math.min(p.stockCount || 1, selectedQty + 1);
    document.getElementById("qty-val").textContent = selectedQty;
  });

  const addBtn = document.getElementById("btn-add");
  if (!inStock) {
    addBtn.textContent = "Out of Stock";
    addBtn.disabled = true;
  } else {
    addBtn.textContent = `Add to Bag · ${formatPrice(p.price)}`;
    addBtn.addEventListener("click", () => {
      if (!selectedSize) {
        const note = document.getElementById("size-note");
        note.textContent = "Please select a size first.";
        note.className = "size-note error";
        return;
      }
      addToCart(p.id, selectedSize, selectedQty);
      renderCartCountLabel();
      addBtn.textContent = "Added ✓";
      setTimeout(() => { addBtn.textContent = `Add to Bag · ${formatPrice(p.price)}`; }, 1400);
    });
  }

  document.getElementById("spec-description").innerHTML = p.description;
  document.getElementById("spec-sku").textContent = p.sku;
}

function renderRelated() {
  const related = SITE_DATA.products.filter(p => p.id !== currentProduct.id && p.category === currentProduct.category).slice(0, 4);
  const fallback = related.length > 0 ? related : SITE_DATA.products.filter(p => p.id !== currentProduct.id).slice(0, 4);
  document.getElementById("related-grid").innerHTML = fallback.map(p => `
    <div class="pcard">
      <a href="product.html?id=${p.id}" class="pcard-media-link">
        <div class="pcard-media">
          ${p.badge ? `<span class="pbadge ${p.badge}">${p.badgeLabel}</span>` : ""}
          ${productMedia(p)}
        </div>
      </a>
      <div class="pcard-body">
        <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="pcard-foot"><span class="pprice">${formatPrice(p.price)}</span></div>
      </div>
    </div>
  `).join("");
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

function renderCartCountLabel() {
  const label = document.getElementById("cart-count-label");
  if (!label) return;
  const count = cartCount();
  label.textContent = count === 1 ? "1 item" : `${count} items`;
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
  renderProduct();
  renderRelated();
  renderFooter();
  renderCartCountLabel();
  initMobileMenu();
});
