/* ============================================================
   BLANKLOOM — SITE DATA
   ------------------------------------------------------------
   Edit ANYTHING in this file and the homepage updates itself.
   No HTML/CSS knowledge needed to change text, prices, products,
   nav links, or footer content — just edit the values below.
   ============================================================ */

const SITE_DATA = {

  brand: {
    name: "BLANKLOOM",
    url: "https://blankloom.in",
    tagline: "Heavyweight printed cotton tees, engineered for oversized silhouette and precision prints."
  },

  // Nav bar links — add/remove/rename entries here, they render automatically.
  nav: [
    { label: "Home", href: "index.html" },
    { label: "Catalog", href: "shop.html" },
    { label: "Bestseller", href: "#bestsellers" }
  ],

  announcement: {
    highlight: "",
    items: ["FREE SHIPPING OVER ₹999", "USE CODE BLANK20"]
  },

  hero: {
    eyebrow: "◆ Limited Archive · Drop 04",
    headlineTop: "WEAR ART",
    headlineAccent: "NOT BLANKS.",
    description: "Heavyweight 220 GSM cotton tees engineered for oversized silhouette and precision hand-screen prints. No mass runs — every design is pulled to order.",
    ctaPrimary: { label: "Shop Latest Drop →", href: "shop.html" },
    ctaSecondary: { label: "Explore Catalog", href: "shop.html" },
    ratingScore: "4.9/5",
    ratingNote: "from 400+ streetwear collectors",
    badge: "220 GSM · LIMITED CUT",
    floatCard: { name: "Neon Void Tee", meta: "Structured boxy drape", price: 2499 },
    mediaLabel: "NEON VOID",
    mediaSubLabel: "CYBERNETIC SYNDICATE"
  },

  stats: [
    { value: "220", label: "GSM per Garment" },
    { value: "500", label: "DPI Screen Print", mint: true },
    { value: "0%", label: "Fade Cracking" },
    { value: "100%", label: "Ringspun Combed Cotton", mint: true }
  ],

  // Products shown in the "Trending / Bestseller" grid on the homepage.
  // print: one of "circle" | "grid" | "type" | "splatter" — controls the placeholder graphic.
  // badge: "limited" | "selling" | null
  bestsellers: {
    id: "bestsellers",
    eyebrow: "Limited Capacity Archive",
    title: "Trending Drop 04",
    products: [
      {
        id: "cyber-samurai",
        name: "Cyber Samurai Heavy Tee",
        price: 2299,
        badge: "limited",
        badgeLabel: "Limited Drop",
        stockNote: "Only 14 left",
        sizes: ["S", "M", "L", "XL"],
        print: "circle"
      },
      {
        id: "acid-botany",
        name: "Acid Botany Oversized Graphic",
        price: 2499,
        badge: "selling",
        badgeLabel: "Selling Fast",
        stockNote: "Only 8 left",
        sizes: ["M", "L", "XL", "2XL"],
        print: "grid"
      },
      {
        id: "tokyo-typo",
        name: "Tokyo Typo Monolith",
        price: 2199,
        badge: "limited",
        badgeLabel: "Limited Drop",
        stockNote: "Only 6 left",
        sizes: ["S", "M", "L"],
        print: "type"
      },
      {
        id: "desert-mirage",
        name: "Desert Mirage DTG Print",
        price: 2399,
        badge: "selling",
        badgeLabel: "Selling Fast",
        stockNote: "Only 9 left",
        sizes: ["S", "M", "L", "XL"],
        print: "splatter"
      }
    ]
  },

  specs: {
    eyebrow: "Textile Lab Specification",
    title: "Engineered for Perfection",
    description: "We built Blankloom because fast-fashion blanks shrink, curl at the collar, and peel after four washes. We engineered every seam, yarn, and ink matrix from raw thread to final cut.",
    bullets: [
      "<b>220 GSM vs typical 160 GSM blanks</b> — 50% denser fabric weight provides structural boxy silhouette without sagging or transparency.",
      "<b>Pre-shrunk 100% ringspun combed cotton</b> — hydrothermal steam stabilization prevents garment warping after every wash.",
      "<b>Eco-certified reactive DTG inks</b> — molecularly bonded into the cotton fibre so zero cracking, zero rubbery heat transfers."
    ],
    matrix: {
      headers: ["Parameter", "Typical Blanks", "Blankloom"],
      rows: [
        ["Fabric weight", "150–160 GSM (thin)", "220 GSM (heavy)"],
        ["Print longevity", "Cracks at 10–15 washes", "Permanent (50+ washes)"],
        ["Collar structure", "Basic weave distortion", "Twin-needle ribbed collar"],
        ["Fit retention", "Shrinks up to 8%", "<2% pre-shrunk"],
        ["Tactile feel", "Plastic sticker feel", "Zero-hand feel DTG ink"]
      ]
    }
  },

  ugc: {
    eyebrow: "Community Lookbook",
    title: "Seen on the Streets",
    hashtag: "#blankloom",
    tileCount: 4,
    ratingScore: "4.82/5",
    ratingNote: "from 400+ verified buyers · Tag your fit on Instagram to be featured"
  },

  teaser: {
    countdown: "Drop 05 in 04 days : 18 hours : 22 mins",
    title: "Don't Miss Drop 05: Neo-Tokyo Acid Lab.",
    description: "Limited run of 300 numbered garments. Once the allocation hits zero, plates are destroyed and this design is permanently archived.",
    emailPlaceholder: "ENTER YOUR EMAIL",
    buttonLabel: "Notify Me",
    note: "Zero spam. Only priority zero-hour release alerts."
  },

  footer: {
    description: "Heavyweight cotton streetwear, hand-pulled screen prints, and small-batch graphic garments engineered for high endurance and raw street curation.",
    ecoBadge: { title: "100% Combed Cotton", subtitle: "Sustainably sourced · 220 GSM crafted jersey" },
    columns: [
      {
        title: "Catalog",
        links: [
          { label: "Heavyweight Boxy Tees", href: "shop.html" },
          { label: "Graphic Drop 04", href: "shop.html" },
          { label: "Oversized Silhouettes", href: "shop.html" },
          { label: "Archive Reprints", href: "shop.html" }
        ]
      },
      {
        title: "Craft & Utility",
        links: [
          { label: "Sizing Matrix & Fit", href: "#" },
          { label: "Print Preservation", href: "#" },
          { label: "Drop Calendar", href: "#" },
          { label: "Track Dispatch", href: "#" }
        ]
      }
    ],
    newsletter: {
      title: "VIP Drop Radar",
      description: "Early zero-hour access to limited capsules before public sell-out.",
      placeholder: "ENTER YOUR EMAIL",
      button: "Join"
    },
    copyright: "© 2026 Blankloom Apparel Co. All Rights Reserved.",
    legalLinks: "Privacy · Terms · Release Index"
  }

};
