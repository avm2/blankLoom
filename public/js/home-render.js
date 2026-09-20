/* ============================================================
   BLANKLOOM — HOME PAGE RENDERER
   ------------------------------------------------------------
   This file reads SITE_DATA (site-data.js) and builds the page.
   You shouldn't need to edit this file — edit site-data.js instead.
   ============================================================ */

// Placeholder garment-print icons, keyed by the "print" value used in site-data.js.
function printSVG(type, extraAttrs) {
  extraAttrs = extraAttrs || "";
  const prints = {
    circle: `<circle cx="50" cy="55" r="14" stroke="#2563EB" stroke-width="2" fill="none"/>`,
    grid: `<g stroke="#10B981" stroke-width="1.2"><line x1="38" y1="45" x2="38" y2="68"/><line x1="50" y1="45" x2="50" y2="68"/><line x1="62" y1="45" x2="62" y2="68"/></g>`,
    type: `<text x="50" y="62" font-family="Space Mono, monospace" font-size="10" font-weight="700" fill="#0F172A" text-anchor="middle">TYPO</text>`,
    splatter: `<g fill="#0F172A"><circle cx="42" cy="50" r="2.4"/><circle cx="55" cy="55" r="1.6"/><circle cx="48" cy="64" r="3"/><circle cx="60" cy="46" r="1.8"/></g>`
  };
  return `<svg viewBox="0 0 100 110" role="img" aria-label="${type} print design" ${extraAttrs}>
    <path d="M28 8 L8 22 L15 38 L25 32 L25 100 L75 100 L75 32 L85 38 L92 22 L72 8 L60 16 L40 16 Z" stroke="#0F172A" stroke-width="1.6" fill="none"/>
    ${prints[type] || ""}
  </svg>`;
}

function formatPrice(n) {
  return "₹" + n.toLocaleString("en-IN");
}

function renderNav() {
  const navEl = document.getElementById("primary-nav");
  const mobileNavEl = document.getElementById("mobile-nav");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  const linksHTML = SITE_DATA.nav.map(item => {
    const isActive = item.href === currentPage || (item.href.startsWith("#") && currentPage === "index.html" && item.label === "Home");
    return `<a href="${item.href}" class="${item.href === "index.html" && (currentPage === "index.html" || currentPage === "") ? "active" : ""}">${item.label}</a>`;
  }).join("");

  navEl.innerHTML = linksHTML;
  mobileNavEl.innerHTML = linksHTML;
}

function renderAnnouncement() {
  const el = document.getElementById("announce-content");
  const items = [`<span class="hl">${SITE_DATA.announcement.highlight}</span>`]
    .concat(SITE_DATA.announcement.items.map(i => `<span>${i}</span>`));
  el.innerHTML = items.join('<span class="sep">•</span>');
}

function renderHero() {
  const h = SITE_DATA.hero;
  document.getElementById("hero-eyebrow").textContent = h.eyebrow;
  document.getElementById("hero-headline-top").textContent = h.headlineTop;
  document.getElementById("hero-headline-accent").textContent = h.headlineAccent;
  document.getElementById("hero-description").textContent = h.description;
  document.getElementById("hero-cta-primary").textContent = h.ctaPrimary.label;
  document.getElementById("hero-cta-primary").href = h.ctaPrimary.href;
  document.getElementById("hero-cta-secondary").textContent = h.ctaSecondary.label;
  document.getElementById("hero-cta-secondary").href = h.ctaSecondary.href;
  document.getElementById("hero-rating-score").textContent = h.ratingScore;
  document.getElementById("hero-rating-note").textContent = h.ratingNote;
  document.getElementById("hero-badge").textContent = h.badge;
  document.getElementById("hero-media-svg").innerHTML = `
    <path d="M28 8 L8 22 L15 38 L25 32 L25 100 L75 100 L75 32 L85 38 L92 22 L72 8 L60 16 L40 16 Z" stroke="#fff" stroke-width="1.6" fill="none" opacity="0.9"/>
    <text x="50" y="60" font-family="Space Mono, monospace" font-size="9" font-weight="700" fill="#2563EB" text-anchor="middle">${h.mediaLabel}</text>
    <text x="50" y="70" font-family="Space Mono, monospace" font-size="5" fill="#a6acc2" text-anchor="middle">${h.mediaSubLabel}</text>
  `;
  document.getElementById("float-card-name").textContent = h.floatCard.name;
  document.getElementById("float-card-meta").textContent = h.floatCard.meta;
  document.getElementById("float-card-price").textContent = formatPrice(h.floatCard.price);
  document.getElementById("float-card-svg").innerHTML = printSVG("circle");
}

function renderStats() {
  const el = document.getElementById("stats-grid");
  el.innerHTML = SITE_DATA.stats.map(s => `
    <div>
      <div class="num${s.mint ? " mint" : ""}">${s.value}</div>
      <div class="label">${s.label}</div>
    </div>
  `).join("");
}

function renderBestsellers() {
  const b = SITE_DATA.bestsellers;
  const section = document.getElementById("bestsellers");
  section.setAttribute("aria-labelledby", "bestsellers-heading");
  document.getElementById("bestsellers-eyebrow").textContent = b.eyebrow;
  document.getElementById("bestsellers-heading").textContent = b.title;

  document.getElementById("bestseller-grid").innerHTML = b.products.map(p => `
    <div class="pcard">
      <a href="product.html?id=${p.id}" class="pcard-media-link">
        <div class="pcard-media">
          ${p.badge ? `<span class="pbadge ${p.badge}">${p.badgeLabel}</span>` : ""}
          ${printSVG(p.print)}
          ${p.stockNote ? `<span class="pstock">${p.stockNote}</span>` : ""}
        </div>
      </a>
      <div class="pcard-body">
        <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="psizes">${p.sizes.map(s => `<span>${s}</span>`).join("")}</div>
        <div class="pcard-foot">
          <span class="pprice">${formatPrice(p.price)}</span>
          <button class="pquick" type="button" data-product-id="${p.id}">Quick Add</button>
        </div>
      </div>
    </div>
  `).join("");
}

function renderSpecs() {
  const s = SITE_DATA.specs;
  document.getElementById("specs-eyebrow").textContent = s.eyebrow;
  document.getElementById("specs-heading").textContent = s.title;
  document.getElementById("specs-description").textContent = s.description;
  document.getElementById("specs-bullets").innerHTML = s.bullets.map(b => `
    <li><span class="check" aria-hidden="true">✓</span><span>${b}</span></li>
  `).join("");

  const headRow = `<div class="matrix-row head">${s.matrix.headers.map(h => `<div>${h}</div>`).join("")}</div>`;
  const dataRows = s.matrix.rows.map(row => `
    <div class="matrix-row">
      <div>${row[0]}</div>
      <div class="std">${row[1]}</div>
      <div class="us">${row[2]}</div>
    </div>
  `).join("");
  document.getElementById("matrix-table").innerHTML = headRow + dataRows;
}

function renderUGC() {
  const u = SITE_DATA.ugc;
  document.getElementById("ugc-eyebrow").textContent = u.eyebrow;
  document.getElementById("ugc-heading").textContent = u.title;
  document.getElementById("ugc-grid").innerHTML = Array.from({ length: u.tileCount }).map(() => `
    <div class="ugc-tile">
      ${printSVG("circle", 'width="45%"')}
      <span class="tag-handle">${u.hashtag}</span>
    </div>
  `).join("");
  document.getElementById("ugc-rating-score").textContent = u.ratingScore;
  document.getElementById("ugc-rating-note").textContent = u.ratingNote;
}

function renderTeaser() {
  const t = SITE_DATA.teaser;
  document.getElementById("teaser-countdown").textContent = t.countdown;
  document.getElementById("teaser-heading").textContent = t.title;
  document.getElementById("teaser-description").textContent = t.description;
  document.getElementById("teaser-email").placeholder = t.emailPlaceholder;
  document.getElementById("teaser-button").textContent = t.buttonLabel;
  document.getElementById("teaser-note").textContent = t.note;
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
}

function renderStructuredData() {
  const products = SITE_DATA.bestsellers.products.map(p => ({
    "@type": "Product",
    "name": p.name,
    "offers": {
      "@type": "Offer",
      "price": p.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    }
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": SITE_DATA.brand.name,
    "url": SITE_DATA.brand.url,
    "description": SITE_DATA.brand.tagline,
    "makesOffer": products
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
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

function initQuickAdd() {
  document.querySelectorAll(".pquick").forEach(btn => {
    btn.addEventListener("click", () => {
      const original = btn.textContent;
      btn.textContent = "Added ✓";
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1200);
    });
  });
}

function initNewsletterForms() {
  document.querySelectorAll("#teaser-form, #footer-newsletter-form").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button");
      const original = btn.textContent;
      btn.textContent = "Added ✓";
      form.reset();
      setTimeout(() => { btn.textContent = original; }, 1800);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  renderAnnouncement();
  renderHero();
  renderStats();
  renderBestsellers();
  renderSpecs();
  renderUGC();
  renderTeaser();
  renderFooter();
  renderStructuredData();
  initMobileMenu();
  initQuickAdd();
  initNewsletterForms();
});
