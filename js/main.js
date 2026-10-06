/* =========================================================
   MK LUXURY — interactions & animations
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const money = n => "₺" + new Intl.NumberFormat("tr-TR").format(n);
  const catName = id => (CATEGORIES.find(c => c.id === id) || {}).name || "";

  const store = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage unavailable */ } }
  };

  /* ---------- line-art icons per category ---------- */
  const ICONS = {
    canta: '<svg viewBox="0 0 100 100"><path d="M18 38h64l-5 48H23z"/><path d="M36 38v-8a14 14 0 0 1 28 0v8"/><path d="M18 50h64"/><rect x="44" y="46" width="12" height="9" rx="1"/></svg>',
    saat: '<svg viewBox="0 0 100 100"><rect x="38" y="4" width="24" height="18" rx="3"/><rect x="38" y="78" width="24" height="18" rx="3"/><circle cx="50" cy="50" r="28"/><circle cx="50" cy="50" r="22"/><path d="M50 34v16l10 6"/><path d="M79 46v8"/></svg>',
    ayakkabi: '<svg viewBox="0 0 100 100"><path d="M8 62c0-8 4-22 8-26 6 2 14 10 24 12s22 4 34 8 18 8 18 14v6H8z"/><path d="M8 70h84"/><path d="M30 44l6 6M38 46l6 6M46 48l5 6"/></svg>',
    gozluk: '<svg viewBox="0 0 100 100"><ellipse cx="28" cy="54" rx="18" ry="14"/><ellipse cx="72" cy="54" rx="18" ry="14"/><path d="M46 52c2-4 6-4 8 0"/><path d="M10 50L4 40M90 50l6-10"/></svg>',
    parfum: '<svg viewBox="0 0 100 100"><rect x="26" y="38" width="48" height="54" rx="6"/><rect x="40" y="24" width="20" height="14"/><rect x="36" y="10" width="28" height="14" rx="2"/><path d="M36 60h28M36 68h18"/></svg>',
    taki: '<svg viewBox="0 0 100 100"><path d="M14 14c0 30 16 50 36 50s36-20 36-50"/><path d="M50 64l-9 12 9 14 9-14z"/><circle cx="26" cy="38" r="2"/><circle cx="74" cy="38" r="2"/><circle cx="38" cy="54" r="2"/><circle cx="62" cy="54" r="2"/></svg>'
  };
  ICONS.mont = ICONS.parka = ICONS.ceket =
    '<svg viewBox="0 0 100 100"><path d="M38 10h24l6 8 18 10-6 52H20l-6-52 18-10z"/><path d="M50 18v68"/><path d="M20 40h60M18 56h64M16 72h68"/><path d="M38 10c0 8 6 14 12 14s12-6 12-14"/></svg>';
  const fallbackIcon = p => ICONS[p.category] || ICONS.mont;
  const art = (p, n = 0) => p.images && p.images[n]
    ? `<img src="${p.images[n]}" alt="${p.name}" loading="lazy">`
    : fallbackIcon(p);
  const hasPrice = p => typeof p.price === "number";
  const priceHTML = p => hasPrice(p)
    ? money(p.price) + (p.oldPrice > p.price ? `<s>${money(p.oldPrice)}</s>` : "")
    : `<span class="card__dm">Fiyat için DM</span>`;

  /* =========================================================
     INTRO
     ========================================================= */
  const body = document.body;
  const intro = $("#intro");
  const countEl = $("#introCount");
  const seen = (() => { try { return sessionStorage.getItem("mk-intro") === "1"; } catch { return false; } })();
  const introDuration = reduceMotion ? 200 : seen ? 900 : 2400;

  function finishIntro() {
    body.classList.add("intro-done");
    body.classList.remove("is-loading");
    setTimeout(() => body.classList.add("is-ready"), reduceMotion ? 0 : 450);
    setTimeout(() => body.classList.add("intro-gone"), 1400);
    try { sessionStorage.setItem("mk-intro", "1"); } catch { /* ignore */ }
  }

  (function runIntro() {
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    function tick(now) {
      const t = Math.min(1, (now - start) / introDuration);
      const p = ease(t);
      countEl.textContent = Math.round(p * 100);
      intro.style.setProperty("--p", p);
      if (t < 1) requestAnimationFrame(tick);
      else setTimeout(finishIntro, reduceMotion ? 0 : 250);
    }
    requestAnimationFrame(tick);
  })();

  /* split hero headline into animated characters */
  $$(".split").forEach(el => {
    const text = el.textContent;
    el.textContent = "";
    [...text].forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = ch === " " ? " " : ch;
      s.style.transitionDelay = (0.2 + i * 0.045 + (el.closest(".line") === $$(".hero__title .line")[1] ? 0.25 : 0)) + "s";
      el.appendChild(s);
    });
  });

  /* =========================================================
     HERO PARTICLES (gold dust)
     ========================================================= */
  (function particles() {
    const canvas = $("#particles");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    let w, h, dpr, parts = [], running = true;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (w * h) / 14000));
      parts = Array.from({ length: count }, () => spawn(true));
    }
    function spawn(anywhere) {
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 10,
        r: Math.random() * 1.6 + 0.3,
        vy: Math.random() * 0.35 + 0.08,
        vx: (Math.random() - 0.5) * 0.15,
        a: Math.random() * 0.6 + 0.2,
        tw: Math.random() * Math.PI * 2
      };
    }
    let mx = 0, my = 0;
    window.addEventListener("pointermove", e => { mx = (e.clientX / innerWidth - 0.5); my = (e.clientY / innerHeight - 0.5); }, { passive: true });

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.vy; p.x += p.vx; p.tw += 0.03;
        if (p.y < -10) Object.assign(p, spawn(false));
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        const px = p.x + mx * p.r * 14, py = p.y + my * p.r * 14;
        ctx.beginPath();
        ctx.fillStyle = `rgba(232, 200, 110, ${alpha})`;
        ctx.shadowColor = "rgba(212,175,55,.8)";
        ctx.shadowBlur = p.r * 6;
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
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
    requestAnimationFrame(frame);
  })();

  /* =========================================================
     CURSOR + MAGNETIC BUTTONS
     ========================================================= */
  if (finePointer && !reduceMotion) {
    const cur = $("#cursor"), dot = $("#cursorDot");
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    window.addEventListener("pointermove", e => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
    (function loop() {
      cx += (x - cx) * 0.16; cy += (y - cy) * 0.16;
      cur.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener("pointerover", e => {
      cur.classList.toggle("is-hover", !!e.target.closest("a, button, .card__media, .cat, input"));
    });

    document.addEventListener("pointermove", e => {
      $$(".magnetic").forEach(btn => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const near = Math.hypot(dx, dy) < Math.max(r.width, r.height);
        btn.style.transform = near ? `translate(${dx * 0.18}px, ${dy * 0.3}px)` : "";
        btn.style.transition = "transform .5s cubic-bezier(.16,1,.3,1), color .5s";
      });
    }, { passive: true });
  }

  /* =========================================================
     HEADER, PROGRESS, PARALLAX
     ========================================================= */
  const header = $("#header"), progress = $("#progress");
  const parallaxEls = $$(".parallax");
  let lastY = 0, ticking = false;
  function onScroll() {
    const y = scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    header.classList.toggle("is-hidden", y > lastY && y > 500 && !$("#mobileMenu").classList.contains("is-open"));
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (!reduceMotion) {
      parallaxEls.forEach(el => {
        const r = el.getBoundingClientRect();
        const offset = (r.top + r.height / 2 - innerHeight / 2) * parseFloat(el.dataset.speed || 0.1);
        el.style.transform = `translateY(${offset}px)`;
      });
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* =========================================================
     REVEAL ON SCROLL + COUNTERS
     ========================================================= */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      const num = e.target.querySelector("[data-count]");
      if (num) countUp(num);
      revealIO.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  const observeReveal = els => els.forEach(el => revealIO.observe(el));
  observeReveal($$(".reveal"));

  function countUp(el) {
    const target = +el.dataset.count, suffix = el.dataset.suffix || "";
    const dur = reduceMotion ? 0 : 1800, start = performance.now();
    (function step(now) {
      const t = dur ? Math.min(1, (now - start) / dur) : 1;
      const v = Math.round(target * (1 - Math.pow(1 - t, 4)));
      el.textContent = new Intl.NumberFormat("tr-TR").format(v) + suffix;
      if (t < 1) requestAnimationFrame(step);
    })(start);
  }

  /* =========================================================
     CATEGORIES
     ========================================================= */
  const catGrid = $("#catGrid");
  catGrid.innerHTML = CATEGORIES.map((c, i) => {
    const sample = c.cover || (PRODUCTS.find(p => p.category === c.id && p.images && p.images[0]) || {}).images?.[0];
    return `
    <a href="#koleksiyon" class="cat reveal" data-cat="${c.id}" style="transition-delay:${(i % 4) * 0.1}s">
      <div class="cat__art">${sample ? `<img src="${sample}" alt="" loading="lazy">` : ICONS[c.id] || ""}</div>
      <span class="cat__name">${c.name}</span>
      <span class="cat__desc">${c.desc} <i>→</i></span>
    </a>`;
  }).join("");
  observeReveal($$(".cat", catGrid));

  $$(".cat", catGrid).forEach(card => {
    card.addEventListener("click", () => setFilter(card.dataset.cat));
    if (!finePointer || reduceMotion) return;
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });

  /* =========================================================
     PRODUCTS + FILTERS
     ========================================================= */
  const grid = $("#productGrid"), filtersEl = $("#filters");
  let activeFilter = "all";
  const usedCats = CATEGORIES.filter(c => PRODUCTS.some(p => p.category === c.id));
  filtersEl.innerHTML = [{ id: "all", name: "Tümü" }, ...usedCats]
    .map(c => `<button class="filter${c.id === "all" ? " is-active" : ""}" data-filter="${c.id}" role="tab">${c.name}</button>`).join("");
  filtersEl.addEventListener("click", e => {
    const b = e.target.closest("[data-filter]");
    if (b) setFilter(b.dataset.filter);
  });

  function cardHTML(p) {
    const sale = p.oldPrice && p.oldPrice > p.price;
    return `
    <article class="card" data-id="${p.id}">
      <div class="card__media" data-quick="${p.id}">
        ${p.badge ? `<span class="card__badge${sale ? " card__badge--sale" : ""}">${p.badge}</span>` : ""}
        <button class="card__wish${wish.includes(p.id) ? " is-on" : ""}" data-wish="${p.id}" aria-label="Favorilere ekle">
          <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>
        </button>
        <div class="card__art${p.images && p.images[1] ? " has-alt" : ""}">${art(p)}${p.images && p.images[1] ? art(p, 1) : ""}</div>
        <button class="btn btn--dark card__add" data-add="${p.id}"><span>Sepete Ekle</span></button>
      </div>
      <div class="card__body">
        <div class="card__cat">${catName(p.category)}${p.colors ? ` · ${p.colors.length} renk` : ""}</div>
        <h3 class="card__name">${p.name}</h3>
        <div class="card__price">${priceHTML(p)}</div>
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
      c.style.transitionDelay = `${(i % 4) * 0.08}s`;
      revealIO.observe(c);
    });
  }

  function setFilter(id) {
    if (id === activeFilter) return;
    activeFilter = id;
    $$(".filter", filtersEl).forEach(b => b.classList.toggle("is-active", b.dataset.filter === id));
    const cards = $$(".card", grid);
    cards.forEach(c => c.classList.add("is-out"));
    setTimeout(renderProducts, reduceMotion ? 0 : 320);
  }

  grid.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    const w = e.target.closest("[data-wish]");
    const q = e.target.closest("[data-quick]");
    if (add) { e.stopPropagation(); addToCart(+add.dataset.add); return; }
    if (w) { e.stopPropagation(); toggleWish(+w.dataset.wish, w); return; }
    if (q) openModal(+q.dataset.quick);
  });

  /* =========================================================
     WISHLIST
     ========================================================= */
  let wish = store.get("mk-wish", []);
  const wishCount = $("#wishCount");
  function syncWish() {
    wishCount.textContent = wish.length;
    wishCount.classList.toggle("has", wish.length > 0);
  }
  function toggleWish(id, btn) {
    const on = !wish.includes(id);
    wish = on ? [...wish, id] : wish.filter(x => x !== id);
    store.set("mk-wish", wish);
    $$(`[data-wish="${id}"]`).forEach(b => b.classList.toggle("is-on", on));
    syncWish();
    bump(wishCount);
    toast(on ? "<b>Favorilere</b> eklendi" : "Favorilerden çıkarıldı");
  }
  $("#wishBtn").addEventListener("click", () => {
    if (!wish.length) { toast("Henüz favori ürününüz yok"); return; }
    const first = PRODUCTS.find(p => p.id === wish[0]);
    toast(`<b>${wish.length}</b> favori ürün · ${first ? first.name : ""}`);
  });

  /* =========================================================
     CART
     ========================================================= */
  let cart = store.get("mk-cart", []).filter(l => l.key); // [{key, id, color, qty}]
  const cartCount = $("#cartCount"), cartItems = $("#cartItems"), cartTotal = $("#cartTotal");
  const drawer = $("#drawer"), overlay = $("#overlay");

  function addToCart(id, color) {
    const p0 = PRODUCTS.find(x => x.id === id);
    color = color || (p0.colors ? p0.colors[0] : "");
    const key = id + (color ? "|" + color : "");
    const line = cart.find(l => l.key === key);
    if (line) line.qty++; else cart.push({ key, id, color, qty: 1 });
    saveCart();
    bump(cartCount);
    const p = PRODUCTS.find(x => x.id === id);
    toast(`<b>${p.name}</b> sepete eklendi`);
  }
  function saveCart() {
    cart = cart.filter(l => l.key && l.qty > 0 && PRODUCTS.some(p => p.id === l.id));
    store.set("mk-cart", cart);
    renderCart();
  }
  function renderCart() {
    const n = cart.reduce((s, l) => s + l.qty, 0);
    cartCount.textContent = n;
    cartCount.classList.toggle("has", n > 0);
    if (!cart.length) {
      cartItems.innerHTML = `<div class="drawer__empty">${ICONS.mont}<p>Sepetiniz şu an boş.</p></div>`;
    } else {
      cartItems.innerHTML = cart.map(l => {
        const p = PRODUCTS.find(x => x.id === l.id);
        return `
        <div class="line-item">
          <div class="line-item__img">${art(p)}</div>
          <div>
            <h4>${p.name}</h4>
            ${l.color ? `<div class="line-item__opt">Renk: ${l.color}</div>` : ""}
            <div class="price">${priceHTML(p)}</div>
            <div class="qty">
              <button data-dec="${l.key}" aria-label="Azalt">−</button>
              <span>${l.qty}</span>
              <button data-inc="${l.key}" aria-label="Arttır">+</button>
            </div>
          </div>
          <button class="line-item__rm" data-rm="${l.key}">Sil</button>
        </div>`;
      }).join("");
    }
    const priced = cart.every(l => hasPrice(PRODUCTS.find(p => p.id === l.id)));
    const total = cart.reduce((s, l) => s + l.qty * (PRODUCTS.find(p => p.id === l.id).price || 0), 0);
    cartTotal.textContent = !cart.length ? money(0) : priced ? money(total) : "DM ile";
  }
  cartItems.addEventListener("click", e => {
    const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]"), rm = e.target.closest("[data-rm]");
    const btn = inc || dec || rm;
    if (!btn) return;
    const key = btn.dataset.inc || btn.dataset.dec || btn.dataset.rm;
    const line = cart.find(l => l.key === key);
    if (!line) return;
    if (inc) line.qty++;
    if (dec) line.qty--;
    if (rm) line.qty = 0;
    saveCart();
  });

  function openDrawer() { drawer.classList.add("is-open"); overlay.classList.add("is-open"); body.classList.add("no-scroll"); }
  function closeDrawer() { drawer.classList.remove("is-open"); overlay.classList.remove("is-open"); body.classList.remove("no-scroll"); }
  $("#cartBtn").addEventListener("click", openDrawer);
  $("#drawerClose").addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  // copy an order summary so the customer can paste it into an Instagram DM
  $("#checkoutBtn").addEventListener("click", e => {
    if (!cart.length) { e.preventDefault(); toast("Sepetiniz boş"); return; }
    const lines = cart.map(l => {
      const p = PRODUCTS.find(x => x.id === l.id);
      return `• ${p.name}${l.color ? ` (${l.color})` : ""} x${l.qty}${hasPrice(p) ? ` — ${money(p.price * l.qty)}` : ""}`;
    });
    const text = `Merhaba MK Luxury, sipariş vermek istiyorum:\n${lines.join("\n")}\nToplam: ${cartTotal.textContent}`;
    navigator.clipboard?.writeText(text).then(
      () => toast("Sipariş özeti <b>kopyalandı</b> — DM'e yapıştırın"),
      () => {}
    );
  });

  /* =========================================================
     QUICK VIEW MODAL
     ========================================================= */
  const modal = $("#modal"), modalCard = $("#modalCard");
  let modalProduct = null;
  function openModal(id) {
    modalProduct = id;
    const p = PRODUCTS.find(x => x.id === id);
    const imgs = p.images || [];
    modalCard.innerHTML = `
      <button class="modal__close" aria-label="Kapat">&times;</button>
      <div class="modal__gallery">
        <div class="modal__media" id="modalMain">${art(p)}</div>
        ${imgs.length > 1 ? `<div class="modal__thumbs">${imgs.map((src, i) =>
          `<button class="${i === 0 ? "is-active" : ""}" data-thumb="${i}" aria-label="Fotoğraf ${i + 1}"><img src="${src}" alt=""></button>`).join("")}</div>` : ""}
      </div>
      <div class="modal__info">
        <div class="card__cat">${catName(p.category)}</div>
        <h3>${p.name}</h3>
        <div class="card__price">${priceHTML(p)}</div>
        <p>${p.description || "Beden, stok ve fiyat bilgisi için Instagram üzerinden bize yazabilir ya da mağazamızı ziyaret edebilirsiniz."}</p>
        ${p.colors ? `<div class="swatches" role="radiogroup" aria-label="Renk">${p.colors.map((c, i) =>
          `<button class="swatch${i === 0 ? " is-active" : ""}" data-color="${c}" role="radio" aria-checked="${i === 0}">${c}</button>`).join("")}</div>` : ""}
        <button class="btn btn--gold btn--block" data-modal-add="${p.id}"><span>Sepete Ekle</span></button>
      </div>`;
    modal.classList.add("is-open");
    body.classList.add("no-scroll");
  }
  function closeModal() { modal.classList.remove("is-open"); body.classList.remove("no-scroll"); }
  modal.addEventListener("click", e => {
    if (e.target === modal || e.target.closest(".modal__close")) closeModal();
    const add = e.target.closest("[data-modal-add]");
    const thumb = e.target.closest("[data-thumb]");
    if (thumb) {
      const p = PRODUCTS.find(x => x.id === modalProduct);
      const main = $("#modalMain");
      main.classList.remove("is-swap"); void main.offsetWidth;
      main.innerHTML = art(p, +thumb.dataset.thumb);
      main.classList.add("is-swap");
      $$("[data-thumb]", modalCard).forEach(b => b.classList.toggle("is-active", b === thumb));
    }
    const sw = e.target.closest("[data-color]");
    if (sw) {
      $$("[data-color]", modalCard).forEach(b => { b.classList.toggle("is-active", b === sw); b.setAttribute("aria-checked", b === sw); });
      const p = PRODUCTS.find(x => x.id === modalProduct);
      const idx = p.colors.indexOf(sw.dataset.color);
      if (p.colorImages && p.images[idx]) $(`[data-thumb="${idx}"]`, modalCard)?.click();
    }
    if (add) {
      const color = ($(".swatch.is-active", modalCard) || {}).dataset?.color;
      addToCart(+add.dataset.modalAdd, color); closeModal(); setTimeout(openDrawer, 300);
    }
  });

  /* =========================================================
     SEARCH
     ========================================================= */
  const search = $("#search"), searchInput = $("#searchInput"), searchResults = $("#searchResults");
  const norm = s => s.toLocaleLowerCase("tr-TR");
  function renderSearch() {
    const q = norm(searchInput.value.trim());
    const list = q ? PRODUCTS.filter(p => norm(p.name + " " + catName(p.category)).includes(q)) : [];
    searchResults.innerHTML = q && !list.length
      ? `<p style="color:var(--muted)">Sonuç bulunamadı.</p>`
      : list.map(p => `<button data-sr="${p.id}"><span>${p.name}</span><span style="color:var(--gold)">${hasPrice(p) ? money(p.price) : catName(p.category)}</span></button>`).join("");
  }
  $("#searchBtn").addEventListener("click", () => { search.classList.add("is-open"); setTimeout(() => searchInput.focus(), 200); });
  $("#searchClose").addEventListener("click", () => search.classList.remove("is-open"));
  searchInput.addEventListener("input", renderSearch);
  searchResults.addEventListener("click", e => {
    const b = e.target.closest("[data-sr]");
    if (b) { search.classList.remove("is-open"); openModal(+b.dataset.sr); }
  });

  /* =========================================================
     MOBILE MENU
     ========================================================= */
  const burger = $("#burger"), mobileMenu = $("#mobileMenu");
  function toggleMenu(force) {
    const open = force ?? !mobileMenu.classList.contains("is-open");
    mobileMenu.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
    body.classList.toggle("no-scroll", open);
    header.classList.remove("is-hidden");
  }
  burger.addEventListener("click", () => toggleMenu());
  $$("a", mobileMenu).forEach(a => a.addEventListener("click", () => toggleMenu(false)));

  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    closeModal(); closeDrawer(); search.classList.remove("is-open"); toggleMenu(false);
  });

  /* =========================================================
     TESTIMONIAL SLIDER
     ========================================================= */
  (function slider() {
    const track = $("#sliderTrack"), dotsEl = $("#sliderDots");
    if (!track) return;
    const slides = $$(".quote", track);
    let i = 0, timer;
    dotsEl.innerHTML = slides.map((_, n) => `<button aria-label="Yorum ${n + 1}"${n === 0 ? ' class="is-active"' : ""}></button>`).join("");
    const dots = $$("button", dotsEl);
    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${i * 100}%)`;
      dots.forEach((d, k) => d.classList.toggle("is-active", k === i));
    }
    function auto() { clearInterval(timer); timer = setInterval(() => go(i + 1), 5500); }
    dots.forEach((d, k) => d.addEventListener("click", () => { go(k); auto(); }));
    let sx = null;
    track.addEventListener("pointerdown", e => { sx = e.clientX; });
    track.addEventListener("pointerup", e => {
      if (sx === null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); auto(); }
    });
    auto();
  })();

  /* =========================================================
     INSTAGRAM GRID
     ========================================================= */
  const instaGrid = $("#instaGrid");
  instaGrid.innerHTML = INSTAGRAM.map((src, i) => `
    <a class="insta-item reveal" href="https://www.instagram.com/mkluxurytr" target="_blank" rel="noopener" aria-label="Instagram'da gör" style="transition-delay:${i * 0.07}s">
      <img src="${src}" alt="" loading="lazy">
    </a>`).join("");
  observeReveal($$(".insta-item", instaGrid));

  /* =========================================================
     NEWSLETTER, TOAST, MISC
     ========================================================= */
  $("#newsletterForm")?.addEventListener("submit", e => {
    e.preventDefault();
    e.target.reset();
    toast("Teşekkürler! <b>Ayrıcalıklı listeye</b> katıldınız.");
  });

  const toastEl = $("#toast");
  let toastTimer;
  function toast(html) {
    toastEl.innerHTML = html;
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-show"), 2600);
  }
  function bump(el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }

  /* store video: play only while visible, sound toggle */
  const video = $("#storeVideo"), soundBtn = $("#videoSound");
  if (video) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (video.preload === "none") video.preload = "auto";
        if (!reduceMotion || !video.muted) video.play().catch(() => {});
      } else video.pause();
    }, { threshold: 0.35 }).observe(video);
    soundBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      soundBtn.classList.toggle("is-on", !video.muted);
      soundBtn.setAttribute("aria-label", video.muted ? "Sesi aç" : "Sesi kapat");
      video.play().catch(() => {});
    });
  }

  $("#year").textContent = new Date().getFullYear();

  renderProducts();
  renderCart();
  syncWish();
})();
