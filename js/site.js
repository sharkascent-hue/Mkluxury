/* =========================================================
   MK LUXURY — shared layout + page logic
   Every page loads: config.js, products.js, site.js
   and sets <body data-page="..."> to pick its logic below.
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const body = document.body;
  const page = body.dataset.page;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const IG = `https://www.instagram.com/${STORE.instagram}`;
  const WA = STORE.whatsapp ? `https://wa.me/${STORE.whatsapp}` : "";
  const params = new URLSearchParams(location.search);

  /* ---------- data helpers ---------- */
  const money = n => "₺" + new Intl.NumberFormat("tr-TR").format(n);
  const hasPrice = p => typeof p.price === "number";
  const priceText = p => hasPrice(p) ? money(p.price) + (p.oldPrice > p.price ? `<s>${money(p.oldPrice)}</s>` : "") : "Price on request";
  const byId = id => PRODUCTS.find(p => p.id === id);
  const brandOf = id => BRANDS.find(b => b.id === id) || { name: "", id: "" };
  const catOf = id => CATEGORIES.find(c => c.id === id) || { name: "", id: "" };
  const sizesOf = p => Array.isArray(p.sizes) ? p.sizes : SIZES[p.sizes] || [];
  const swatch = name => COLOR[name] || "#888";
  const productUrl = p => `product.html?id=${p.id}`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } }
  };

  const ICON = {
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5.5 8h13l-1 12h-11z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
    sound: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path class="off" d="M16 9.5l5 5M21 9.5l-5 5"/><path class="on" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/></svg>'
  };

  /* =========================================================
     LAYOUT — header, menu, search, basket, footer
     ========================================================= */
  const navLinks = [
    ["index.html", "Home", "home"],
    ["shop.html", "Shop", "shop"],
    ["brands.html", "Brands", "brands"],
    ["christmas.html", "Christmas Deal", "christmas"],
    ["about.html", "About Us", "about"],
    ["contact.html", "Contact", "contact"]
  ];
  const navHTML = navLinks.filter(l => l[2] !== "home")
    .map(([href, label, key]) => `<a href="${href}"${key === page || (key === "shop" && page === "product") ? ' class="is-current"' : ""}>${label}</a>`).join("");

  body.insertAdjacentHTML("afterbegin", `
    <header class="header" id="header">
      <div class="announce"><a href="christmas.html">${esc(STORE.offer.title)} — ${esc(STORE.offer.status)} <span>See the deal</span></a></div>
      <div class="bar">
        <div class="bar__inner">
          <div style="display:flex;align-items:center;gap:6px">
            <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
            <nav class="nav" aria-label="Main">${navHTML}</nav>
          </div>
          <a href="index.html" class="logo" aria-label="MK Luxury home"><span class="logo__mk">MK</span><span class="logo__lux">LUXURY</span></a>
          <div class="tools">
            <button class="icon-btn" id="searchBtn" aria-label="Search">${ICON.search}</button>
            <button class="icon-btn hide-sm" id="wishBtn" aria-label="Wishlist">${ICON.heart}<span class="badge" id="wishCount">0</span></button>
            <button class="icon-btn" id="bagBtn" aria-label="Basket">${ICON.bag}<span class="badge" id="bagCount">0</span></button>
          </div>
        </div>
      </div>
    </header>
    <div class="menu" id="menu">
      <nav>${navLinks.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}</nav>
      <div class="menu__foot"><a href="${IG}" target="_blank" rel="noopener">Instagram — @${STORE.instagram}</a><span style="color:var(--muted)">${esc(STORE.city)}</span></div>
    </div>
    <div class="search" id="search" role="dialog" aria-label="Search">
      <button class="search__close" id="searchClose" aria-label="Close">&times;</button>
      <div class="search__box">
        <input type="search" id="searchInput" placeholder="Search brands or products" autocomplete="off">
        <div class="search__results" id="searchResults"></div>
      </div>
    </div>`);

  body.insertAdjacentHTML("beforeend", `
    <footer class="footer">
      <div class="container footer__grid">
        <div class="footer__brand">
          <a href="index.html" class="logo"><span class="logo__mk">MK</span><span class="logo__lux">LUXURY</span></a>
          <p style="max-width:320px;margin:0 0 14px">Designer fashion for every season — the best quality at the best prices. Visit us in Kuşadası or order online with delivery to ${esc(STORE.delivery)}.</p>
          <a class="link" href="${IG}" target="_blank" rel="noopener">@${STORE.instagram}</a>
        </div>
        <div><h4>Shop</h4><ul>${CATEGORIES.map(c => `<li><a href="shop.html?cat=${c.id}">${c.name}</a></li>`).join("")}</ul></div>
        <div><h4>Brands</h4><ul>${BRANDS.map(b => `<li><a href="shop.html?brand=${b.id}">${b.name}</a></li>`).join("")}</ul></div>
        <div><h4>MK Luxury</h4><ul>
          <li><a href="about.html">About Us</a></li>
          <li><a href="contact.html">Contact Us</a></li>
          <li><a href="christmas.html">Christmas Deal</a></li>
          <li><a href="contact.html#delivery">Delivery to UK &amp; Ireland</a></li>
          ${STORE.phone ? `<li><a href="tel:${STORE.phone.replace(/\s/g, "")}">${esc(STORE.phone)}</a></li>` : ""}
          <li>${esc(STORE.city)}</li>
        </ul></div>
      </div>
      <div class="container footer__bottom"><p>© ${new Date().getFullYear()} MK Luxury. All rights reserved.</p><p>Kuşadası · Delivering to ${esc(STORE.delivery)}</p></div>
    </footer>
    <div class="overlay" id="overlay"></div>
    <aside class="drawer" id="drawer" aria-label="Basket">
      <div class="drawer__head"><h3>Your Basket</h3><button class="drawer__close" id="drawerClose" aria-label="Close">&times;</button></div>
      <div class="drawer__body" id="bagItems"></div>
      <div class="drawer__foot" id="bagFoot">
        <div class="drawer__total"><span>Total</span><strong id="bagTotal">₺0</strong></div>
        ${WA ? `<a class="btn btn--gold btn--block" id="orderWa" href="${WA}" target="_blank" rel="noopener"><span>Order on WhatsApp</span></a>` : ""}
        <a class="btn ${WA ? "btn--line" : "btn--gold"} btn--block" id="orderIg" href="${IG}" target="_blank" rel="noopener"><span>Order on Instagram</span></a>
        <p class="drawer__note">We confirm price, size and delivery to ${esc(STORE.delivery)} in the chat.</p>
      </div>
    </aside>
    <div class="toast" id="toast" role="status"></div>`);

  /* ---------- intro (home page, once per visit) ---------- */
  if (page === "home") {
    let seen = false;
    try { seen = sessionStorage.getItem("mk-intro") === "1"; sessionStorage.setItem("mk-intro", "1"); } catch { /* ignore */ }
    if (!seen && !reduceMotion) {
      body.insertAdjacentHTML("afterbegin", `
        <div class="intro" aria-hidden="true">
          <div class="intro__half intro__half--l"></div><div class="intro__half intro__half--r"></div>
          <div class="intro__flare"></div>
          <div class="intro__stage"><div class="intro__logo">
            <div class="intro__mk">MK</div>
            <div class="intro__rule"><i></i><div class="intro__lux">${[..."LUXURY"].map(c => `<b>${c}</b>`).join("")}</div><i></i></div>
          </div></div>
        </div>`);
      document.documentElement.classList.add("locked");
      setTimeout(() => {
        body.classList.add("intro-open");
        document.documentElement.classList.remove("locked");
        setTimeout(() => body.classList.add("is-ready"), 350);
        setTimeout(() => body.classList.add("intro-gone"), 1500);
      }, 2300);
    } else {
      requestAnimationFrame(() => body.classList.add("is-ready"));
    }
  } else {
    body.classList.add("is-ready");
  }

  /* ---------- header state ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- overlays (one at a time, lock page scroll) ---------- */
  const lock = on => document.documentElement.classList.toggle("locked", on);
  const menu = $("#menu"), burger = $("#burger"), search = $("#search"), drawer = $("#drawer"), overlay = $("#overlay");
  function closeAll() {
    menu.classList.remove("is-open"); burger.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false");
    search.classList.remove("is-open");
    drawer.classList.remove("is-open"); overlay.classList.remove("is-open");
    lock(false);
  }
  burger.addEventListener("click", () => {
    const open = !menu.classList.contains("is-open");
    closeAll();
    if (open) { menu.classList.add("is-open"); burger.classList.add("is-open"); burger.setAttribute("aria-expanded", "true"); lock(true); }
  });
  $$("a", menu).forEach(a => a.addEventListener("click", closeAll));
  $("#searchBtn").addEventListener("click", () => { closeAll(); search.classList.add("is-open"); lock(true); setTimeout(() => $("#searchInput").focus(), 120); });
  $("#searchClose").addEventListener("click", closeAll);
  const openBag = () => { closeAll(); drawer.classList.add("is-open"); overlay.classList.add("is-open"); lock(true); };
  $("#bagBtn").addEventListener("click", openBag);
  $("#drawerClose").addEventListener("click", closeAll);
  overlay.addEventListener("click", closeAll);
  addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });

  /* ---------- search ---------- */
  const searchResults = $("#searchResults");
  const quick = `<p class="search__hint">Popular: ${BRANDS.slice(0, 5).map(b => `<a href="shop.html?brand=${b.id}">${b.name}</a>`).join("")}</p>`;
  searchResults.innerHTML = quick;
  $("#searchInput").addEventListener("input", e => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) { searchResults.innerHTML = quick; return; }
    const list = PRODUCTS.filter(p => [p.name, brandOf(p.brand).name, catOf(p.category).name, ...(p.colors || []).map(c => c.name)].join(" ").toLowerCase().includes(q));
    searchResults.innerHTML = list.length
      ? list.map(p => `<a href="${productUrl(p)}"><img src="${p.images[0]}" alt=""><span>${p.name}</span><small>${brandOf(p.brand).name}</small></a>`).join("")
      : `<p class="search__hint">No results — try a brand name like Moncler or Burberry.</p>`;
  });

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in"); io.unobserve(e.target);
  }), { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
  const reveal = root => $$(".reveal, .card", root).forEach(el => io.observe(el));

  /* ---------- toast ---------- */
  const toastEl = $("#toast"); let toastT;
  function toast(html) {
    toastEl.innerHTML = html; toastEl.classList.add("is-show");
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("is-show"), 2600);
  }
  const bump = el => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); };

  /* =========================================================
     WISHLIST + BASKET
     ========================================================= */
  let wish = store.get("mk-wish", []);
  const wishCount = $("#wishCount");
  const syncWish = () => { wishCount.textContent = wish.length; wishCount.classList.toggle("has", wish.length > 0); };
  function toggleWish(id) {
    const on = !wish.includes(id);
    wish = on ? [...wish, id] : wish.filter(x => x !== id);
    store.set("mk-wish", wish);
    $$(`[data-wish="${id}"]`).forEach(b => b.classList.toggle("is-on", on));
    syncWish(); bump(wishCount);
    toast(on ? "Saved to your <b>wishlist</b>" : "Removed from your wishlist");
  }
  $("#wishBtn").addEventListener("click", () => toast(wish.length ? `<b>${wish.length}</b> saved ${wish.length === 1 ? "piece" : "pieces"}` : "Your wishlist is empty"));

  let bag = store.get("mk-basket", []).filter(l => byId(l.id));
  const bagCount = $("#bagCount"), bagItems = $("#bagItems"), bagTotal = $("#bagTotal"), bagFoot = $("#bagFoot");
  function addToBag(item) {
    item.key = [item.id, item.color, item.finish, item.size].join("|");
    const line = bag.find(l => l.key === item.key);
    if (line) line.qty += item.qty; else bag.push(item);
    saveBag(); bump(bagCount);
  }
  function saveBag() { bag = bag.filter(l => l.qty > 0); store.set("mk-basket", bag); renderBag(); }
  function orderText() {
    const lines = bag.map(l => {
      const p = byId(l.id);
      const opts = [l.color, l.finish, l.size && `Size ${l.size}`].filter(Boolean).join(", ");
      return `• ${brandOf(p.brand).name} ${p.name}${opts ? ` (${opts})` : ""} × ${l.qty}`;
    });
    return `Hello MK Luxury, I'd like to order:\n${lines.join("\n")}\nDelivery to: `;
  }
  function renderBag() {
    const n = bag.reduce((s, l) => s + l.qty, 0);
    bagCount.textContent = n; bagCount.classList.toggle("has", n > 0);
    bagFoot.style.display = bag.length ? "" : "none";
    bagItems.innerHTML = !bag.length
      ? `<div class="drawer__empty"><p>Your basket is empty.</p><a href="shop.html" class="btn btn--gold"><span>Start Shopping</span></a></div>`
      : bag.map(l => {
          const p = byId(l.id);
          const c = (p.colors || []).find(c => c.name === l.color);
          const img = c && c.image !== undefined ? p.images[c.image] : p.images[0];
          const opts = [l.color, l.finish, l.size && `Size ${l.size}`].filter(Boolean).join(" · ");
          return `<div class="line">
            <a href="${productUrl(p)}"><img src="${img}" alt=""></a>
            <div>
              <div class="line__brand">${brandOf(p.brand).name}</div>
              <h4>${p.name}</h4>
              ${opts ? `<div class="line__opt">${opts}</div>` : ""}
              <div class="line__opt">${priceText(p)}</div>
              <div class="qty"><button data-dec="${esc(l.key)}" aria-label="Decrease">−</button><span>${l.qty}</span><button data-inc="${esc(l.key)}" aria-label="Increase">+</button></div>
            </div>
            <button class="line__rm" data-rm="${esc(l.key)}">Remove</button>
          </div>`;
        }).join("");
    const priced = bag.every(l => hasPrice(byId(l.id)));
    bagTotal.textContent = priced ? money(bag.reduce((s, l) => s + l.qty * byId(l.id).price, 0)) : "On request";
    const wa = $("#orderWa");
    if (wa) wa.href = `${WA}?text=${encodeURIComponent(orderText())}`;
  }
  bagItems.addEventListener("click", e => {
    const b = e.target.closest("[data-inc],[data-dec],[data-rm]");
    if (!b) return;
    const line = bag.find(l => l.key === (b.dataset.inc || b.dataset.dec || b.dataset.rm));
    if (!line) return;
    if (b.dataset.inc) line.qty++;
    if (b.dataset.dec) line.qty--;
    if (b.dataset.rm) line.qty = 0;
    saveBag();
  });
  $("#orderIg").addEventListener("click", () => {
    navigator.clipboard?.writeText(orderText()).then(() => toast("Order <b>copied</b> — paste it into our Instagram messages"), () => {});
  });

  /* =========================================================
     SHARED RENDERERS
     ========================================================= */
  function cardHTML(p, i = 0) {
    const colors = p.colors || [];
    return `<a class="card" href="${productUrl(p)}" style="transition-delay:${(i % 4) * 0.07}s">
      <div class="card__media">
        ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ""}
        <button class="card__wish${wish.includes(p.id) ? " is-on" : ""}" data-wish="${p.id}" aria-label="Save to wishlist">${ICON.heart}</button>
        <img src="${p.images[0]}" alt="${esc(brandOf(p.brand).name + " " + p.name)}" loading="lazy">
        ${p.images[1] ? `<img class="alt" src="${p.images[1]}" alt="" loading="lazy">` : ""}
        <span class="card__view">View Product</span>
      </div>
      <div class="card__body">
        <div class="card__brand">${brandOf(p.brand).name}</div>
        <h3 class="card__name">${p.name}</h3>
        <div class="card__price">${priceText(p)}</div>
        ${colors.length ? `<div class="card__dots">${colors.slice(0, 6).map(c => `<span class="dot" style="background:${swatch(c.name)}" title="${c.name}"></span>`).join("")}<small>${colors.length > 1 ? colors.length + " colours" : colors[0].name}</small></div>` : ""}
      </div>
    </a>`;
  }
  function renderGrid(el, list) {
    el.innerHTML = list.map(cardHTML).join("");
    reveal(el);
  }
  // wishlist hearts inside cards (cards are links)
  document.addEventListener("click", e => {
    const w = e.target.closest("[data-wish]");
    if (w) { e.preventDefault(); e.stopPropagation(); toggleWish(+w.dataset.wish); }
  }, true);

  function mixed(list) {
    const groups = CATEGORIES.map(c => list.filter(p => p.category === c.id));
    const out = [];
    for (let i = 0; out.length < list.length; i++) groups.forEach(g => g[i] && out.push(g[i]));
    return out;
  }

  function countdownTo() {
    const [m, d] = STORE.offer.countdownTo.split("-").map(Number);
    const now = new Date();
    let t = new Date(now.getFullYear(), m - 1, d);
    if (now - t > 864e5) t = new Date(now.getFullYear() + 1, m - 1, d);
    return t;
  }
  function startCountdown(root) {
    if (!root) return;
    const pad = n => String(n).padStart(2, "0");
    const tick = () => {
      const diff = Math.max(0, countdownTo() - new Date());
      const v = { d: Math.floor(diff / 864e5), h: Math.floor(diff / 36e5) % 24, m: Math.floor(diff / 6e4) % 60, s: Math.floor(diff / 1e3) % 60 };
      $$("[data-cd]", root).forEach(el => { el.textContent = pad(v[el.dataset.cd]); });
    };
    tick(); setInterval(tick, 1000);
  }

  function setupVideos() {
    $$("video").forEach(v => {
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { if (v.preload === "none") v.preload = "auto"; if (!reduceMotion || !v.muted) v.play().catch(() => {}); }
        else v.pause();
      }, { threshold: 0.15 }).observe(v);
    });
    $$("[data-sound]").forEach(btn => {
      const v = document.getElementById(btn.dataset.sound);
      btn.innerHTML = ICON.sound;
      btn.setAttribute("aria-label", "Turn sound on");
      btn.addEventListener("click", () => {
        const on = v.muted;
        $$("video").forEach(o => { o.muted = true; });
        $$("[data-sound]").forEach(b => { b.classList.remove("is-on"); b.setAttribute("aria-label", "Turn sound on"); });
        if (on) { v.muted = false; btn.classList.add("is-on"); btn.setAttribute("aria-label", "Turn sound off"); }
        v.play().catch(() => {});
      });
    });
  }

  function snow(canvas) {
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    let w, h, flakes = [], running = false;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      flakes = Array.from({ length: Math.round(Math.min(120, w / 11)) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.9 + .4, vy: Math.random() * .5 + .2, t: Math.random() * 6.3, a: Math.random() * .5 + .25 }));
    };
    const frame = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.vy; f.t += .01; f.x += Math.sin(f.t) * .3;
        if (f.y > h + 5) { f.y = -5; f.x = Math.random() * w; }
        ctx.beginPath(); ctx.fillStyle = `rgba(246,228,175,${f.a})`; ctx.arc(f.x, f.y, f.r, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(frame);
    };
    resize(); addEventListener("resize", resize);
    new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting; if (running && !was) requestAnimationFrame(frame); }).observe(canvas);
  }

  /* =========================================================
     PAGES
     ========================================================= */
  const PAGES = {

    home() {
      setupVideos();
      const brandLinks = BRANDS.map(b => `<a href="shop.html?brand=${b.id}">${b.name}</a>`).join("");
      $("#marquee").innerHTML = `<div class="marquee__track">${brandLinks}${brandLinks}</div>`;
      $("#catGrid").innerHTML = CATEGORIES.map((c, i) => `
        <a class="cat reveal" href="shop.html?cat=${c.id}" style="transition-delay:${(i % 4) * .07}s">
          <img src="${c.cover}" alt="${c.name}" loading="lazy">
          <div class="cat__label"><span class="cat__name">${c.name}</span><span class="cat__go">Shop →</span></div>
        </a>`).join("");
      renderGrid($("#featured"), mixed(PRODUCTS.filter(p => p.featured)).slice(0, 8));
      $("#brandGrid").innerHTML = BRANDS.map((b, i) => `
        <a class="brand-tile reveal" href="shop.html?brand=${b.id}" style="transition-delay:${(i % 4) * .06}s">
          <div><h3>${b.name}</h3><p>${b.blurb}</p></div>
          <small>Shop ${b.name} →</small>
        </a>`).join("");
      $("#instaGrid").innerHTML = INSTAGRAM.map(src => `<a href="${IG}" target="_blank" rel="noopener" aria-label="Instagram"><img src="${src}" alt="" loading="lazy"></a>`).join("");
      startCountdown($("#miniCount"));
    },

    shop() {
      let cat = params.get("cat") || "all";
      let brand = params.get("brand") || "all";
      const grid = $("#grid"), chips = $("#chips"), sel = $("#brandSelect");
      chips.innerHTML = [{ id: "all", name: "All" }, ...CATEGORIES].map(c => `<button class="chip" data-cat="${c.id}">${c.name}</button>`).join("");
      sel.innerHTML = `<option value="all">All brands</option>` + BRANDS.map(b => `<option value="${b.id}">${b.name}</option>`).join("");
      function render() {
        const b = BRANDS.find(x => x.id === brand), c = CATEGORIES.find(x => x.id === cat);
        $$(".chip", chips).forEach(el => el.classList.toggle("is-active", el.dataset.cat === cat));
        sel.value = brand;
        $("#shopTitle").innerHTML = b ? `<span class="gold">${b.name}</span>` : c ? `${c.name.replace(/s$/, "")} <em>Collection</em>` : `The <em>Shop</em>`;
        $("#shopLead").textContent = b ? b.blurb : c ? `Our ${c.name.toLowerCase()} — in store in Kuşadası and delivered to ${STORE.delivery}.` : `Designer pieces for every season from ${BRANDS.length} of the world's top brands.`;
        $("#crumb").textContent = b ? b.name : c ? c.name : "All Products";
        document.title = `${b ? b.name : c ? c.name : "Shop"} — MK Luxury`;
        let list = PRODUCTS.filter(p => (cat === "all" || p.category === cat) && (brand === "all" || p.brand === brand));
        if (cat === "all" && brand === "all") list = mixed(list);
        $("#count").textContent = `${list.length} ${list.length === 1 ? "piece" : "pieces"}`;
        if (list.length) renderGrid(grid, list);
        else grid.innerHTML = `<div class="empty" style="grid-column:1/-1">Nothing here yet — <a class="link" href="shop.html">see everything</a></div>`;
        const q = new URLSearchParams();
        if (cat !== "all") q.set("cat", cat);
        if (brand !== "all") q.set("brand", brand);
        history.replaceState(null, "", "shop.html" + (q.toString() ? "?" + q : ""));
      }
      chips.addEventListener("click", e => { const c = e.target.closest("[data-cat]"); if (c) { cat = c.dataset.cat; render(); } });
      sel.addEventListener("change", () => { brand = sel.value; render(); });
      render();
    },

    brands() {
      $("#brandGrid").innerHTML = BRANDS.map((b, i) => {
        const n = PRODUCTS.filter(p => p.brand === b.id).length;
        return `<a class="brand-tile reveal" href="shop.html?brand=${b.id}" style="transition-delay:${(i % 4) * .06}s">
          <div><h3>${b.name}</h3><p>${b.blurb}</p></div>
          <small>${n} ${n === 1 ? "piece" : "pieces"} · Shop →</small>
        </a>`;
      }).join("");
    },

    product() {
      const p = byId(+params.get("id")) || PRODUCTS[0];
      const b = brandOf(p.brand), c = catOf(p.category);
      const colors = p.colors || [], sizes = sizesOf(p);
      let colorI = 0, finishI = 0, size = "", qty = 1, imgI = 0;
      document.title = `${b.name} ${p.name} — MK Luxury`;
      $("#crumbs").innerHTML = `<a href="index.html">Home</a><span>/</span><a href="shop.html?cat=${c.id}">${c.name}</a><span>/</span><a href="shop.html?brand=${b.id}">${b.name}</a>`;
      $("#pdp").innerHTML = `
        <div class="gallery reveal">
          <div class="gallery__main" id="mainImg">
            <img src="${p.images[0]}" alt="${esc(b.name + " " + p.name)}">
            ${p.images.length > 1 ? `<button class="gallery__nav gallery__nav--prev" data-step="-1" aria-label="Previous photo">‹</button><button class="gallery__nav gallery__nav--next" data-step="1" aria-label="Next photo">›</button>` : ""}
          </div>
          ${p.images.length > 1 ? `<div class="gallery__thumbs">${p.images.map((src, i) => `<button data-img="${i}" class="${i ? "" : "is-active"}" aria-label="Photo ${i + 1}"><img src="${src}" alt=""></button>`).join("")}</div>` : ""}
        </div>
        <div class="info reveal">
          <a class="info__brand" href="shop.html?brand=${b.id}">${b.name}</a>
          <h1>${p.name}</h1>
          <div class="info__price">${priceText(p)}</div>
          <p class="info__desc">${p.description || `${b.blurb} Hand-picked by MK Luxury — try it in our Kuşadası store or order for delivery to ${STORE.delivery}.`}</p>
          ${colors.length ? `<div class="opt"><div class="opt__label"><span>Colour</span><b id="colorName">${colors[0].name}</b></div>
            <div class="swatches">${colors.map((x, i) => `<button class="dot${i ? "" : " is-active"}" style="background:${swatch(x.name)}" data-color="${i}" aria-label="${x.name}" title="${x.name}"></button>`).join("")}</div></div>` : ""}
          ${p.finishes ? `<div class="opt"><div class="opt__label"><span>Finish</span><b id="finishName">${p.finishes[0]}</b></div>
            <div class="pills">${p.finishes.map((f, i) => `<button class="pill${i ? "" : " is-active"}" data-finish="${i}">${f}</button>`).join("")}</div></div>` : ""}
          ${sizes.length ? `<div class="opt" id="sizeOpt"><div class="opt__label"><span>Size <b id="sizeName"></b></span><a href="${IG}" target="_blank" rel="noopener">Need help with sizing?</a></div>
            <div class="sizes">${sizes.map(s => `<button class="size" data-size="${s}">${s}</button>`).join("")}</div></div>` : ""}
          <div class="buy">
            <div class="qty"><button data-q="-1" aria-label="Decrease">−</button><span id="qty">1</span><button data-q="1" aria-label="Increase">+</button></div>
            <button class="btn btn--gold" id="addBtn"><span>Add to Basket</span></button>
          </div>
          <a class="ask" href="${WA || IG}" target="_blank" rel="noopener">Ask about this item on ${WA ? "WhatsApp" : "Instagram"}</a>
          <div class="acc">
            <details open><summary>Details</summary><p>${b.name} · ${c.name}${colors.length ? ` · Available in ${colors.map(x => x.name).join(", ")}` : ""}${p.finishes ? ` · ${p.finishes.join(" or ")} finish` : ""}.</p></details>
            <details><summary>Delivery</summary><p>We deliver to ${STORE.delivery}. Send us your order and we'll confirm the price, delivery time and cost in the chat before you pay.</p></details>
            <details><summary>Visit the Store</summary><p>Prefer to try it on? Visit MK Luxury in ${STORE.city}. <a class="link" href="contact.html">Find us</a></p></details>
          </div>
        </div>`;
      const main = $("#mainImg");
      const show = i => {
        imgI = (i + p.images.length) % p.images.length;
        $("img", main).remove();
        main.insertAdjacentHTML("afterbegin", `<img class="is-new" src="${p.images[imgI]}" alt="${esc(b.name + " " + p.name)}">`);
        $$("[data-img]").forEach(t => t.classList.toggle("is-active", +t.dataset.img === imgI));
      };
      // swipe between photos on touch screens
      let sx = null;
      main.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
      main.addEventListener("touchend", e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 40 && p.images.length > 1) show(imgI + (dx < 0 ? 1 : -1)); });
      $("#pdp").addEventListener("click", e => {
        const t = e.target.closest("[data-img]"); if (t) return show(+t.dataset.img);
        const st = e.target.closest("[data-step]"); if (st) return show(imgI + +st.dataset.step);
        const col = e.target.closest("[data-color]");
        if (col) {
          colorI = +col.dataset.color;
          $$("[data-color]").forEach(x => x.classList.toggle("is-active", x === col));
          $("#colorName").textContent = colors[colorI].name;
          if (colors[colorI].image !== undefined) show(colors[colorI].image);
          return;
        }
        const fin = e.target.closest("[data-finish]");
        if (fin) { finishI = +fin.dataset.finish; $$("[data-finish]").forEach(x => x.classList.toggle("is-active", x === fin)); $("#finishName").textContent = p.finishes[finishI]; return; }
        const sz = e.target.closest("[data-size]");
        if (sz) { size = sz.dataset.size; $$("[data-size]").forEach(x => x.classList.toggle("is-active", x === sz)); $("#sizeName").textContent = "— " + size; $("#sizeOpt").classList.remove("is-error"); return; }
        const q = e.target.closest("[data-q]");
        if (q) { qty = Math.max(1, Math.min(9, qty + +q.dataset.q)); $("#qty").textContent = qty; return; }
        if (e.target.closest("#addBtn")) {
          if (sizes.length && !size) {
            const opt = $("#sizeOpt"); opt.classList.remove("is-error"); void opt.offsetWidth; opt.classList.add("is-error");
            toast("Please choose a <b>size</b>"); return;
          }
          addToBag({ id: p.id, color: colors[colorI] ? colors[colorI].name : "", finish: p.finishes ? p.finishes[finishI] : "", size, qty });
          toast(`<b>${p.name}</b> added to your basket`);
          setTimeout(openBag, 350);
        }
      });
      const related = PRODUCTS.filter(x => x.id !== p.id && x.brand === p.brand)
        .concat(PRODUCTS.filter(x => x.id !== p.id && x.brand !== p.brand && x.category === p.category))
        .concat(PRODUCTS.filter(x => x.id !== p.id && x.brand !== p.brand && x.category !== p.category))
        .slice(0, 4);
      $("#relatedTitle").innerHTML = `More from <em>${b.name}</em> &amp; similar`;
      renderGrid($("#related"), related);
    },

    christmas() {
      setupVideos();
      snow($("#snow"));
      startCountdown($("#countdown"));
      $("#offerTitle").innerHTML = STORE.offer.title.replace(/(\w+)$/, "<em>$1</em>");
      $("#offerStatus").textContent = STORE.offer.status;
      renderGrid($("#winter"), PRODUCTS.filter(p => ["puffers", "parkas", "knitwear"].includes(p.category)).slice(0, 8));
    },

    about() { setupVideos(); },

    contact() {
      const lines = [];
      $("#visit").innerHTML = `
        <p>${STORE.address ? esc(STORE.address) + "<br>" : ""}${esc(STORE.city)}</p>
        <p><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE.mapQuery)}" target="_blank" rel="noopener">Open in Google Maps</a></p>`;
      if (WA) lines.push(`<li>WhatsApp: <a href="${WA}" target="_blank" rel="noopener">+${STORE.whatsapp}</a></li>`);
      if (STORE.phone) lines.push(`<li>Phone: <a href="tel:${STORE.phone.replace(/\s/g, "")}">${esc(STORE.phone)}</a></li>`);
      if (STORE.email) lines.push(`<li>Email: <a href="mailto:${STORE.email}">${esc(STORE.email)}</a></li>`);
      lines.push(`<li>Instagram: <a href="${IG}" target="_blank" rel="noopener">@${STORE.instagram}</a></li>`);
      $("#talk").innerHTML = `<ul>${lines.join("")}</ul>`;
      $("#hours").innerHTML = STORE.hours.length
        ? `<table>${STORE.hours.map(([d, t]) => `<tr><td>${esc(d)}</td><td>${esc(t)}</td></tr>`).join("")}</table>`
        : `<p>Message us on Instagram for today's opening hours.</p>`;
      $("#map").innerHTML = `<iframe title="MK Luxury on the map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${encodeURIComponent(STORE.mapQuery)}&z=15&output=embed"></iframe>`;
      $("#contactForm").addEventListener("submit", e => {
        e.preventDefault();
        const f = new FormData(e.target);
        const text = `Hello MK Luxury, my name is ${f.get("name")}.\n${f.get("message")}`;
        if (WA) { open(`${WA}?text=${encodeURIComponent(text)}`, "_blank", "noopener"); return; }
        navigator.clipboard?.writeText(text).finally(() => {
          toast("Message <b>copied</b> — paste it into our Instagram messages");
          setTimeout(() => open(IG, "_blank", "noopener"), 900);
        });
      });
      $("#formNote").textContent = WA ? "Sends your message to us on WhatsApp." : "Copies your message and opens our Instagram — just paste and send.";
    }
  };

  (PAGES[page] || (() => {}))();
  reveal(document);
  renderBag();
  syncWish();
})();
