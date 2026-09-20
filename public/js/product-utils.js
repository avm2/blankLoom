/* ============================================================
   BLANKLOOM — SHARED PRODUCT HELPERS
   ------------------------------------------------------------
   Used by every page (home, shop, product, cart, checkout).
   Reads from SITE_DATA.products (defined in site-data.js).
   You shouldn't need to edit this file.
   ============================================================ */

function formatPrice(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

// Look up a product by its id from the single catalog in site-data.js
function getProduct(id) {
  return SITE_DATA.products.find(p => p.id === id);
}

// Placeholder garment-print icons, used when a product has no real photo yet.
// Keyed by the "print" value set on each product in site-data.js.
function printSVG(type) {
  const prints = {
    circle: `<circle cx="50" cy="55" r="14" stroke="#2563EB" stroke-width="2" fill="none"/>`,
    grid: `<g stroke="#10B981" stroke-width="1.2"><line x1="38" y1="45" x2="38" y2="68"/><line x1="50" y1="45" x2="50" y2="68"/><line x1="62" y1="45" x2="62" y2="68"/></g>`,
    type: `<text x="50" y="62" font-family="Space Mono, monospace" font-size="10" font-weight="700" fill="#0F172A" text-anchor="middle">TYPO</text>`,
    splatter: `<g fill="#0F172A"><circle cx="42" cy="50" r="2.4"/><circle cx="55" cy="55" r="1.6"/><circle cx="48" cy="64" r="3"/><circle cx="60" cy="46" r="1.8"/></g>`
  };
  return `<svg viewBox="0 0 100 110" role="img" aria-label="${type} print design">
    <path d="M28 8 L8 22 L15 38 L25 32 L25 100 L75 100 L75 32 L85 38 L92 22 L72 8 L60 16 L40 16 Z" stroke="#0F172A" stroke-width="1.6" fill="none"/>
    ${prints[type] || ""}
  </svg>`;
}

// Returns the markup for a product's image area — a real photo if
// product.image is set in site-data.js, otherwise the placeholder SVG.
// widthPct lets callers size the placeholder icon (e.g. "50%", "60%").
function productMedia(product, widthPct) {
  widthPct = widthPct || "50%";
  if (product.image) {
    return `<img src="${product.image}" alt="${product.name}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">`;
  }
  return `<div style="width:${widthPct};">${printSVG(product.print)}</div>`;
}
