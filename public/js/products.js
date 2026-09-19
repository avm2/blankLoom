// Product catalog — edit this list to add/remove/change tees.
// "printPath" is a tiny SVG shape drawn on the chest to fake a print design until you have real product photos.
const PRODUCTS = [
  {
    id: "static-wire",
    name: "Static Wire Tee",
    code: "BL-014",
    color: "Black",
    price: 1299,
    stock: 8,
    sizes: ["S", "M", "L", "XL"],
    desc: "Single colour front print on heavyweight 220 GSM black cotton. Screen printed in-house, one shirt at a time.",
    print: "circle"
  },
  {
    id: "loom-grid",
    name: "Loom Grid Tee",
    code: "BL-015",
    color: "Off-White",
    price: 1199,
    stock: 0,
    sizes: ["S", "M", "L", "XL"],
    desc: "Two colour back print on 220 GSM off-white cotton. This run has sold out — restock notified via Instagram.",
    print: "grid"
  },
  {
    id: "concrete-type",
    name: "Concrete Type Tee",
    code: "BL-016",
    color: "Stone Grey",
    price: 1349,
    stock: 21,
    sizes: ["S", "M", "L", "XL", "XXL"],
    desc: "Oversized chest type print on 220 GSM stone grey cotton. Boxy fit, dropped shoulder.",
    print: "type"
  },
  {
    id: "ink-bloom",
    name: "Ink Bloom Tee",
    code: "BL-017",
    color: "Black",
    price: 1349,
    stock: 14,
    sizes: ["S", "M", "L", "XL"],
    desc: "All-over splatter print on 220 GSM black cotton. No two shirts print identically.",
    print: "splatter"
  }
];

function tshirtSVG(printType, size) {
  size = size || "60%";
  const prints = {
    circle: `<circle cx="50" cy="55" r="16" stroke="#B23A2E" stroke-width="2.5" fill="none"/>`,
    grid: `<g stroke="#131313" stroke-width="1.2"><line x1="35" y1="42" x2="35" y2="70"/><line x1="50" y1="42" x2="50" y2="70"/><line x1="65" y1="42" x2="65" y2="70"/><line x1="35" y1="42" x2="65" y2="42"/><line x1="35" y1="56" x2="65" y2="56"/><line x1="35" y1="70" x2="65" y2="70"/></g>`,
    type: `<text x="50" y="60" font-family="Courier Prime, monospace" font-size="11" font-weight="700" fill="#131313" text-anchor="middle">BLNK</text>`,
    splatter: `<g fill="#131313"><circle cx="42" cy="48" r="2.5"/><circle cx="55" cy="52" r="1.6"/><circle cx="48" cy="62" r="3.2"/><circle cx="60" cy="44" r="1.8"/><circle cx="38" cy="58" r="1.4"/></g>`
  };
  return `<svg width="${size}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 8 L8 22 L15 38 L25 32 L25 100 L75 100 L75 32 L85 38 L92 22 L72 8 L60 16 L40 16 Z" stroke="#131313" stroke-width="1.6" fill="none"/>
    ${prints[printType] || ""}
  </svg>`;
}

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function formatPrice(n) {
  return "₹" + n.toLocaleString("en-IN");
}
