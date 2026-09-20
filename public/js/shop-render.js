/* ============================================================
   BLANKLOOM — CATALOG PAGE RENDERER
   ------------------------------------------------------------
   Reads SITE_DATA.products and SITE_DATA.catalogPage.
   Edit site-data.js to change products/content — not this file.
   ============================================================ */

let activeState = {
  categories: new Set(),
  sizes: new Set(),
  sort: "featured"
};

function renderNav() {
  const navEl = document.getElementById("primary-nav");
  const mobileNavEl = document.getElementById("mobile-nav");
  const linksHTML = SITE_DATA.nav.map(item =>
    `<a href="${item.href}" class="${item.href === "shop.html" ? "active" : ""}">${item.label}</a>`
  ).join("");
  navEl.innerHTML = linksHTML;
  mobileNavEl.innerHTML = linksHTML;
}

function renderAnnouncement() {
  const el = document.getElementById("announce-content");
  const items = [`<span class="hl">${SITE_DATA.announcement.highlight}</span>`]
    .concat(SITE_DATA.announcement.items.map(i => `<span>${i}</span>`));
  el.innerHTML = items.join('<span class="sep">•</span>');
}

function renderPageHeader() {
  const c = SITE_DATA.catalogPage;
  document.getElementById("catalog-eyebrow").textContent = c.eyebrow;
  document.getElementById("catalog-title").textContent = c.title;
  document.getElementById("catalog-description").textContent = c.description;
  document.getElementById("warranty-title").textContent = c.warranty.title;
  document.getElementById("warranty-text").textContent = c.warranty.text;
}

function renderFilters() {
  const categories = SITE_DATA.catalogPage.categories;
  const allSizes = ["S", "M", "L", "XL", "2XL"];

  document.getElementById("category-filters").innerHTML = categories.map(cat => {
    const count = SITE_DATA.products.filter(p => p.category === cat).length;
    return `
      <label class="check-row">
        <input type="checkbox" data-category="${cat}">
        ${cat} <span class="cnt">${count}</span>
      </label>
    `;
  }).join("");

  document.getElementById("size-filters").innerHTML = allSizes.map(s =>
    `<button type="button" class="size-chip" data-size="${s}">${s}</button>`
  ).join("");

  document.querySelectorAll('#category-filters input[type="checkbox"]').forEach(cb => {
    cb.addEventListener("change", () => {
      if (cb.checked) activeState.categories.add(cb.dataset.category);
      else activeState.categories.delete(cb.dataset.category);
      renderGrid();
    });
  });

  document.querySelectorAll("#size-filters .size-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("selected");
      if (chip.classList.contains("selected")) activeState.sizes.add(chip.dataset.size);
      else activeState.sizes.delete(chip.dataset.size);
      renderGrid();
    });
  });

  document.getElementById("filter-reset").addEventListener("click", () => {
    activeState = { categories: new Set(), sizes: new Set(), sort: "featured" };
    document.querySelectorAll('#category-filters input').forEach(cb => cb.checked = false);
    document.querySelectorAll("#size-filters .size-chip").forEach(chip => chip.classList.remove("selected"));
    document.getElementById("sort-select").value = "featured";
    renderGrid();
  });

  document.getElementById("sort-select").addEventListener("change", (e) => {
    activeState.sort = e.target.value;
    renderGrid();
  });
}

function getFilteredSortedProducts() {
  let products = SITE_DATA.products.slice();

  if (activeState.categories.size > 0) {
    products = products.filter(p => activeState.categories.has(p.category));
  }
  if (activeState.sizes.size > 0) {
    products = products.filter(p => p.sizes.some(s => activeState.sizes.has(s)));
  }

  if (activeState.sort === "price-asc") products.sort((a, b) => a.price - b.price);
  else if (activeState.sort === "price-desc") products.sort((a, b) => b.price - a.price);
  else if (activeState.sort === "newest") products.sort((a, b) => b.id.localeCompare(a.id));

  return products;
}

function renderGrid() {
  const products = getFilteredSortedProducts();
  const grid = document.getElementById("catalog-grid");
  const countEl = document.getElementById("results-count");

  countEl.textContent = `Showing ${products.length} of ${SITE_DATA.products.length} tees`;

  if (products.length === 0) {
    grid.innerHTML = `<div class="empty-results" style="grid-column:1/-1;">No tees match those filters. <button class="filter-reset" onclick="document.getElementById('filter-reset').click()">Clear filters</button></div>`;
    return;
  }

  grid.innerHTML = products.map(p => `
    <div class="pcard">
      <a href="product.html?id=${p.id}" class="pcard-media-link">
        <div class="pcard-media">
          ${p.badge ? `<span class="pbadge ${p.badge}">${p.badgeLabel}</span>` : ""}
          <button class="pwish" type="button" aria-label="Add ${p.name} to wishlist">♡</button>
          ${productMedia(p)}
          ${p.stockCount && p.stockCount <= 15 ? `<span class="pstock">Only ${p.stockCount} left</span>` : ""}
        </div>
      </a>
      <div class="pcard-body">
        <div class="rating"><span class="stars" aria-hidden="true">★★★★★</span> ${p.rating.score} (${p.rating.count})</div>
        <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="psizes">${p.sizes.map(s => `<span>${s}</span>`).join("")}</div>
        <div class="pcard-foot">
          <span class="pprice">${formatPrice(p.price)}${p.originalPrice ? `<span class="was">${formatPrice(p.originalPrice)}</span>` : ""}</span>
          <button class="pquick" type="button" data-product-id="${p.id}">Quick Add</button>
        </div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".pquick").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = getProduct(btn.dataset.productId);
      const defaultSize = product.sizes[Math.floor(product.sizes.length / 2)];
      addToCart(product.id, defaultSize, 1);
      renderCartCountLabel();
      const original = btn.textContent;
      btn.textContent = "Added ✓";
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1200);
    });
  });
}

function renderFooter() {
  const f = SITE_DATA.footer;
  document.getElementById("footer-description").textContent = f.description;
  document.getElementById("footer-eco-title").textContent = f.ecoBadge.title;
  document.getElementById("footer-eco-subtitle").textContent = f.ecoBadge.subtitle;
  document.getElementById("footer-columns").innerHTML = f.columns.map(col => `
    <div class="foot-col">
      <h4>${col.title}</h4>
      ${col.links.map(l => `<a href="${l.href}">${l.label}</a>`).join("")}
    </div>
  `).join("");
  document.getElementById("footer-newsletter-title").textContent = f.newsletter.title;
  document.getElementById("footer-newsletter-desc").textContent = f.newsletter.description;
  document.getElementById("footer-newsletter-email").placeholder = f.newsletter.placeholder;
  document.getElementById("footer-newsletter-btn").textContent = f.newsletter.button;
  document.getElementById("footer-copyright").textContent = f.copyright;
  document.getElementById("footer-legal").textContent = f.legalLinks;

  document.getElementById("footer-newsletter-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("button");
    const original = btn.textContent;
    btn.textContent = "Added ✓";
    e.target.reset();
    setTimeout(() => { btn.textContent = original; }, 1800);
  });
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
  renderPageHeader();
  renderFilters();
  renderGrid();
  renderFooter();
  renderCartCountLabel();
  initMobileMenu();
});
