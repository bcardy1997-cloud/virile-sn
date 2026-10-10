/* =========================================================
   VIRILE-SN — Suivi de commande (fiche + carte)
   Les statuts officiels viennent de data/commandes.js
   ========================================================= */
(function () {
  const { C, I, $, fmt, esc, media, byId, waLink, Orders } = VSN;
  const STEPS = [
    { id: "recue",     titre: "Commande passée",          desc: "Nous avons bien reçu votre commande.", ic: I.cart },
    { id: "confirmee", titre: "Confirmée",                desc: "Commande et paiement validés par notre équipe.", ic: I.checkCircle },
    { id: "preparee",  titre: "En préparation",           desc: "Votre colis est emballé dans un paquet neutre.", ic: I.box },
    { id: "expediee",  titre: "En cours de livraison",    desc: "Le livreur est en route vers vous.", ic: I.truck },
    { id: "livree",    titre: "Livrée",                   desc: "Colis remis. Merci pour votre confiance !", ic: I.heart }
  ];
  const PAYNAMES = { wave: "Wave", orange: "Orange Money", carte: "Carte bancaire", livraison: "À la livraison" };
  let map;

  // Charge data/commandes.js sans cache pour avoir les derniers statuts
  function loadOfficial() {
    return new Promise(res => {
      const s = document.createElement("script");
      s.src = "data/commandes.js?v=" + Date.now();
      s.onload = () => res(window.VIRILE_COMMANDES || {});
      s.onerror = () => res({});
      document.head.appendChild(s);
    });
  }

  const fmtDate = d => {
    if (!d) return "";
    const x = new Date(String(d).replace(" ", "T"));
    if (isNaN(x)) return esc(d);
    return x.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" }) + " à " + x.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  async function track(ref, tel4) {
    ref = ref.trim().toUpperCase();
    tel4 = (tel4 || "").replace(/\D/g, "").slice(-4);
    const out = $("#result");
    const official = (await loadOfficial())[ref];
    const local = Orders.get(ref);

    if (!official && !local) return out.innerHTML = notFound(ref, "Aucune commande ne correspond à ce numéro. Vérifiez la saisie ou contactez-nous.");
    if (official && !local && official.tel4 && official.tel4 !== tel4)
      return out.innerHTML = notFound(ref, "Pour protéger votre confidentialité, saisissez les 4 derniers chiffres du téléphone utilisé lors de la commande.");

    // Fusion : les données officielles (mises à jour par la boutique) priment
    const o = Object.assign({}, local || {}, official || {});
    o.ref = ref;
    o.historique = Object.assign({}, (local || {}).historique, (official || {}).historique);
    if (!o.articles) o.articles = [];
    const zone = C.livraison.zones.find(z => z.id === o.zone) || C.livraison.zones[0];
    const total = o.total || o.articles.reduce((a, x) => a + (x.prix || (byId(x.id) || {}).prix || 0) * x.qte, 0);
    const cancelled = o.statut === "annulee";
    const idx = Math.max(0, STEPS.findIndex(s => s.id === o.statut));
    const pill = cancelled ? ["ko", "Annulée"] : o.statut === "livree" ? ["ok", "Livrée"] : o.statut === "expediee" ? ["go", "En livraison"] : ["", STEPS[idx].titre];
    const pending = !official;

    out.innerHTML = `
      <div class="track-card fade-in">
        <div class="track-top">
          <div><div class="muted" style="font-size:.8rem">Commande</div><div class="ref">${esc(ref)}</div>
            ${o.date ? `<div class="muted" style="font-size:.82rem">Passée le ${fmtDate(o.date)}</div>` : ""}</div>
          <div style="text-align:right"><span class="status-pill ${pill[0]}">${pill[1]}</span>
            <div style="margin-top:8px;font-weight:800;font-size:1.15rem">${total ? fmt(total) : ""}</div></div>
        </div>
        ${cancelled ? "" : `<div class="progress-h" style="padding-top:18px">${STEPS.map((s, i) => `<i class="${i <= idx ? "on" : ""}"></i>`).join("")}</div>`}
        <div class="track-body">
          <div>
            <h3 style="font-size:1rem;margin-bottom:18px">Étapes de livraison</h3>
            ${cancelled ? `<div class="msg-box">Cette commande a été annulée. Contactez-nous sur WhatsApp pour plus d'informations.</div>` : `
            <ol class="timeline">${STEPS.map((s, i) => {
              const cls = i < idx || (i === idx && o.statut === "livree") ? "done" : i === idx ? "current" : "todo";
              const when = o.historique[s.id];
              return `<li class="${cls}"><span class="dot">${s.ic}</span><b>${s.titre}</b><span>${when ? fmtDate(when) + " · " : ""}${i <= idx ? s.desc : "En attente"}</span></li>`;
            }).join("")}</ol>`}
            ${pending ? `<div class="msg-box">${I.clock.replace("<svg", '<svg style="width:16px;height:16px;display:inline;vertical-align:-3px;margin-right:4px"')} En attente de confirmation. Pensez à <b>envoyer votre commande sur WhatsApp</b> et à effectuer le paiement si nécessaire.</div>` : ""}
            ${o.message ? `<div class="msg-box">${esc(o.message)}</div>` : ""}
          </div>
          <div>
            <h3 style="font-size:1rem;margin-bottom:14px">Suivi sur la carte</h3>
            <div id="map"></div>
            <div class="map-legend"><span><i style="background:#120f17"></i>Entrepôt</span><span><i style="background:#b3122e"></i>Livreur</span><span><i style="background:#1f8a5b"></i>Destination</span></div>
            <dl class="kv" style="margin-top:18px">
              <dt>Livraison</dt><dd>${esc(o.quartier || "")}${o.quartier ? " — " : ""}${esc(zone.nom.split(" (")[0])}</dd>
              <dt>Délai estimé</dt><dd>${esc(zone.delai)}</dd>
              <dt>Paiement</dt><dd>${esc(PAYNAMES[o.paiement] || o.paiement || "—")} · ${o.paye ? '<span style="color:var(--ok)">Payé</span>' : o.paiement === "livraison" ? "À régler à la livraison" : '<span style="color:var(--brand)">En attente</span>'}</dd>
              ${o.livreur && o.statut === "expediee" ? `<dt>Livreur</dt><dd>${esc(o.livreur.nom || "")}</dd>` : ""}
            </dl>
          </div>
        </div>
        ${o.articles.length ? `<div class="track-items"><h3 style="font-size:1rem">Articles</h3>${o.articles.map(a => { const p = byId(a.id); if (!p) return ""; return `<div class="row"><a class="thumb" href="produit.html?id=${p.id}">${media(p)}</a><span class="n">${a.qte} × ${esc(p.nom)}</span><b>${fmt((a.prix || p.prix) * a.qte)}</b></div>`; }).join("")}</div>` : ""}
        <div class="track-items" style="display:flex;gap:10px;flex-wrap:wrap">
          <a class="btn btn-wa" target="_blank" rel="noopener" href="${waLink(`Bonjour, je souhaite des nouvelles de ma commande ${ref}.`)}">${I.wa} Une question sur ma commande</a>
          <button class="btn btn-outline" id="refresh">Actualiser</button>
        </div>
      </div>`;

    $("#refresh").onclick = () => track(ref, tel4);
    drawMap(o, zone);
  }

  function pinIcon(color, svg) {
    return L.divIcon({ className: "", html: `<div class="marker-pin" style="background:${color}">${svg}</div>`, iconSize: [34, 34], iconAnchor: [17, 34] });
  }

  function drawMap(o, zone) {
    if (!window.L) { $("#map").innerHTML = '<div class="empty">Carte indisponible (connexion internet requise).</div>'; return; }
    if (map) { map.remove(); map = null; }
    const depot = [C.depot.lat, C.depot.lng];
    const dest = o.destination ? [o.destination.lat, o.destination.lng] : [zone.lat, zone.lng];
    map = L.map("map", { scrollWheelZoom: false, attributionControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(map);
    const pts = [depot];
    L.marker(depot, { icon: pinIcon("#120f17", I.box) }).addTo(map).bindPopup(esc(C.depot.nom));
    if (o.statut === "expediee" && o.livreur && o.livreur.lat) {
      const lv = [o.livreur.lat, o.livreur.lng];
      L.marker(lv, { icon: pinIcon("#b3122e", I.truck), zIndexOffset: 500 }).addTo(map).bindPopup("Livreur" + (o.livreur.nom ? " : " + esc(o.livreur.nom) : "")).openPopup();
      L.polyline([depot, lv], { color: "#1f8a5b", weight: 4 }).addTo(map);
      L.polyline([lv, dest], { color: "#b3122e", weight: 4, dashArray: "8 8" }).addTo(map);
      pts.push(lv);
    } else {
      L.polyline([depot, dest], { color: o.statut === "livree" ? "#1f8a5b" : "#9a92a3", weight: 4, dashArray: o.statut === "livree" ? null : "8 8" }).addTo(map);
    }
    L.marker(dest, { icon: pinIcon("#1f8a5b", o.statut === "livree" ? I.check : I.pin) }).addTo(map).bindPopup("Destination" + (o.quartier ? " : " + esc(o.quartier) : ""));
    pts.push(dest);
    map.fitBounds(pts, { padding: [40, 40], maxZoom: 14 });
  }

  function notFound(ref, msg) {
    return `<div class="track-card fade-in"><div class="empty">${I.search}<h3 style="color:var(--ink)">Commande ${esc(ref)}</h3><p>${msg}</p>
      <a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink("Bonjour, je n'arrive pas à suivre ma commande " + ref + ".")}">${I.wa} Contacter le service client</a></div></div>`;
  }

  $("#track-form").onsubmit = e => {
    e.preventDefault();
    const ref = $("#t-ref").value, tel = $("#t-tel").value;
    history.replaceState(null, "", "suivi.html?ref=" + encodeURIComponent(ref.trim().toUpperCase()));
    track(ref, tel);
  };

  const q = new URLSearchParams(location.search).get("ref");
  if (q) { $("#t-ref").value = q.toUpperCase(); track(q, ""); }
})();
