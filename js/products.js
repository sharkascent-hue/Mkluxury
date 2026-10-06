/*
 * MK Luxury — product catalogue
 *
 * To add or change products, edit only this file.
 * - images:   photo paths. The first is the cover, the second appears on hover,
 *             and all of them show in the product gallery.
 * - category: one of the "id" values in CATEGORIES.
 * - price:    price in Turkish lira. Leave as null to show "Price on request".
 * - oldPrice: previous price when on sale (optional).
 * - colors:   colour options shown as swatches. "image" is the index in
 *             `images` to show when that colour is picked (optional).
 * - finishes: extra option such as Matte / Glossy (optional).
 * - badge:    "New", "Bestseller", "Sale", ... (optional).
 */

const IMG = "images/products/";

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
    id: 1, name: "Glossy Quilted Down Jacket", category: "puffers", price: null, badge: "New",
    colors: [{ name: "Grey" }, { name: "Green" }, { name: "White" }],
    images: [IMG + "mont-parlak-3renk.jpg", IMG + "mont-kol-detay.jpg"]
  },
  {
    id: 2, name: "Hooded Down Jacket", category: "puffers", price: null, badge: "Bestseller",
    colors: [{ name: "Navy", image: 0 }, { name: "Grey", image: 1 }, { name: "Black", image: 2 }],
    images: [IMG + "mont-mat-lacivert.jpg", IMG + "mont-gri.jpg", IMG + "mont-4renk-magaza.jpg"]
  },
  {
    id: 3, name: "Glossy Hooded Down Jacket", category: "puffers", price: null,
    colors: [{ name: "Black" }],
    images: [IMG + "mont-parlak-siyah.jpg", IMG + "mont-4renk-magaza.jpg"]
  },
  {
    id: 4, name: "Check-Lined Hooded Puffer", category: "puffers", price: null, badge: "New",
    colors: [{ name: "Royal Blue", image: 0 }, { name: "Cream", image: 1 }],
    images: [IMG + "mont-ekose-saks.jpg", IMG + "mont-ekose-krem.jpg"]
  },
  {
    id: 5, name: "Fur-Trim Hooded Parka", category: "parkas", price: null, badge: "New",
    colors: [{ name: "Navy", image: 0 }, { name: "Grey", image: 1 }],
    images: [IMG + "parka-lacivert.jpg", IMG + "parka-gri.jpg", IMG + "parka-detay-1.jpg", IMG + "parka-detay-2.jpg"]
  },
  {
    id: 6, name: "Hooded Windbreaker", category: "jackets", price: null,
    colors: [{ name: "Beige" }, { name: "Navy" }, { name: "Black" }],
    images: [IMG + "ruzgarlik-3renk.jpg"]
  },
  {
    id: 7, name: "Monogram Denim Sneaker", category: "sneakers", price: null, badge: "Bestseller",
    colors: [{ name: "Royal Blue" }],
    images: [IMG + "sneaker-mavi.jpg", IMG + "sneaker-mavi-taban.jpg"]
  },
  {
    id: 8, name: "Monogram Leather Sneaker", category: "sneakers", price: null,
    colors: [{ name: "Black" }],
    images: [IMG + "sneaker-siyah.jpg"]
  },
  {
    id: 9, name: "Glossy Hooded Puffer", category: "puffers", price: null, badge: "New",
    colors: [{ name: "Navy" }, { name: "Royal Blue" }, { name: "Sky Blue" }],
    images: [IMG + "mont-parlak-mavi-3renk.jpg"]
  },
  {
    id: 10, name: "Classic Hooded Puffer", category: "puffers", price: null,
    colors: [{ name: "Black" }],
    finishes: ["Matte", "Glossy"],
    images: [IMG + "mont-siyah-mat-parlak.jpg"]
  },
  {
    id: 11, name: "Cable-Knit Half-Zip Sweater", category: "knitwear", price: null, badge: "Bestseller",
    colors: [{ name: "Navy", image: 0 }, { name: "White", image: 1 }, { name: "Black", image: 0 }],
    images: [IMG + "triko-yarim-fermuar-3renk.jpg", IMG + "triko-yarim-fermuar-beyaz.jpg"]
  },
  {
    id: 12, name: "Check-Hood Zip Hoodie", category: "hoodies", price: null, badge: "New",
    colors: [{ name: "Black" }, { name: "Grey" }, { name: "Navy" }, { name: "Sky Blue" }, { name: "White" }, { name: "Beige" }],
    images: [IMG + "hoodie-ekose-6renk.jpg"]
  },
  {
    id: 13, name: "Zip-Up Tracksuit Set", category: "tracksuits", price: null,
    colors: [{ name: "Grey", image: 0 }, { name: "White", image: 1 }, { name: "Beige", image: 2 }],
    images: [IMG + "esofman-gri.jpg", IMG + "esofman-beyaz.jpg", IMG + "esofman-bej.jpg"]
  },
  {
    id: 14, name: "Sweatshirt & Tailored Trouser Set", category: "sets", price: null,
    images: [IMG + "kombin-pantolon-sweat.jpg"]
  },
  {
    id: 15, name: "Knit Polo & Trouser Set", category: "sets", price: null, badge: "New",
    images: [IMG + "kombin-triko-polo.jpg"]
  },
  {
    id: 16, name: "Suede Runner Sneaker", category: "sneakers", price: null, badge: "New",
    colors: [{ name: "Black" }],
    images: [IMG + "sneaker-suet-siyah.jpg"]
  },
  {
    id: 17, name: "Knit-Sleeve Down Jacket", category: "jackets", price: null, badge: "New",
    colors: [{ name: "Black" }],
    images: [IMG + "ceket-triko-kollu-siyah.jpg"]
  },
  {
    id: 18, name: "Detachable-Sleeve Hooded Puffer", category: "puffers", price: null,
    colors: [{ name: "Black" }],
    description: "A check-lined hooded down jacket with sleeves that zip off, turning it into a gilet.",
    images: [IMG + "mont-cikarilabilir-kol-siyah.jpg"]
  }
];

/* tiles in the Instagram section */
const INSTAGRAM = [1, 2, 3, 4, 5, 6].map(n => IMG + `insta-${n}.jpg`);
