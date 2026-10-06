/* =========================================================
   MK LUXURY — shop interactions
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const IG = "https://www.instagram.com/mkluxurytr";

  const money = n => "₺" + new Intl.NumberFormat("tr-TR").format(n);
  const hasPrice = p => typeof p.price === "number";
  const priceText = p => hasPrice(p)
    ? money(p.price) + (p.oldPrice > p.price ? `<s>${money(p.oldPrice)}</s>` : "")
    : "Price on request";
  const catName = id => (CATEGORIES.find(c => c.id === id) || {}).name || "";
  const byId = id => PRODUCTS.find(p => p.id === id);
  const swatch = name => COLOR[name] || "#ccc";

  const store = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage unavailable */ } }
  };

  /* =========================================================
     INTRO
     ========================================================= */
  const seen = (() => { try { return sessionStorage.getItem("mk-intro") === "1"; } catch { return false; } })();
  setTimeout(() => {
    body.classList.add("intro-done");
    body.classList.remove("is-loading");
    setTimeout(() => body.classList.add("is-ready"), reduceMotion ? 0 : 250);
    try { sessionStorage.setItem("mk-intro", "1"); } catch { /* ignore */ }
  }, reduceMotion ? 0 : seen ? 500 : 1700);

  /* =========================================================
     HEADER
     ========================================================= */
  const header = $("#header");
  const hero = $(".hero");
  function onScroll() {
    header.classList.toggle("is-solid", scrollY > hero.offsetHeight - 90);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* =========================================================
     REVEAL
     ========================================================= */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  const reveal = els => els.forEach(el => io.observe(el));
  reveal($$(".reveal"));

  /* =========================================================
     VIDEOS — play while visible, sound toggles
     ========================================================= */
  $$("video").forEach(v => {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (v.preload === "none") v.preload = "auto";
        if (!reduceMotion || !v.muted) v.play().catch(() => {});
      } else v.pause();
    }, { threshold: 0.2 }).observe(v);
  });
  $$("[data-sound]").forEach(btn => {
    const v = document.getElementById(btn.dataset.sound);
    btn.addEventListener("click", () => {
      const turnOn = v.muted;
      // only one video plays sound at a time
      $$("video").forEach(o => { o.muted = true; });
      $$("[data-sound]").forEach(b => { b.classList.remove("is-on"); b.setAttribute("aria-label", "Turn sound on"); });
      if (turnOn) {
        v.muted = false;
        btn.classList.add("is-on");
        btn.setAttribute("aria-label", "Turn sound off");
      }
      v.play().catch(() => {});
    });
  });

  /* =========================================================
     CATEGORIES
     ========================================================= */
  const catGrid = $("#catGrid");
  catGrid.innerHTML = CATEGORIES.map((c, i) => `
    <a href="#shop" class="cat reveal" data-cat="${c.id}" style="transition-delay:${(i % 4) * 0.08}s">
      <div class="cat__img"><img src="${c.cover}" alt="${c.name}" loading="lazy"></div>
      <div class="cat__label"><span class="cat__name">${c.name}</span><span class="cat__shop">Shop</span></div>
    </a>`).join("");
  reveal($$(".cat", catGrid));
  catGrid.addEventListener("click", e => {
    const c = e.target.closest("[data-cat]");
    if (c) setFilter(c.dataset.cat);
  });

  /* =========================================================
     PRODUCTS
     ========================================================= */
  const grid = $("#productGrid"), filtersEl = $("#filters");
  let activeFilter = "all";
  const usedCats = CATEGORIES.filter(c => PRODUCTS.some(p => p.category === c.id));
  filtersEl.innerHTML = [{ id: "all", name: "All" }, ...usedCats]
    .map(c => `<button class="filter${c.id === "all" ? " is-active" : ""}" data-filter="${c.id}" role="tab">${c.name}</button>`).join("");
  filtersEl.addEventListener("click", e => {
    const b = e.target.closest("[data-filter]");
    if (b) setFilter(b.dataset.filter);
  });

  function cardHTML(p) {
    const colors = p.colors || [];
    return `
    <article class="card" data-id="${p.id}">
      <div class="card__media" data-open="${p.id}">
        ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ""}
        <button class="card__wish${wish.includes(p.id) ? " is-on" : ""}" data-wish="${p.id}" aria-label="Add to wishlist">
          <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>
        </button>
        <img class="main" src="${p.images[0]}" alt="${p.name}" loading="lazy">
        ${p.images[1] ? `<img class="alt" src="${p.images[1]}" alt="" loading="lazy">` : ""}
        <button class="card__quick" data-open="${p.id}">Quick View</button>
      </div>
      <div class="card__body">
        <h3 class="card__name" data-open="${p.id}">${p.name}</h3>
        <div class="card__price">${priceText(p)}</div>
        ${colors.length ? `<div class="card__swatches">
          ${colors.slice(0, 6).map((c, i) => `<button class="dot${i === 0 ? " is-active" : ""}" style="background:${swatch(c.name)}" data-card-color="${i}" aria-label="${c.name}" title="${c.name}"></button>`).join("")}
          ${colors.length > 1 ? `<small>${colors.length} colours</small>` : `<small>${colors[0].name}</small>`}
        </div>` : ""}
      </div>
    </article>`;
  }

  function renderProducts() {
    let list = PRODUCTS.filter(p => activeFilter === "all" || p.category === activeFilter);
    if (activeFilter === "all") {
      // mix categories so the first rows show the whole range
      const groups = CATEGORIES.map(c => list.filter(p => p.category === c.id));
      const mixed = [];
      for (let i = 0; mixed.length < list.length; i++) groups.forEach(g => g[i] && mixed.push(g[i]));
      list = mixed;
    }
    grid.innerHTML = list.map(cardHTML).join("");
    $$(".card", grid).forEach((c, i) => {
      c.style.transitionDelay = `${(i % 4) * 0.07}s`;
      io.observe(c);
    });
  }

  function setFilter(id) {
    if (id === activeFilter) return;
    activeFilter = id;
    $$(".filter", filtersEl).forEach(b => b.classList.toggle("is-active", b.dataset.filter === id));
    $$(".card", grid).forEach(c => c.classList.add("is-out"));
    setTimeout(renderProducts, reduceMotion ? 0 : 300);
  }

  grid.addEventListener("click", e => {
    const w = e.target.closest("[data-wish]");
    if (w) { e.stopPropagation(); toggleWish(+w.dataset.wish); return; }
    const dot = e.target.closest("[data-card-color]");
    if (dot) {
      // swatch on the card: switch the photo when that colour has its own
      const card = dot.closest(".card"), p = byId(+card.dataset.id);
      const c = p.colors[+dot.dataset.cardColor];
      $$(".dot", card).forEach(d => d.classList.toggle("is-active", d === dot));
      if (c.image !== undefined && p.images[c.image]) {
        const img = $("img.main", card);
        img.src = p.images[c.image];
        img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: "ease-out" });
      }
      return;
    }
    const o = e.target.closest("[data-open]");
    if (o) {
      const card = o.closest(".card");
      const active = card && $(".dot.is-active", card);
      openModal(+o.dataset.open, active ? +active.dataset.cardColor : 0);
    }
  });

  /* =========================================================
     WISHLIST
     ========================================================= */
  let wish = store.get("mk-wish", []);
  const wishCount = $("#wishCount");
  function syncWish() { wishCount.textContent = wish.length; wishCount.classList.toggle("has", wish.length > 0); }
  function toggleWish(id) {
    const on = !wish.includes(id);
    wish = on ? [...wish, id] : wish.filter(x => x !== id);
    store.set("mk-wish", wish);
    $$(`[data-wish="${id}"]`).forEach(b => b.classList.toggle("is-on", on));
    syncWish(); bump(wishCount);
    toast(on ? "Added to your <b>wishlist</b>" : "Removed from your wishlist");
  }
  $("#wishBtn").addEventListener("click", () => {
    toast(wish.length ? `You have <b>${wish.length}</b> saved ${wish.length === 1 ? "piece" : "pieces"}` : "Your wishlist is empty");
  });

  /* =========================================================
     BAG
     ========================================================= */
  let cart = store.get("mk-bag", []); // [{key, id, color, finish, qty}]
  const cartCount = $("#cartCount"), cartItems = $("#cartItems"), cartTotal = $("#cartTotal");
  const drawer = $("#drawer"), overlay = $("#overlay");

  function addToCart(id, color = "", finish = "") {
    const key = [id, color, finish].join("|");
    const line = cart.find(l => l.key === key);
    if (line) line.qty++; else cart.push({ key, id, color, finish, qty: 1 });
    saveCart(); bump(cartCount);
  }
  function saveCart() {
    cart = cart.filter(l => l.qty > 0 && byId(l.id));
    store.set("mk-bag", cart);
    renderCart();
  }
  function renderCart() {
    const n = cart.reduce((s, l) => s + l.qty, 0);
    cartCount.textContent = n;
    cartCount.classList.toggle("has", n > 0);
    cartItems.innerHTML = !cart.length
      ? `<div class="drawer__empty"><p>Your bag is empty.</p><a href="#shop" class="btn btn--dark" data-close-bag><span>Start Shopping</span></a></div>`
      : cart.map(l => {
          const p = byId(l.id);
          const c = (p.colors || []).find(c => c.name === l.color);
          const img = c && c.image !== undefined ? p.images[c.image] : p.images[0];
          const opts = [l.color, l.finish].filter(Boolean).join(" · ");
          return `
          <div class="line-item">
            <img src="${img}" alt="">
            <div>
              <h4>${p.name}</h4>
              ${opts ? `<div class="line-item__opt">${opts}</div>` : ""}
              <div class="line-item__price">${priceText(p)}</div>
              <div class="qty">
                <button data-dec="${l.key}" aria-label="Decrease">−</button>
                <span>${l.qty}</span>
                <button data-inc="${l.key}" aria-label="Increase">+</button>
              </div>
            </div>
            <button class="line-item__rm" data-rm="${l.key}">Remove</button>
          </div>`;
        }).join("");
    const priced = cart.every(l => hasPrice(byId(l.id)));
    const total = cart.reduce((s, l) => s + l.qty * (byId(l.id).price || 0), 0);
    cartTotal.textContent = !cart.length ? money(0) : priced ? money(total) : "On request";
  }
  cartItems.addEventListener("click", e => {
    if (e.target.closest("[data-close-bag]")) { closeDrawer(); return; }
    const btn = e.target.closest("[data-inc], [data-dec], [data-rm]");
    if (!btn) return;
    const key = btn.dataset.inc || btn.dataset.dec || btn.dataset.rm;
    const line = cart.find(l => l.key === key);
    if (!line) return;
    if (btn.dataset.inc) line.qty++;
    if (btn.dataset.dec) line.qty--;
    if (btn.dataset.rm) line.qty = 0;
    saveCart();
  });

  function openDrawer() { drawer.classList.add("is-open"); overlay.classList.add("is-open"); body.classList.add("no-scroll"); }
  function closeDrawer() { drawer.classList.remove("is-open"); overlay.classList.remove("is-open"); body.classList.remove("no-scroll"); }
  $("#cartBtn").addEventListener("click", openDrawer);
  $("#drawerClose").addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  // copy an order summary so the customer can paste it into an Instagram message
  $("#checkoutBtn").addEventListener("click", e => {
    if (!cart.length) { e.preventDefault(); toast("Your bag is empty"); return; }
    const lines = cart.map(l => {
      const p = byId(l.id);
      const opts = [l.color, l.finish].filter(Boolean).join(", ");
      return `• ${p.name}${opts ? ` (${opts})` : ""} × ${l.qty}${hasPrice(p) ? ` — ${money(p.price * l.qty)}` : ""}`;
    });
    const text = `Hello MK Luxury, I'd like to order:\n${lines.join("\n")}`;
    navigator.clipboard?.writeText(text).then(() => toast("Order <b>copied</b> — paste it into our messages"), () => {});
  });

  /* =========================================================
     PRODUCT MODAL
     ========================================================= */
  const modal = $("#modal"), modalCard = $("#modalCard");
  let current = null, pickedColor = 0, pickedFinish = 0;

  function openModal(id, colorIndex = 0) {
    const p = byId(id);
    current = p; pickedColor = colorIndex; pickedFinish = 0;
    const colors = p.colors || [];
    const startImg = colors[colorIndex] && colors[colorIndex].image !== undefined ? colors[colorIndex].image : 0;
    modalCard.innerHTML = `
      <button class="modal__close" aria-label="Close">&times;</button>
      <div class="modal__gallery">
        <div class="modal__main" id="modalMain"><img src="${p.images[startImg]}" alt="${p.name}"></div>
        ${p.images.length > 1 ? `<div class="modal__thumbs">${p.images.map((src, i) =>
          `<button class="${i === startImg ? "is-active" : ""}" data-thumb="${i}" aria-label="Photo ${i + 1}"><img src="${src}" alt=""></button>`).join("")}</div>` : ""}
      </div>
      <div class="modal__info">
        <p class="kicker">${catName(p.category)}</p>
        <h3>${p.name}</h3>
        <div class="modal__price">${priceText(p)}</div>
        <p class="modal__desc">${p.description || "Hand-picked for the season. Message us on Instagram for sizes and availability, or visit our store to try it on."}</p>
        ${colors.length ? `<div class="opt">
          <div class="opt__label">Colour <b id="colorName">${colors[colorIndex].name}</b></div>
          <div class="opt__swatches">${colors.map((c, i) =>
            `<button class="dot${i === colorIndex ? " is-active" : ""}" style="background:${swatch(c.name)}" data-color="${i}" aria-label="${c.name}" title="${c.name}"></button>`).join("")}</div>
        </div>` : ""}
        ${p.finishes ? `<div class="opt">
          <div class="opt__label">Finish</div>
          <div class="opt__pills">${p.finishes.map((f, i) => `<button class="pill${i === 0 ? " is-active" : ""}" data-finish="${i}">${f}</button>`).join("")}</div>
        </div>` : ""}
        <div class="modal__actions">
          <button class="btn btn--dark btn--block" data-add><span>Add to Bag</span></button>
          <a class="modal__ask" href="${IG}" target="_blank" rel="noopener">Ask about sizes on Instagram</a>
        </div>
      </div>`;
    modal.classList.add("is-open");
    body.classList.add("no-scroll");
  }
  function closeModal() { modal.classList.remove("is-open"); if (!drawer.classList.contains("is-open")) body.classList.remove("no-scroll"); }
  function showImage(i) {
    const main = $("#modalMain");
    main.innerHTML = `<img class="is-new" src="${current.images[i]}" alt="${current.name}">`;
    $$("[data-thumb]", modalCard).forEach(b => b.classList.toggle("is-active", +b.dataset.thumb === i));
  }
  modal.addEventListener("click", e => {
    if (e.target === modal || e.target.closest(".modal__close")) { closeModal(); return; }
    const thumb = e.target.closest("[data-thumb]");
    if (thumb) { showImage(+thumb.dataset.thumb); return; }
    const color = e.target.closest("[data-color]");
    if (color) {
      pickedColor = +color.dataset.color;
      const c = current.colors[pickedColor];
      $$("[data-color]", modalCard).forEach(b => b.classList.toggle("is-active", b === color));
      $("#colorName").textContent = c.name;
      if (c.image !== undefined) showImage(c.image);
      return;
    }
    const fin = e.target.closest("[data-finish]");
    if (fin) {
      pickedFinish = +fin.dataset.finish;
      $$("[data-finish]", modalCard).forEach(b => b.classList.toggle("is-active", b === fin));
      return;
    }
    if (e.target.closest("[data-add]")) {
      const color = current.colors ? current.colors[pickedColor].name : "";
      const finish = current.finishes ? current.finishes[pickedFinish] : "";
      addToCart(current.id, color, finish);
      closeModal();
      setTimeout(openDrawer, 250);
    }
  });

  /* =========================================================
     SEARCH
     ========================================================= */
  const search = $("#search"), searchInput = $("#searchInput"), searchResults = $("#searchResults");
  function renderSearch() {
    const q = searchInput.value.trim().toLowerCase();
    const list = q ? PRODUCTS.filter(p => (p.name + " " + catName(p.category) + " " + (p.colors || []).map(c => c.name).join(" ")).toLowerCase().includes(q)) : [];
    searchResults.innerHTML = q && !list.length
      ? `<p style="color:var(--muted)">No results found.</p>`
      : list.map(p => `<button data-sr="${p.id}"><img src="${p.images[0]}" alt=""><span>${p.name}</span><small>${catName(p.category)}</small></button>`).join("");
  }
  $("#searchBtn").addEventListener("click", () => { search.classList.add("is-open"); body.classList.add("no-scroll"); setTimeout(() => searchInput.focus(), 150); });
  function closeSearch() { search.classList.remove("is-open"); body.classList.remove("no-scroll"); }
  $("#searchClose").addEventListener("click", closeSearch);
  searchInput.addEventListener("input", renderSearch);
  searchResults.addEventListener("click", e => {
    const b = e.target.closest("[data-sr]");
    if (b) { closeSearch(); openModal(+b.dataset.sr); }
  });

  /* =========================================================
     MOBILE MENU
     ========================================================= */
  const burger = $("#burger"), menu = $("#mobileMenu");
  function toggleMenu(force) {
    const open = force ?? !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
    body.classList.toggle("menu-open", open);
    body.classList.toggle("no-scroll", open);
  }
  burger.addEventListener("click", () => toggleMenu());
  $$("a", menu).forEach(a => a.addEventListener("click", () => toggleMenu(false)));

  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    closeModal(); closeDrawer(); closeSearch(); toggleMenu(false);
  });

  /* =========================================================
     CHRISTMAS — countdown + falling snow
     ========================================================= */
  (function countdown() {
    const el = $("#countdown");
    if (!el) return;
    const parts = { d: $('[data-cd="d"]', el), h: $('[data-cd="h"]', el), m: $('[data-cd="m"]', el), s: $('[data-cd="s"]', el) };
    function target() {
      const now = new Date();
      let t = new Date(now.getFullYear(), 11, 25);
      if (now > new Date(now.getFullYear(), 11, 26)) t = new Date(now.getFullYear() + 1, 11, 25);
      return t;
    }
    const pad = n => String(n).padStart(2, "0");
    function tick() {
      const diff = Math.max(0, target() - new Date());
      parts.d.textContent = pad(Math.floor(diff / 864e5));
      parts.h.textContent = pad(Math.floor(diff / 36e5) % 24);
      parts.m.textContent = pad(Math.floor(diff / 6e4) % 60);
      parts.s.textContent = pad(Math.floor(diff / 1e3) % 60);
    }
    tick();
    setInterval(tick, 1000);
  })();

  (function snow() {
    const canvas = $("#snow");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    let w, h, flakes = [], running = false;
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      flakes = Array.from({ length: Math.round(Math.min(110, w / 12)) }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4, vy: Math.random() * 0.5 + 0.2,
        drift: Math.random() * Math.PI * 2, a: Math.random() * 0.5 + 0.25
      }));
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.vy; f.drift += 0.01; f.x += Math.sin(f.drift) * 0.3;
        if (f.y > h + 5) { f.y = -5; f.x = Math.random() * w; }
        ctx.beginPath();
        ctx.fillStyle = `rgba(240, 225, 180, ${f.a})`;
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    resize();
    window.addEventListener("resize", resize);
    new IntersectionObserver(([e]) => {
      const was = running; running = e.isIntersecting;
      if (running && !was) requestAnimationFrame(frame);
    }).observe(canvas);
  })();

  /* =========================================================
     INSTAGRAM, TOAST, MISC
     ========================================================= */
  const instaGrid = $("#instaGrid");
  instaGrid.innerHTML = INSTAGRAM.map((src, i) => `
    <a class="insta-item reveal" href="${IG}" target="_blank" rel="noopener" aria-label="View on Instagram" style="transition-delay:${i * 0.06}s">
      <img src="${src}" alt="" loading="lazy">
    </a>`).join("");
  reveal($$(".insta-item", instaGrid));

  const toastEl = $("#toast");
  let toastTimer;
  function toast(html) {
    toastEl.innerHTML = html;
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-show"), 2600);
  }
  function bump(el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }

  $("#year").textContent = new Date().getFullYear();

  renderProducts();
  renderCart();
  syncWish();
})();
