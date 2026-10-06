# MK Luxury

Shop website for MK Luxury, with Instagram at [@mkluxurytr](https://www.instagram.com/mkluxurytr).

It's a static site with no build step. Open `index.html` in a browser, or host it on GitHub Pages.

## Editing products
All products and categories are in `js/products.js`.

- Put photos in `images/products/` and list them in the product's `images`. The first photo is the cover and the second shows on hover.
- `colors` shows colour swatches. Give a colour an `image` index to switch to that photo when the colour is picked.
- Swatch shades are set in `COLOR`. Add a new colour name there.
- Leave `price: null` to show "Price on request".

## Videos
- `media/hero.mp4` / `.webm` is the main hero video. `media/hero-bg.*` is a small blurred copy used behind it on desktop.
- `media/christmas.mp4` / `.webm` is the "Christmas Offer — Coming Soon" video.

## Publishing (GitHub Pages)
In the repo, go to Settings → Pages. Set the source to "Deploy from a branch", choose `main` and `/ (root)`, then save. The site goes live at `https://<username>.github.io/mkluxury/`.

## Ordering
The bag works in the browser. "Order via Instagram" copies an order summary and opens the Instagram profile, so the customer can paste it into a message.
