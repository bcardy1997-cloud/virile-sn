/* =========================================================
   VIRILE-SN — Script commun (en-tête, panier, produits…)
   ========================================================= */
(function () {
  const C = window.VIRILE_CONFIG;
  const P = window.VIRILE_PRODUITS || [];
  const CATS = window.VIRILE_CATEGORIES || [];

  /* ---------- Utilitaires ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fmt = n => Math.round(n).toLocaleString("fr-FR").replace(/ | /g, " ") + " " + C.devise;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const byId = id => P.find(p => p.id === id);
  const catById = id => CATS.find(c => c.id === id);
  const waLink = msg => "https://wa.me/" + C.whatsapp + (msg ? "?text=" + encodeURIComponent(msg) : "");
  const page = document.body.dataset.page || "";

  /* ---------- Icônes ---------- */
  const I = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.8 7L4 20l1.1-4.6A8 8 0 1 1 21 12z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7"/></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-9.2-9.3C1.6 7.3 3.9 4 7.3 4c2 0 3.6 1.1 4.7 2.7C13.1 5.1 14.7 4 16.7 4c3.4 0 5.7 3.3 4.5 6.7C19.5 15.4 12 20 12 20z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.7 17.8L0 24l6.3-1.7a11.8 11.8 0 0 0 5.7 1.4A11.8 11.8 0 0 0 20.4 3.6z"/></svg>'
  };

  const LOGO = '<svg class="logo-mark" viewBox="0 0 40 40"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d4243f"/><stop offset="1" stop-color="#7a0c1f"/></linearGradient></defs><rect width="40" height="40" rx="11" fill="url(#lg)"/><path d="M11 12l9 17 9-17" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="29" cy="12" r="2.6" fill="#c9a24a"/></svg>';
  const logoHTML = (dark) => `<a href="index.html" class="logo" aria-label="Virile-SN accueil">${LOGO}<span>Virile<b>-SN</b><small>Bien-être intime</small></span></a>`;

  /* ---------- Illustrations produits (SVG) ---------- */
  let uid = 0;
  function visual(type, color = "#b3122e") {
    const id = "v" + (++uid);
    const bg = `<defs>
      <radialGradient id="${id}bg" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#efe8e2"/></radialGradient>
      <linearGradient id="${id}gl" x1="0" x2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".85"/><stop offset=".35" stop-color="#e8f1f6" stop-opacity=".45"/><stop offset="1" stop-color="#c9d9e3" stop-opacity=".7"/></linearGradient>
      <linearGradient id="${id}c" x1="0" x2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${shade(color, -35)}"/></linearGradient>
      <linearGradient id="${id}cv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(color, 25)}"/><stop offset="1" stop-color="${shade(color, -30)}"/></linearGradient>
    </defs><rect width="400" height="400" fill="url(#${id}bg)"/><ellipse cx="200" cy="335" rx="125" ry="14" fill="#000" opacity=".08"/>`;
    const tick = (x, y1, n, step) => Array.from({ length: n }, (_, i) => `<line x1="${x}" x2="${x + (i % 2 ? 8 : 14)}" y1="${y1 + i * step}" y2="${y1 + i * step}" stroke="#7f95a3" stroke-width="2"/>`).join("");
    const s = {
      "pompe": `<g transform="rotate(-18 200 200)"><rect x="150" y="70" width="100" height="230" rx="46" fill="url(#${id}gl)" stroke="#9fb4c2" stroke-width="3"/>${tick(166, 110, 9, 20)}<rect x="146" y="282" width="108" height="34" rx="14" fill="url(#${id}c)"/><path d="M200 70 C200 30 270 30 285 60" fill="none" stroke="#5a6b77" stroke-width="7" stroke-linecap="round"/></g><ellipse cx="300" cy="105" rx="34" ry="44" fill="url(#${id}c)"/><rect x="292" y="52" width="16" height="16" rx="4" fill="#3a3541"/><ellipse cx="290" cy="92" rx="9" ry="14" fill="#fff" opacity=".25"/>`,
      "pompe-elec": `<g transform="rotate(-14 200 200)"><rect x="150" y="105" width="100" height="205" rx="46" fill="url(#${id}gl)" stroke="#9fb4c2" stroke-width="3"/>${tick(166, 140, 8, 20)}<rect x="138" y="58" width="124" height="70" rx="30" fill="url(#${id}c)"/><circle cx="200" cy="93" r="15" fill="#fff" opacity=".9"/><circle cx="200" cy="93" r="7" fill="${color}"/><circle cx="235" cy="93" r="4" fill="#25d366"/><rect x="146" y="292" width="108" height="30" rx="13" fill="#2b2733"/></g>`,
      "hydro": `<g transform="rotate(-14 200 200)"><rect x="150" y="70" width="100" height="240" rx="46" fill="url(#${id}gl)" stroke="#9fb4c2" stroke-width="3"/><rect x="153" y="150" width="94" height="156" rx="42" fill="#5bb6e6" opacity=".45"/><path d="M155 165 q22 -12 45 0 t45 0" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>${tick(166, 100, 9, 20)}<rect x="138" y="44" width="124" height="52" rx="18" fill="url(#${id}c)"/><path d="M146 56 h108 M146 68 h108 M146 80 h108" stroke="#fff" stroke-opacity=".3" stroke-width="3"/><rect x="146" y="294" width="108" height="30" rx="13" fill="#2b2733"/></g>`,
      "extenseur": `<g transform="rotate(-10 200 200)"><ellipse cx="200" cy="80" rx="70" ry="22" fill="none" stroke="url(#${id}c)" stroke-width="14"/><ellipse cx="200" cy="300" rx="78" ry="24" fill="none" stroke="url(#${id}c)" stroke-width="16"/><rect x="128" y="88" width="10" height="208" rx="5" fill="#b9c3cb"/><rect x="262" y="88" width="10" height="208" rx="5" fill="#b9c3cb"/><rect x="124" y="170" width="18" height="34" rx="6" fill="#3a3541"/><rect x="258" y="170" width="18" height="34" rx="6" fill="#3a3541"/><circle cx="200" cy="80" r="10" fill="${color}" opacity=".5"/></g>`,
      "manchon": `<g transform="rotate(-20 200 200)"><path d="M168 320 L160 120 Q160 70 200 66 Q240 70 240 120 L232 320 Z" fill="url(#${id}cv)"/>${[130, 165, 200, 235, 270].map(y => `<path d="M${164} ${y} Q200 ${y + 10} ${236} ${y}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="5"/>`).join("")}<ellipse cx="200" cy="320" rx="46" ry="16" fill="${shade(color, -45)}"/><ellipse cx="200" cy="320" rx="26" ry="8" fill="#000" opacity=".35"/><ellipse cx="183" cy="140" rx="8" ry="40" fill="#fff" opacity=".18"/></g>`,
      "anneaux": `<circle cx="150" cy="215" r="70" fill="none" stroke="url(#${id}c)" stroke-width="22"/><circle cx="245" cy="170" r="58" fill="none" stroke="#2b2733" stroke-width="20"/><circle cx="255" cy="270" r="45" fill="none" stroke="${shade(color, 30)}" stroke-width="16"/><path d="M110 170 a60 60 0 0 1 40 -22" stroke="#fff" stroke-opacity=".5" stroke-width="6" fill="none" stroke-linecap="round"/>`,
      "anneau-vib": `<circle cx="190" cy="215" r="80" fill="none" stroke="url(#${id}c)" stroke-width="26"/><rect x="160" y="96" width="60" height="70" rx="28" fill="url(#${id}cv)"/><circle cx="190" cy="122" r="7" fill="#fff" opacity=".85"/><path d="M240 110 q12 12 0 24 M256 98 q22 24 0 48" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/><path d="M130 190 a70 70 0 0 1 30 -40" stroke="#fff" stroke-opacity=".45" stroke-width="7" fill="none" stroke-linecap="round"/>`,
      "gel": `<rect x="140" y="100" width="120" height="225" rx="30" fill="url(#${id}cv)"/><rect x="168" y="60" width="64" height="48" rx="10" fill="#2b2733"/><rect x="152" y="160" width="96" height="100" rx="10" fill="#fff" opacity=".92"/><text x="200" y="198" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="20" fill="${color}">GEL</text><text x="200" y="222" text-anchor="middle" font-family="Arial" font-size="12" fill="#6f6878">base d'eau</text><text x="200" y="244" text-anchor="middle" font-family="Arial" font-weight="700" font-size="13" fill="#17141c">100 ml</text><rect x="150" y="110" width="12" height="200" rx="6" fill="#fff" opacity=".2"/>`,
      "spray": `<rect x="160" y="125" width="80" height="200" rx="22" fill="url(#${id}cv)"/><rect x="176" y="92" width="48" height="40" rx="8" fill="#c9cfd4"/><rect x="186" y="66" width="28" height="30" rx="6" fill="#2b2733"/><rect x="214" y="74" width="16" height="8" rx="3" fill="#2b2733"/><rect x="168" y="180" width="64" height="86" rx="8" fill="#fff" opacity=".92"/><text x="200" y="215" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="15" fill="${color}">SPRAY</text><text x="200" y="236" text-anchor="middle" font-family="Arial" font-size="11" fill="#6f6878">endurance</text><text x="200" y="254" text-anchor="middle" font-family="Arial" font-weight="700" font-size="11" fill="#17141c">15 ml</text><rect x="168" y="135" width="9" height="180" rx="4" fill="#fff" opacity=".2"/>`,
      "huile": `<path d="M150 170 Q150 140 180 130 L180 95 L220 95 L220 130 Q250 140 250 170 L250 300 Q250 325 225 325 L175 325 Q150 325 150 300 Z" fill="url(#${id}cv)"/><rect x="176" y="62" width="48" height="38" rx="8" fill="#2b2733"/><rect x="162" y="200" width="76" height="80" rx="8" fill="#fff" opacity=".9"/><text x="200" y="234" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="15" fill="#7a5c14">HUILE</text><text x="200" y="256" text-anchor="middle" font-family="Arial" font-size="11" fill="#6f6878">de massage</text><rect x="160" y="170" width="9" height="130" rx="4" fill="#fff" opacity=".25"/>`,
      "nettoyant": `<rect x="150" y="120" width="100" height="205" rx="24" fill="url(#${id}cv)"/><path d="M175 120 L175 92 L230 92 L250 78 L250 100 L225 100 L225 120 Z" fill="#e7ecef"/><rect x="160" y="175" width="80" height="96" rx="8" fill="#fff" opacity=".92"/><text x="200" y="212" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="14" fill="${color}">CLEAN</text><text x="200" y="232" text-anchor="middle" font-family="Arial" font-size="11" fill="#6f6878">antibactérien</text><text x="200" y="254" text-anchor="middle" font-family="Arial" font-weight="700" font-size="11" fill="#17141c">150 ml</text>`,
      "coffret": `<rect x="90" y="160" width="220" height="160" rx="12" fill="url(#${id}cv)"/><rect x="80" y="130" width="240" height="48" rx="10" fill="url(#${id}c)"/><rect x="185" y="130" width="30" height="190" fill="#c9a24a"/><path d="M200 130 C160 80 120 100 150 128 Z M200 130 C240 80 280 100 250 128 Z" fill="#c9a24a"/><circle cx="200" cy="128" r="12" fill="#b08a37"/><text x="200" y="262" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-weight="700" font-size="20" fill="#fff" opacity=".9">V</text>`
    };
    return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">${bg}${s[type] || s["coffret"]}</svg>`;
  }
  function shade(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = v => Math.max(0, Math.min(255, Math.round(v + (pct / 100) * (pct > 0 ? 255 - v : v))));
    return "#" + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, "0")).join("");
  }
  const media = p => p.image ? `<img src="${esc(p.image)}" alt="${esc(p.nom)}" loading="lazy">` : visual(p.visuel, p.couleur);

  /* ---------- Panier ---------- */
  const Cart = {
    items() { return store.get("vsn_cart", []).filter(i => byId(i.id)); },
    save(items) { store.set("vsn_cart", items); updateCount(); renderMini(); },
    add(id, q = 1) { const it = this.items(); const f = it.find(i => i.id === id); f ? f.q += q : it.push({ id, q }); this.save(it); },
    set(id, q) { let it = this.items(); if (q <= 0) it = it.filter(i => i.id !== id); else { const f = it.find(i => i.id === id); if (f) f.q = Math.min(q, 99); } this.save(it); },
    remove(id) { this.save(this.items().filter(i => i.id !== id)); },
    clear() { this.save([]); },
    count() { return this.items().reduce((a, i) => a + i.q, 0); },
    subtotal() { return this.items().reduce((a, i) => a + byId(i.id).prix * i.q, 0); }
  };
  function updateCount() { $$(".cart-count").forEach(el => { const n = Cart.count(); el.textContent = n; el.dataset.n = n; }); }

  /* ---------- Toast ---------- */
  let tt;
  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.innerHTML = I.checkCircle + "<span>" + msg + "</span>";
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------- En-tête / pied ---------- */
  function renderHeader() {
    const el = $("#site-header"); if (!el) return;
    const navLinks = [
      `<li><a href="index.html" class="${page === "home" ? "active" : ""}">Accueil</a></li>`,
      `<li><a href="boutique.html" class="${page === "shop" && !new URLSearchParams(location.search).get("cat") ? "active" : ""}">Toute la boutique</a></li>`,
      ...CATS.map(c => `<li><a href="boutique.html?cat=${c.id}" class="${new URLSearchParams(location.search).get("cat") === c.id ? "active" : ""}">${c.nom}</a></li>`),
      `<li><a href="boutique.html?promo=1" class="promo">Promos</a></li>`,
      `<li><a href="suivi.html" class="${page === "track" ? "active" : ""}">Suivre ma commande</a></li>`
    ].join("");
    el.innerHTML = `
      <div class="topbar"><div class="container">
        <span>${I.box} Colis 100 % discret, sans mention du contenu</span>
        <span>${I.truck} Livraison 24h à Dakar · partout au Sénégal</span>
        <span>${I.lock} Wave · Orange Money · Visa · à la livraison</span>
      </div></div>
      <header class="header">
        <div class="container">
          <div class="header-main">
            <button class="icon-btn burger" data-open="menu" aria-label="Menu">${I.menu}</button>
            ${logoHTML()}
            <form class="search" action="boutique.html" role="search">
              <input type="search" name="q" placeholder="Rechercher une pompe, un anneau, un gel…" aria-label="Rechercher">
              <button type="submit" aria-label="Rechercher">${I.search}</button>
            </form>
            <div class="header-actions">
              <a class="icon-btn hide-mobile" href="suivi.html">${I.truck}<span>Suivi</span></a>
              <a class="icon-btn" href="${waLink("Bonjour Virile-SN, j'aimerais avoir des informations.")}" target="_blank" rel="noopener">${I.chat}<span>Conseil</span></a>
              <button class="icon-btn" data-open="cart" aria-label="Panier">${I.cart}<span>Panier</span><b class="cart-count" data-n="0">0</b></button>
            </div>
          </div>
          <form class="search mobile" action="boutique.html" role="search">
            <input type="search" name="q" placeholder="Rechercher un produit…" aria-label="Rechercher">
            <button type="submit" aria-label="Rechercher">${I.search}</button>
          </form>
        </div>
        <nav class="nav hide-mobile"><div class="container"><ul>${navLinks}</ul></div></nav>
      </header>
      <div class="overlay" data-close></div>
      <aside class="drawer left" id="drawer-menu" aria-label="Menu">
        <div class="drawer-head">${logoHTML()}<button class="close-btn" data-close aria-label="Fermer">${I.close}</button></div>
        <div class="drawer-body"><ul class="menu-list">
          <li><a href="index.html">Accueil ${I.chevron}</a></li>
          <li><a href="boutique.html">Toute la boutique ${I.chevron}</a></li>
          ${CATS.map(c => `<li><a href="boutique.html?cat=${c.id}">${c.nom} ${I.chevron}</a></li>`).join("")}
          <li><a href="boutique.html?promo=1" style="color:var(--brand)">Promos ${I.chevron}</a></li>
          <li><a href="suivi.html">Suivre ma commande ${I.chevron}</a></li>
        </ul></div>
        <div class="drawer-foot"><a class="btn btn-wa btn-block" href="${waLink("Bonjour Virile-SN, j'aimerais un conseil.")}" target="_blank" rel="noopener">${I.wa} Conseil privé WhatsApp</a></div>
      </aside>
      <aside class="drawer right" id="drawer-cart" aria-label="Panier">
        <div class="drawer-head"><h3>Mon panier</h3><button class="close-btn" data-close aria-label="Fermer">${I.close}</button></div>
        <div class="drawer-body" id="mini-cart"></div>
        <div class="drawer-foot" id="mini-foot"></div>
      </aside>`;
  }

  function renderFooter() {
    const el = $("#site-footer"); if (!el) return;
    el.innerHTML = `
      <footer class="footer"><div class="container">
        <div class="footer-grid">
          <div>
            ${logoHTML()}
            <p>Virile-SN accompagne les hommes et les couples au Sénégal avec des produits de bien-être intime de qualité, livrés en toute discrétion.</p>
            <a class="btn btn-wa btn-sm" href="${waLink("Bonjour Virile-SN !")}" target="_blank" rel="noopener">${I.wa} ${esc(C.telephoneAffiche)}</a>
          </div>
          <div><h4>Boutique</h4><ul>${CATS.map(c => `<li><a href="boutique.html?cat=${c.id}">${c.nom}</a></li>`).join("")}</ul></div>
          <div><h4>Aide</h4><ul>
            <li><a href="suivi.html">Suivre ma commande</a></li>
            <li><a href="index.html#faq">Questions fréquentes</a></li>
            <li><a href="index.html#livraison">Livraison & discrétion</a></li>
            <li><a href="${waLink("Bonjour, j'ai une question.")}" target="_blank" rel="noopener">Nous contacter</a></li>
          </ul></div>
          <div><h4>Paiement sécurisé</h4>
            <div class="paylogos">${payLogos()}</div>
            <p class="disclaimer">Site réservé aux personnes majeures (18+). Ces produits ne sont pas des médicaments et ne remplacent pas un avis médical : en cas de trouble de l'érection, consultez un médecin.</p>
          </div>
        </div>
        <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${esc(C.nom)} — ${esc(C.ville)}</span><span>Emballage neutre · Données confidentielles</span></div>
      </div></footer>
      <a class="wa-float" href="${waLink("Bonjour Virile-SN, j'aimerais avoir plus d'informations.")}" target="_blank" rel="noopener" aria-label="Discuter sur WhatsApp">${I.wa}</a>`;
  }
  function payLogos() {
    return `<span class="pay-logo pl-wave"><i class="dot">≈</i>Wave</span>
            <span class="pay-logo pl-om"><i class="dot">OM</i>Orange Money</span>
            <span class="pay-logo pl-visa"><i class="dot">${I.card.replace('<svg', '<svg width="13" height="13"')}</i>VISA</span>
            <span class="pay-logo pl-cash"><i class="dot">₣</i>À la livraison</span>`;
  }

  /* ---------- Mini panier ---------- */
  function renderMini() {
    const body = $("#mini-cart"), foot = $("#mini-foot"); if (!body) return;
    const items = Cart.items();
    if (!items.length) {
      body.innerHTML = `<div class="empty">${I.cart}<p>Votre panier est vide.</p><a class="btn btn-dark btn-sm" href="boutique.html">Découvrir la boutique</a></div>`;
      foot.innerHTML = ""; return;
    }
    body.innerHTML = items.map(i => { const p = byId(i.id); return `
      <div class="mini-item">
        <a class="thumb" href="produit.html?id=${p.id}">${media(p)}</a>
        <div><h4>${esc(p.nom)}</h4><div class="price">${fmt(p.prix)}</div>
          <div style="display:flex;gap:10px;align-items:center;margin-top:6px">
            <div class="qty"><button data-q="-1" data-id="${p.id}" aria-label="Moins">−</button><input value="${i.q}" readonly aria-label="Quantité"><button data-q="1" data-id="${p.id}" aria-label="Plus">+</button></div>
            <button class="remove" data-rm="${p.id}">Retirer</button>
          </div>
        </div>
        <b>${fmt(p.prix * i.q)}</b>
      </div>`; }).join("");
    const sub = Cart.subtotal(), seuil = C.livraison.gratuiteDes;
    const pct = seuil ? Math.min(100, sub / seuil * 100) : 0;
    foot.innerHTML = `
      ${seuil ? `<div class="progress-free">${sub >= seuil ? "🎉 Livraison offerte !" : `Plus que <b>${fmt(seuil - sub)}</b> pour la livraison offerte`}<div class="bar"><i style="width:${pct}%"></i></div></div>` : ""}
      <div class="sum-row total"><span>Sous-total</span><span>${fmt(sub)}</span></div>
      <a class="btn btn-primary btn-block" href="panier.html">Commander ${I.arrow}</a>
      <a class="btn btn-wa btn-block" style="margin-top:8px" target="_blank" rel="noopener" href="${waLink(cartMessage())}">${I.wa} Commander sur WhatsApp</a>`;
  }
  function cartMessage() {
    const items = Cart.items();
    return "Bonjour Virile-SN, je souhaite commander :\n" + items.map(i => { const p = byId(i.id); return `• ${i.q} × ${p.nom} (${fmt(p.prix * i.q)})`; }).join("\n") + `\nSous-total : ${fmt(Cart.subtotal())}`;
  }

  /* ---------- Drawers ---------- */
  function openDrawer(name) { $(".overlay")?.classList.add("open"); $("#drawer-" + name)?.classList.add("open"); document.body.style.overflow = "hidden"; }
  function closeDrawers() { $$(".drawer.open,.overlay.open,.filters.open").forEach(e => e.classList.remove("open")); document.body.style.overflow = ""; }

  /* ---------- Carte produit ---------- */
  function productCard(p) {
    const cat = catById(p.cat);
    const badgeCls = /premium|cadeau/i.test(p.badge || "") ? "gold" : /nouveau/i.test(p.badge || "") ? "dark" : "";
    return `<article class="card fade-in">
      <a class="media" href="produit.html?id=${p.id}">${p.badge ? `<span class="badge ${badgeCls}">${esc(p.badge)}</span>` : ""}${media(p)}</a>
      <div class="body">
        <div class="cat">${esc(cat ? cat.nom : "")}</div>
        <h3><a href="produit.html?id=${p.id}">${esc(p.nom)}</a></h3>
        <div class="prices"><span class="price-now">${fmt(p.prix)}</span>${p.ancienPrix ? `<span class="price-old">${fmt(p.ancienPrix)}</span>` : ""}</div>
        <div class="actions">
          <button class="btn btn-dark" data-add="${p.id}" aria-label="Ajouter au panier">${I.cart}<span>Ajouter</span></button>
          <a class="btn btn-wa wa-mini" href="${waLink(`Bonjour, je souhaite plus d'informations sur : ${p.nom} (${fmt(p.prix)})`)}" target="_blank" rel="noopener" aria-label="Infos WhatsApp">${I.wa}</a>
        </div>
      </div>
    </article>`;
  }

  /* ---------- Vérification d'âge ---------- */
  function ageGate() {
    if (store.get("vsn_age_ok", false)) return;
    const g = document.createElement("div");
    g.className = "age-gate";
    g.innerHTML = `<div class="age-box" role="dialog" aria-modal="true" aria-labelledby="age-title">
      ${logoHTML()}
      <div class="big">18+</div>
      <h2 id="age-title">Site réservé aux adultes</h2>
      <p>Ce site présente des produits de bien-être intime. Vous devez être majeur pour y accéder.</p>
      <div class="row"><a class="btn btn-outline" href="https://www.google.com">J'ai moins de 18 ans</a><button class="btn btn-primary" id="age-yes">J'ai 18 ans ou plus</button></div>
    </div>`;
    document.body.appendChild(g);
    document.body.style.overflow = "hidden";
    $("#age-yes", g).onclick = () => { store.set("vsn_age_ok", true); g.remove(); document.body.style.overflow = ""; };
  }

  /* ---------- Commandes ---------- */
  function newOrderRef() {
    const d = new Date(), pad = n => String(n).padStart(2, "0");
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let r = ""; for (let i = 0; i < 4; i++) r += chars[Math.floor(Math.random() * chars.length)];
    return `VS-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${r}`;
  }
  const Orders = {
    all() { return store.get("vsn_orders", {}); },
    get(ref) { return this.all()[ref]; },
    save(o) { const a = this.all(); a[o.ref] = o; store.set("vsn_orders", a); }
  };

  /* ---------- Événements globaux ---------- */
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-open],[data-close],[data-add],[data-q],[data-rm]");
    if (!t) return;
    if (t.dataset.open) { e.preventDefault(); openDrawer(t.dataset.open); }
    else if (t.hasAttribute("data-close")) closeDrawers();
    else if (t.dataset.add) { const q = parseInt(t.dataset.qty || "1", 10); Cart.add(t.dataset.add, q); toast(`<b>${esc(byId(t.dataset.add).nom)}</b> ajouté au panier`); }
    else if (t.dataset.q) { const it = Cart.items().find(i => i.id === t.dataset.id); if (it) Cart.set(t.dataset.id, it.q + parseInt(t.dataset.q, 10)); document.dispatchEvent(new Event("cart:change")); }
    else if (t.dataset.rm) { Cart.remove(t.dataset.rm); document.dispatchEvent(new Event("cart:change")); }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawers(); });

  /* ---------- Init ---------- */
  renderHeader(); renderFooter(); updateCount(); renderMini(); ageGate();

  window.VSN = { C, P, CATS, I, $, $$, fmt, esc, store, byId, catById, waLink, visual, media, Cart, toast, productCard, payLogos, openDrawer, closeDrawers, newOrderRef, Orders, cartMessage, shade };
})();
