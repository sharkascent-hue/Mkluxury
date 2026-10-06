# MK Luxury

Designer fashion store in Kuşadası, on Instagram at [@mkluxurytr](https://www.instagram.com/mkluxurytr).

It's a static website with no build step, deployed on Vercel from `main`.

## Pages
| File | Page |
|---|---|
| `index.html` | Home |
| `shop.html` | Shop. Filter with `?cat=puffers` or `?brand=moncler` |
| `product.html?id=N` | Product page with brand, colours, sizes and add to basket |
| `brands.html` | All brands |
| `christmas.html` | The current offer (Christmas Deal) |
| `about.html` | About Us |
| `contact.html` | Contact Us, map and delivery info |

The header, menu, search, basket and footer are added to every page by `js/site.js`.

## Store details (`js/config.js`)
Address, phone, WhatsApp, email, opening hours, the delivery area and the current offer all live here. Anything left empty is hidden. Once you add a WhatsApp number, the basket gets an "Order on WhatsApp" button that sends the full order.

## Products (`js/products.js`)
- `BRANDS`, `CATEGORIES` and `PRODUCTS` are all in this file.
- Put photos in `images/products/` and list them in the product's `images`.
- `colors` lists the swatches. Give a colour `image: N` to switch to that photo when the colour is picked.
- `sizes` is `"clothing"` (XS–XXL), `"shoes"` (EU 39–45) or your own list.
- Leave `price: null` to show "Price on request".
- Set `featured: true` to show a product on the home page.

## Videos (`media/`)
- `hero.*` is the home hero video. `hero-bg.*` is a small blurred copy used behind it on desktop.
- `christmas.*` is the offer page video.
