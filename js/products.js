/*
 * MK Luxury — ürün kataloğu
 *
 * Ürün eklemek / değiştirmek için sadece bu dosyayı düzenleyin.
 * - images: fotoğraf yolları; ilki kapak, ikincisi kartın üzerine gelince görünür,
 *   hepsi ürün detayında galeri olarak gösterilir.
 * - category: CATEGORIES içindeki "id" değerlerinden biri olmalı.
 * - price: TL fiyatı. Boş bırakılırsa (null) "Fiyat için DM" yazar.
 * - oldPrice: indirim varsa eski fiyat (opsiyonel).
 * - colors: renk seçenekleri (opsiyonel).
 * - badge: "Yeni", "Çok Satan", "İndirim" vb. (opsiyonel).
 */

const IMG = "images/products/";

const CATEGORIES = [
  { id: "mont",     name: "Şişme Mont", desc: "Kapüşonlu kaz tüyü modeller", cover: IMG + "mont-parlak-3renk.jpg" },
  { id: "parka",    name: "Parka",      desc: "Kürk kapüşonlu kışlık",        cover: IMG + "parka-lacivert.jpg" },
  { id: "ceket",    name: "Rüzgarlık",  desc: "Hafif kapüşonlu ceketler",     cover: IMG + "ruzgarlik-3renk.jpg" },
  { id: "ayakkabi", name: "Sneaker",    desc: "Deri & denim modeller",        cover: IMG + "sneaker-mavi.jpg" }
];

const PRODUCTS = [
  {
    id: 1, name: "Parlak Kapitone Mont", category: "mont", price: null, badge: "Yeni",
    colors: ["Gri", "Yeşil", "Beyaz"],
    images: [IMG + "mont-parlak-3renk.jpg", IMG + "mont-kol-detay.jpg"]
  },
  {
    id: 2, name: "Parlak Kapüşonlu Mont – Siyah", category: "mont", price: null, badge: "Çok Satan",
    images: [IMG + "mont-parlak-siyah.jpg", IMG + "mont-4renk-magaza.jpg"]
  },
  {
    id: 3, name: "Mat Kapüşonlu Mont – Lacivert", category: "mont", price: null,
    images: [IMG + "mont-mat-lacivert.jpg", IMG + "mont-4renk-magaza.jpg"]
  },
  {
    id: 4, name: "Mat Kapüşonlu Mont – Gri", category: "mont", price: null,
    images: [IMG + "mont-gri.jpg", IMG + "mont-4renk-magaza.jpg"]
  },
  {
    id: 5, name: "Ekose Astarlı Mont – Saks Mavi", category: "mont", price: null, badge: "Yeni",
    images: [IMG + "mont-ekose-saks.jpg", IMG + "mont-ekose-krem.jpg"]
  },
  {
    id: 6, name: "Ekose Astarlı Mont – Krem", category: "mont", price: null,
    images: [IMG + "mont-ekose-krem.jpg", IMG + "mont-ekose-saks.jpg"]
  },
  {
    id: 7, name: "Kürk Kapüşonlu Parka – Lacivert", category: "parka", price: null, badge: "Yeni",
    images: [IMG + "parka-lacivert.jpg", IMG + "parka-detay-1.jpg", IMG + "parka-detay-2.jpg"]
  },
  {
    id: 8, name: "Kapüşonlu Rüzgarlık", category: "ceket", price: null,
    colors: ["Bej", "Lacivert", "Siyah"],
    images: [IMG + "ruzgarlik-3renk.jpg"]
  },
  {
    id: 9, name: "Monogram Denim Sneaker – Mavi", category: "ayakkabi", price: null, badge: "Çok Satan",
    images: [IMG + "sneaker-mavi.jpg", IMG + "sneaker-mavi-taban.jpg"]
  },
  {
    id: 10, name: "Monogram Sneaker – Siyah/Beyaz", category: "ayakkabi", price: null,
    images: [IMG + "sneaker-siyah.jpg", IMG + "sneaker-mavi-taban.jpg"]
  }
];

/* Instagram bölümünde gösterilen kareler */
const INSTAGRAM = [1, 2, 3, 4, 5, 6].map(n => IMG + `insta-${n}.jpg`);
