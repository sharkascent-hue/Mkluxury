/*
 * MK Luxury — ürün kataloğu
 *
 * Ürün eklemek / değiştirmek için sadece bu dosyayı düzenleyin.
 * - image: "images/products/dosya.jpg" gibi bir yol verin. Boş bırakılırsa
 *   şık bir altın çizim (placeholder) gösterilir.
 * - category: CATEGORIES içindeki "id" değerlerinden biri olmalı.
 * - oldPrice: indirim varsa eski fiyat (opsiyonel).
 * - badge: "Yeni", "Çok Satan", "İndirim" vb. (opsiyonel).
 */

const CATEGORIES = [
  { id: "canta",    name: "Çanta",    desc: "El & omuz çantaları" },
  { id: "saat",     name: "Saat",     desc: "Klasik & spor modeller" },
  { id: "ayakkabi", name: "Ayakkabı", desc: "Sneaker & topuklu" },
  { id: "gozluk",   name: "Gözlük",   desc: "Güneş gözlükleri" },
  { id: "parfum",   name: "Parfüm",   desc: "İmza kokular" },
  { id: "taki",     name: "Takı",     desc: "Kolye, bileklik, yüzük" }
];

const PRODUCTS = [
  { id: 1,  name: "Monogram Deri Omuz Çantası", category: "canta",    price: 8950,  oldPrice: 10900, badge: "Çok Satan", image: "" },
  { id: 2,  name: "Altın Kadranlı Klasik Saat", category: "saat",     price: 12450, badge: "Yeni", image: "" },
  { id: 3,  name: "Siyah Deri Sneaker",         category: "ayakkabi", price: 5650,  image: "" },
  { id: 4,  name: "Oval Altın Çerçeve Gözlük",  category: "gozluk",   price: 3250,  oldPrice: 3900, badge: "İndirim", image: "" },
  { id: 5,  name: "Oud Noir Eau de Parfum",     category: "parfum",   price: 4100,  badge: "Yeni", image: "" },
  { id: 6,  name: "Zincir Detaylı Kolye",       category: "taki",     price: 2850,  image: "" },
  { id: 7,  name: "Mini Kapitone Çanta",        category: "canta",    price: 7300,  badge: "Yeni", image: "" },
  { id: 8,  name: "Çelik Kronograf Saat",       category: "saat",     price: 15900, oldPrice: 17500, badge: "İndirim", image: "" }
];
