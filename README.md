# MK Luxury

Instagram: [@mkluxurytr](https://www.instagram.com/mkluxurytr)

A static shop website for MK Luxury in black, white and gold. It needs no build step: open `index.html` in a browser, or host it on GitHub Pages.

## Editing products
All products and categories live in `js/products.js`.

- Put product photos in `images/products/` and set `image: "images/products/photo.jpg"`.
- When `image` is empty, the site shows a gold line-art placeholder instead.

## Publishing (GitHub Pages)
1. In the repo, go to Settings → Pages.
2. Set Source to "Deploy from a branch", choose `main` and `/ (root)`, then save.
3. The site goes live at `https://<username>.github.io/mkluxury/`.

## Ordering
The cart works in the browser. "Siparişi Tamamla" (Complete Order) copies an order summary to the clipboard and opens the Instagram profile, so the customer can paste the order into a DM.
