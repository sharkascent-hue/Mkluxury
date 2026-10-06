/*
 * MK Luxury — product catalogue
 *
 * To add or change products, edit only this file.
 * - brand:    one of the "id" values in BRANDS.
 * - category: one of the "id" values in CATEGORIES.
 * - images:   photo paths. The first is the cover, the second appears on hover,
 *             and all of them show on the product page.
 * - price:    leave as null to show "Price on request".
 * - oldPrice: previous price when on sale (optional).
 * - colors:   colour swatches. "image" is the index in `images` to show when
 *             that colour is picked (optional).
 * - finishes: extra option such as Matte / Glossy (optional).
 * - sizes:    "clothing", "shoes", or your own list, e.g. ["S", "M", "L"].
 * - badge:    "New", "Bestseller", "Sale", ... (optional).
 * - featured: true to show it on the home page.
 */

const IMG = "images/products/";

const SIZES = {
  clothing: ["XS", "S", "M", "L", "XL", "XXL"],
  shoes: ["39", "40", "41", "42", "43", "44", "45"]
};

const BRANDS = [
  { id: "moncler",      name: "Moncler",           blurb: "Glossy down jackets and quilted puffers built for the cold." },
  { id: "canada-goose", name: "Canada Goose",      blurb: "Hooded down jackets and fur-trimmed parkas for real winters." },
  { id: "burberry",     name: "Burberry",          blurb: "Check-lined puffers and hoodies with the signature pattern." },
  { id: "louis-vuitton",name: "Louis Vuitton",     blurb: "Monogram sneakers and clean hooded windbreakers." },
  { id: "ralph-lauren", name: "Polo Ralph Lauren", blurb: "Cable-knit sweaters and everyday zip tracksuits." },
  { id: "hermes",       name: "Hermès",            blurb: "Refined knit polos, tailored sets and runner sneakers." },
  { id: "dior",         name: "Dior",              blurb: "Minimal sweatshirts with the iconic CD detail." },
  { id: "prada",        name: "Prada",             blurb: "Sharp tailored trousers with the triangle logo." }
];

const CATEGORIES = [
  { id: "puffers",    name: "Puffers",    cover: IMG + "mont-parlak-3renk.jpg" },
  { id: "parkas",     name: "Parkas",     cover: IMG + "parka-lacivert.jpg" },
  { id: "jackets",    name: "Jackets",    cover: IMG + "ruzgarlik-3renk.jpg" },
  { id: "knitwear",   name: "Knitwear",   cover: IMG + "triko-yarim-fermuar-3renk.jpg" },
  { id: "hoodies",    name: "Hoodies",    cover: IMG + "hoodie-ekose-6renk.jpg" },
  { id: "tracksuits", name: "Tracksuits", cover: IMG + "esofman-bej.jpg" },
  { id: "sets",       name: "Sets",       cover: IMG + "kombin-pantolon-sweat.jpg" },
  { id: "sneakers",   name: "Sneakers",   cover: IMG + "sneaker-mavi.jpg" }
];

/* swatch colours */
const COLOR = {
  Black: "#141414", White: "#f5f3ee", Cream: "#ece3d1", Beige: "#d6c7ab", Grey: "#9b9b9b",
  Navy: "#1e2945", "Royal Blue": "#2650c4", "Sky Blue": "#9fc5ea", Green: "#2f4a3c"
};

const PRODUCTS = [
  {
    id: 1, brand: "moncler", name: "Glossy Quilted Down Jacket", category: "puffers", price: null, badge: "New", featured: true,
    sizes: "clothing",
    colors: [{ name: "Grey" }, { name: "Green" }, { name: "White" }],
    images: [IMG + "mont-parlak-3renk.jpg", IMG + "mont-kol-detay.jpg"]
  },
  {
    id: 2, brand: "canada-goose", name: "Hooded Down Jacket", category: "puffers", price: null, badge: "Bestseller", featured: true,
    sizes: "clothing",
    colors: [{ name: "Navy", image: 0 }, { name: "Grey", image: 1 }, { name: "Black", image: 2 }],
    images: [IMG + "mont-mat-lacivert.jpg", IMG + "mont-gri.jpg", IMG + "mont-4renk-magaza.jpg"]
  },
  {
    id: 3, brand: "canada-goose", name: "Glossy Hooded Down Jacket", category: "puffers", price: null,
    sizes: "clothing",
    colors: [{ name: "Black" }],
    images: [IMG + "mont-parlak-siyah.jpg", IMG + "mont-4renk-magaza.jpg"]
  },
  {
    id: 4, brand: "burberry", name: "Check-Lined Hooded Puffer", category: "puffers", price: null, badge: "New", featured: true,
    sizes: "clothing",
    colors: [{ name: "Royal Blue", image: 0 }, { name: "Cream", image: 1 }],
    images: [IMG + "mont-ekose-saks.jpg", IMG + "mont-ekose-krem.jpg"]
  },
  {
    id: 5, brand: "canada-goose", name: "Fur-Trim Hooded Parka", category: "parkas", price: null, badge: "New", featured: true,
    sizes: "clothing",
    colors: [{ name: "Navy", image: 0 }, { name: "Grey", image: 1 }],
    images: [IMG + "parka-lacivert.jpg", IMG + "parka-gri.jpg", IMG + "parka-detay-1.jpg", IMG + "parka-detay-2.jpg"]
  },
  {
    id: 6, brand: "louis-vuitton", name: "Hooded Windbreaker", category: "jackets", price: null,
    sizes: "clothing",
    colors: [{ name: "Beige" }, { name: "Navy" }, { name: "Black" }],
    images: [IMG + "ruzgarlik-3renk.jpg"]
  },
  {
    id: 7, brand: "louis-vuitton", name: "Monogram Denim Trainer", category: "sneakers", price: null, badge: "Bestseller", featured: true,
    sizes: "shoes",
    colors: [{ name: "Royal Blue" }],
    images: [IMG + "sneaker-mavi.jpg", IMG + "sneaker-mavi-taban.jpg"]
  },
  {
    id: 8, brand: "louis-vuitton", name: "Monogram Leather Trainer", category: "sneakers", price: null,
    sizes: "shoes",
    colors: [{ name: "Black" }],
    images: [IMG + "sneaker-siyah.jpg"]
  },
  {
    id: 9, brand: "moncler", name: "Glossy Hooded Puffer", category: "puffers", price: null, badge: "New",
    sizes: "clothing",
    colors: [{ name: "Navy" }, { name: "Royal Blue" }, { name: "Sky Blue" }],
    images: [IMG + "mont-parlak-mavi-3renk.jpg"]
  },
  {
    id: 10, brand: "moncler", name: "Classic Hooded Puffer", category: "puffers", price: null,
    sizes: "clothing",
    colors: [{ name: "Black" }],
    finishes: ["Matte", "Glossy"],
    images: [IMG + "mont-siyah-mat-parlak.jpg"]
  },
  {
    id: 11, brand: "ralph-lauren", name: "Cable-Knit Half-Zip Sweater", category: "knitwear", price: null, badge: "Bestseller", featured: true,
    sizes: "clothing",
    colors: [{ name: "Navy", image: 0 }, { name: "White", image: 1 }, { name: "Black", image: 0 }],
    images: [IMG + "triko-yarim-fermuar-3renk.jpg", IMG + "triko-yarim-fermuar-beyaz.jpg"]
  },
  {
    id: 12, brand: "burberry", name: "Check-Hood Zip Hoodie", category: "hoodies", price: null, badge: "New", featured: true,
    sizes: "clothing",
    colors: [{ name: "Black" }, { name: "Grey" }, { name: "Navy" }, { name: "Sky Blue" }, { name: "White" }, { name: "Beige" }],
    images: [IMG + "hoodie-ekose-6renk.jpg"]
  },
  {
    id: 13, brand: "ralph-lauren", name: "Zip-Up Tracksuit Set", category: "tracksuits", price: null, featured: true,
    sizes: "clothing",
    colors: [{ name: "Grey", image: 0 }, { name: "White", image: 1 }, { name: "Beige", image: 2 }],
    images: [IMG + "esofman-gri.jpg", IMG + "esofman-beyaz.jpg", IMG + "esofman-bej.jpg"]
  },
  {
    id: 14, brand: "dior", name: "Sweatshirt & Tailored Trouser Set", category: "sets", price: null,
    description: "A navy Dior sweatshirt paired with grey Prada tailored trousers — an easy smart-casual look.",
    sizes: "clothing",
    images: [IMG + "kombin-pantolon-sweat.jpg"]
  },
  {
    id: 15, brand: "hermes", name: "Knit Polo & Trouser Set", category: "sets", price: null, badge: "New",
    sizes: "clothing",
    images: [IMG + "kombin-triko-polo.jpg"]
  },
  {
    id: 16, brand: "hermes", name: "Suede Runner Sneaker", category: "sneakers", price: null, badge: "New", featured: true,
    sizes: "shoes",
    colors: [{ name: "Black" }],
    images: [IMG + "sneaker-suet-siyah.jpg"]
  },
  {
    id: 17, brand: "moncler", name: "Knit-Sleeve Down Jacket", category: "jackets", price: null, badge: "New",
    sizes: "clothing",
    colors: [{ name: "Black" }],
    images: [IMG + "ceket-triko-kollu-siyah.jpg"]
  },
  {
    id: 18, brand: "burberry", name: "Detachable-Sleeve Hooded Puffer", category: "puffers", price: null,
    description: "A check-lined hooded down jacket with sleeves that zip off, turning it into a gilet.",
    sizes: "clothing",
    colors: [{ name: "Black" }],
    images: [IMG + "mont-cikarilabilir-kol-siyah.jpg"]
  }
];

/* tiles in the Instagram section */
const INSTAGRAM = [1, 2, 3, 4, 5, 6].map(n => IMG + `insta-${n}.jpg`);
