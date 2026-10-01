/* ============================================================
   BLANKLOOM — SITE DATA
   ------------------------------------------------------------
   THIS IS THE ONLY FILE YOU SHOULD NEED TO EDIT.
   Every page (home, catalog, product, cart, checkout) reads
   its text, prices, and products from this one file.

   TO ADD REAL PRODUCT PHOTOS (up to 4 per product):
   1. Drop your image files into: public/images/products/
   2. Set that product's "images" array below to the file paths,
      e.g. images: ["images/products/cyber-samurai-1.jpg", "images/products/cyber-samurai-2.jpg"]
      The FIRST image is used as the main photo everywhere (catalog,
      homepage, cart, checkout). On the product page, all of them
      (up to 4) show as clickable thumbnails — click one to swap
      the main photo, just like Flipkart/Amazon.
   3. Leave "images" as an empty array [] to keep using the
      placeholder icon instead.

   TO ADD A NEW PRODUCT: copy one of the objects in the
   "products" array below, give it a unique "id", and fill in
   your own values. It will automatically appear in the catalog,
   and on the homepage if you add its id to bestsellers.productIds.
   ============================================================ */

const SITE_DATA = {
  brand: {
    name: "BLANKLOOM",
    url: "https://blankloom.in",
    tagline:
      "Heavyweight printed cotton tees, engineered for oversized silhouette and precision prints.",
  },

  // Nav bar links — add/remove/rename entries here, they render automatically on every page.
  nav: [
    { label: "Home", href: "index.html" },
    { label: "Catalog", href: "shop.html" },
    { label: "Bestseller", href: "index.html#bestsellers" },
  ],

  announcement: {
    highlight: "⚡ DROP 04 LIVE",
    items: ["FREE SHIPPING OVER ₹999", "USE CODE BLANK10"],
  },

  // ------------------------------------------------------------------
  // FULL PRODUCT CATALOG — the single source of truth for every product.
  // Fields:
  //   id           unique slug, used in URLs (product.html?id=...)
  //   name         product title
  //   price        current price (number, no symbol)
  //   originalPrice  set a number to show a strikethrough "was" price, or null
  //   badge        "limited" | "selling" | null
  //   badgeLabel   text shown on the badge, e.g. "Limited Drop"
  //   stockCount   number of units left (used for low-stock warnings)
  //   sizes        array of available sizes
  //   color        display name of the colour, e.g. "Vintage Faded Black"
  //   print        placeholder icon key: "circle" | "grid" | "type" | "splatter"
  //                (ignored once you set a real "image")
  //   images       array of up to 4 photo paths (public/images/products/...), or []
  //                to use the placeholder icon. First image = main photo everywhere;
  //                all of them show as swappable thumbnails on the product page.
  //   rating       { score: "4.8", count: 128 }
  //   description  shown on the product detail page
  //   sku          shown on the product detail page
  //   category     used for catalog filtering, e.g. "Graphic Tees"
  // ------------------------------------------------------------------
  products: [
    {
      id: "hitman-45-oversized-tee",
      name: "Hitman 45 Oversized Tee",
      price: 549,
      originalPrice: 899,
      badge: null,
      badgeLabel: "",
      stockCount: 20,
      sizes: ["S", "M", "L", "XL"],
      color: "Cloud White",
      print: "type",
      images: [
        "images/products/white_hitMan_ModalFront.jpeg",
        "images/products/white_hitMan_ModalBack.jpeg",
        "images/products/white_hitMan_front.jpeg",
        "images/products/white_hitMan_Back.jpeg",
      ],
      rating: { score: "4.8", count: 0 },
      description:
        "A statement oversized tee built for everyday streetwear. Crafted from 240 GSM 100% cotton with a bio-washed finish for a soft, comfortable feel. Features a bold 45 graphic with a vintage-inspired print.",
      sku: "BL-H45-001",
      category: "Graphic Tees",
    },
    {
      id: "freedom-vertical-oversized-tee",
      name: "Freedom Vertical Oversized Tee",
      price: 539,
      originalPrice: 1199,
      badge: "selling",
      badgeLabel: "",
      stockCount: 10,
      sizes: ["S", "M", "L"],
      color: "Chocolate Brown",
      print: "type",
      images: [
        "images/products/Freedom_front.jpeg",
        "images/products/Freedom_back.jpeg",
        "images/products/Freedom_ModalFront.jpeg",
        "images/products/Freedom_ModalBack.jpeg",
      ],
      rating: { score: "4.9", count: 0 },
      description:
        "Made for a bold streetwear look, the Freedom Vertical Tee combines a relaxed oversized silhouette with premium 240 GSM French Terry fabric. Bio-washed for a softer hand feel, with a statement vertical FREEDOM back print.",
      sku: "BL-FR-002",
      category: "Oversized Tees",
    },
    {
      id: "king-street-graphic-tee",
      name: "King Street Graphic Tee",
      price: 569,
      originalPrice: 1999,
      badge: null,
      badgeLabel: "Trending",
      stockCount: 13,
      sizes: ["S", "M", "L"],
      color: "Jet Black",
      print: "type",
      images: [
        "images/products/KingStreet_modalBack.jpeg",
        "images/products/KingStreet_modalFront.jpeg",
        "images/products/KingStreet_back.jpeg",
      ],
      rating: { score: "4.8", count: 0 },
      description:
        "A minimal black streetwear essential featuring a bold KING graphic. Made with 240 GSM 100% cotton and finished with a bio wash for a soft, comfortable feel that works effortlessly with everyday fits.",
      sku: "BL-KS-003",
      category: "Graphic Tees",
    },

    {
      id: "18-forever-legacy-tee",
      name: "18 Forever Legacy Tee",
      price: 999,
      originalPrice: null,
      badge: "selling",
      badgeLabel: "Trending",
      stockCount: 20,
      sizes: ["S", "M", "L", "XL", "XXL"],
      color: "Jet Black",
      print: "type",
      images: [
        "images/products/1000144495.jpg",
        "images/products/1000144066.jpg",
        "images/products/1000144498.jpg",
        "images/products/1000144535.jpg",
      ],
      rating: { score: "4.9", count: 0 },
      description:
        "A statement black tee made for fans of iconic cricket moments. Featuring a minimal 18 graphic on the front and a bold 18 Forever collage on the back. Crafted from 180 GSM 100% cotton with a bio-washed finish for a soft, comfortable feel and everyday streetwear styling.",
      sku: "BL-18FL-007",
      category: "Graphic Tees",
    },

   
  ],

  // ------------------------------------------------------------------
  // HOMEPAGE CONTENT
  // ------------------------------------------------------------------
  hero: {
    eyebrow: "◆ Limited Archive · Drop 04",
    headlineTop: "WEAR ART",
    headlineAccent: "NOT BLANKS.",
    description:
      "Heavyweight 240 GSM cotton tees engineered for oversized silhouette and precision hand-screen prints. No mass runs — every design is pulled to order.",
    ctaPrimary: { label: "Shop Latest Drop →", href: "shop.html" },
    ctaSecondary: { label: "Explore Catalog", href: "shop.html" },
    // ratingScore: "4.9/5",
    // ratingNote: "from 400+ streetwear collectors",
    badge: "240 GSM · LIMITED CUT",
    featuredProductId: "acid-botany",
    mediaLabel: "NEON VOID",
    mediaSubLabel: "CYBERNETIC SYNDICATE",

    // ------------------------------------------------------------
    // HERO IMAGE SLIDER — auto-advancing slideshow on the homepage.
    // Clicking any slide takes the visitor to the catalog (shop.html).
    //
    // OPTION A (recommended): leave this as an empty array below.
    // The slider will then automatically show the first photo of
    // each product listed in bestsellers.productIds further down
    // this file — so once you add real photos to those products'
    // "images" arrays, the slider fills itself in with zero extra work.
    //
    // OPTION B: list specific image paths here to show exact photos
    // in an exact order, regardless of which products they belong to:
    //   slides: ["images/products/photo1.jpg", "images/products/photo2.jpg"]
    //
    // slideIntervalMs controls how long each slide stays up before
    // auto-advancing (4000 = 4 seconds).
    slides: [],
    slideIntervalMs: 4000,
  },

  stats: [
    { value: "240", label: "GSM per Garment" },
    { value: "500", label: "DPI Screen Print", mint: true },
    { value: "0%", label: "Fade Cracking" },
    { value: "100%", label: "Ringspun Combed Cotton", mint: true },
  ],

  // Which products show in the homepage "Trending Drop" grid — just list their ids.
  bestsellers: {
    id: "bestsellers",
    eyebrow: "Limited Capacity Archive",
    title: "Trending Drop 04",
    productIds: [
      
      "hitman-45-oversized-tee",
      "king-street-graphic-tee",
      "freedom-vertical-oversized-tee",
     "18-forever-legacy-tee",
    ],
  },

  specs: {
    eyebrow: "Textile Lab Specification",
    title: "Engineered for Perfection",
    description:
      "We built Blankloom because fast-fashion blanks shrink, curl at the collar, and peel after four washes. We engineered every seam, yarn, and ink matrix from raw thread to final cut.",
    bullets: [
      "<b>240 GSM vs typical 160 GSM blanks</b> — 50% denser fabric weight provides structural boxy silhouette without sagging or transparency.",
      "<b>Pre-shrunk 100% ringspun combed cotton</b> — hydrothermal steam stabilization prevents garment warping after every wash.",
      "<b>Eco-certified reactive DTG inks</b> — molecularly bonded into the cotton fibre so zero cracking, zero rubbery heat transfers.",
    ],
    matrix: {
      headers: ["Parameter", "Typical Blanks", "Blankloom"],
      rows: [
        ["Fabric weight", "150–160 GSM (thin)", "240 GSM (heavy)"],
        ["Print longevity", "Cracks at 10–15 washes", "Permanent (50+ washes)"],
        [
          "Collar structure",
          "Basic weave distortion",
          "Twin-needle ribbed collar",
        ],
        ["Fit retention", "Shrinks up to 8%", "<2% pre-shrunk"],
        ["Tactile feel", "Plastic sticker feel", "Zero-hand feel DTG ink"],
      ],
    },
  },

  ugc: {
    eyebrow: "Community Lookbook",
    title: "Seen on the Streets",
    hashtag: "#blankloom",
    tileCount: 4,
    ratingScore: "4.82/5",
    ratingNote:
      "from 400+ verified buyers · Tag your fit on Instagram to be featured",
  },

  teaser: {
    countdown: "Drop 05 in 04 days : 18 hours : 22 mins",
    title: "Don't Miss Drop 05: Neo-Tokyo Acid Lab.",
    description:
      "Limited run of 300 numbered garments. Once the allocation hits zero, plates are destroyed and this design is permanently archived.",
    emailPlaceholder: "ENTER YOUR EMAIL",
    buttonLabel: "Notify Me",
    note: "Zero spam. Only priority zero-hour release alerts.",
  },

  // ------------------------------------------------------------------
  // CATALOG PAGE (shop.html) CONTENT
  // ------------------------------------------------------------------
  catalogPage: {
    eyebrow: "Batch #047 · In Stock",
    title: "All Printed Graphic Tees",
    description:
      "Screen-printed and DTG-cured streetwear staples engineered with drop shoulders, dense organic fibre, and anti-crack reactive dyes.",
    categories: ["Graphic Tees", "Acid Wash", "Minimalist", "Typography"],
    warranty: {
      title: "Screen Print Warranty",
      text: "Anti-crack cure, wash tested over 60 mechanical cycles.",
    },
  },

  // ------------------------------------------------------------------
  // CART PAGE CONTENT
  // ------------------------------------------------------------------
  cartPage: {
    freeShippingThreshold: 999,
    addon: {
      name: "Fabric Care Wash Bag",
      description: "Protects cured prints",
      price: 299,
    },
  },

  coupons: [
    {
      code: "BLANK10",
      type: "percent",
      value: 10,
      description: "10% off your order",
    },
    {
      code: "avm10",
      type: "flat",
      value: 100,
      description: "₹100 off your order",
    },
  ],

  // ------------------------------------------------------------------
  // FOOTER (shared across every page)
  // ------------------------------------------------------------------
  footer: {
    description:
      "Heavyweight cotton streetwear, hand-pulled screen prints, and small-batch graphic garments engineered for high endurance and raw street curation.",
    ecoBadge: {
      title: "100% Combed Cotton",
      subtitle: "Sustainably sourced · 240 GSM crafted jersey",
    },
    columns: [
      {
        title: "Catalog",
        links: [
          { label: "Heavyweight Boxy Tees", href: "shop.html" },
          { label: "Graphic Drop 04", href: "shop.html" },
          { label: "Oversized Silhouettes", href: "shop.html" },
          { label: "Archive Reprints", href: "shop.html" },
        ],
      },
      {
        title: "Craft & Utility",
        links: [
          { label: "Sizing Matrix & Fit", href: "#" },
          { label: "Print Preservation", href: "#" },
          { label: "Drop Calendar", href: "#" },
          { label: "Track Dispatch", href: "#" },
        ],
      },
    ],
    newsletter: {
      title: "VIP Drop Radar",
      description:
        "Early zero-hour access to limited capsules before public sell-out.",
      placeholder: "ENTER YOUR EMAIL",
      button: "Join",
    },
    copyright: "© 2026 Blankloom Apparel Co. All Rights Reserved.",
    legalLinks: "Privacy · Terms · Release Index",
  },
};
