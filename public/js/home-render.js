/* ============================================================
   BLANKLOOM — HOME PAGE RENDERER
   ------------------------------------------------------------
   This file reads SITE_DATA (site-data.js) and builds the page.
   You shouldn't need to edit this file — edit site-data.js instead.
   Shared helpers (formatPrice, getProduct, printSVG, productMedia)
   come from product-utils.js, loaded before this file.
   ============================================================ */

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
  const featured = getProduct(h.featuredProductId) || SITE_DATA.products[0];
  document.getElementById("hero-eyebrow").textContent = h.eyebrow;
  document.getElementById("hero-headline-top").textContent = h.headlineTop;
  document.getElementById("hero-headline-accent").textContent = h.headlineAccent;
  document.getElementById("hero-description").textContent = h.description;
  document.getElementById("hero-cta-primary").textContent = h.ctaPrimary.label;
  document.getElementById("hero-cta-primary").href = h.ctaPrimary.href;
  document.getElementById("hero-cta-secondary").textContent = h.ctaSecondary.label;
  document.getElementById("hero-cta-secondary").href = h.ctaSecondary.href;
  // document.getElementById("hero-rating-score").textContent = h.ratingScore;
  // document.getElementById("hero-rating-note").textContent = h.ratingNote;
  document.getElementById("hero-badge").textContent = h.badge;

  // document.getElementById("float-card-name").textContent = featured.name;
  // document.getElementById("float-card-meta").textContent = featured.color;
  // document.getElementById("float-card-price").textContent = formatPrice(featured.price);
  // document.getElementById("float-card-svg").innerHTML = printSVG(featured.print);

  renderHeroSlider();
}

// Builds the auto-advancing hero slider. Uses SITE_DATA.hero.slides if
// explicitly set, otherwise automatically pulls the first photo of each
// bestseller product (falling back to the placeholder icon per-product
// if that product has no real photos yet). The whole slider is one big
// link to the catalog — clicking anywhere on it goes to shop.html.
function renderHeroSlider() {
  const h = SITE_DATA.hero;
  const track = document.getElementById("hero-slider-track");
  const dotsEl = document.getElementById("hero-slider-dots");

  let slides;
  if (h.slides && h.slides.length > 0) {
    slides = h.slides.map(src => ({ type: "image", src }));
  } else {
    const bestsellerProducts = SITE_DATA.bestsellers.productIds.map(id => getProduct(id)).filter(Boolean);
    slides = bestsellerProducts.map(p => {
      if (p.images && p.images.length > 0) return { type: "image", src: p.images[0] };
      return { type: "svg", print: p.print };
    });
  }

  if (slides.length === 0) {
    slides = [{ type: "svg", print: "circle" }];
  }

  track.innerHTML = slides.map((slide, i) => `
    <div class="hero-slide${i === 0 ? " active" : ""}" data-index="${i}">
      ${slide.type === "image"
        ? `<img src="${slide.src}" alt="Blankloom catalog preview">`
        : `<svg viewBox="0 0 100 110" role="img" aria-label="Print design preview">${printSVG(slide.print).replace(/<svg[^>]*>|<\/svg>/g, "")}</svg>`}
    </div>
  `).join("");

  dotsEl.innerHTML = slides.map((_, i) => `<span class="${i === 0 ? "active" : ""}" data-index="${i}"></span>`).join("");

  if (slides.length <= 1) return;

  let current = 0;
  const slideEls = track.querySelectorAll(".hero-slide");
  const dotEls = dotsEl.querySelectorAll("span");

  function goToSlide(index) {
    slideEls[current].classList.remove("active");
    dotEls[current].classList.remove("active");
    current = index;
    slideEls[current].classList.add("active");
    dotEls[current].classList.add("active");
  }

  let autoAdvance = setInterval(() => {
    goToSlide((current + 1) % slides.length);
  }, h.slideIntervalMs || 4000);

  // Pause auto-advance while the visitor is hovering/interacting, so it
  // doesn't jump to a different slide right as they're about to click.
  const sliderEl = document.getElementById("hero-slider");
  sliderEl.addEventListener("mouseenter", () => clearInterval(autoAdvance));
  sliderEl.addEventListener("mouseleave", () => {
    autoAdvance = setInterval(() => goToSlide((current + 1) % slides.length), h.slideIntervalMs || 4000);
  });
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
  const products = b.productIds.map(id => getProduct(id)).filter(Boolean);
  const section = document.getElementById("bestsellers");
  section.setAttribute("aria-labelledby", "bestsellers-heading");
  document.getElementById("bestsellers-eyebrow").textContent = b.eyebrow;
  document.getElementById("bestsellers-heading").textContent = b.title;

  document.getElementById("bestseller-grid").innerHTML = products.map(p => `
    <div class="pcard">
      <a href="product.html?id=${p.id}" class="pcard-media-link">
        <div class="pcard-media">
          ${p.badge ? `<span class="pbadge ${p.badge}">${p.badgeLabel}</span>` : ""}
          ${productMedia(p)}
          ${p.stockCount && p.stockCount <= 15 ? `<span class="pstock">Only ${p.stockCount} left</span>` : ""}
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
      <div style="width:45%;">${printSVG("circle")}</div>
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
      const id = btn.dataset.productId;
      const product = getProduct(id);
      const defaultSize = product.sizes[Math.floor(product.sizes.length / 2)];
      addToCart(id, defaultSize, 1);
      renderCartCountLabel();
      const original = btn.textContent;
      btn.textContent = "Added ✓";
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1200);
    });
  });
}

function renderCartCountLabel() {
  const label = document.getElementById("cart-count-label");
  if (!label) return;
  const count = cartCount();
  label.textContent = count === 1 ? "1 item" : `${count} items`;
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
  renderCartCountLabel();
});