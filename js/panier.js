/* =========================================================
   VIRILE-SN — Panier & commande
   ========================================================= */
(function () {
  const { C, I, $, $$, fmt, esc, media, byId, Cart, waLink, newOrderRef, Orders, store } = VSN;
  const root = $("#root");
  const PAY = C.paiement;
  const MODES = [
    { id: "wave", nom: "Wave", desc: "Paiement mobile instantané", bg: "#1dc8f2", ic: "≈" },
    { id: "orange", nom: "Orange Money", desc: "Paiement mobile", bg: "#ff7900", ic: "OM" },
    { id: "carte", nom: "Carte Visa / Mastercard", desc: "Paiement sécurisé en ligne", bg: "#1a1f71", ic: "VISA" },
    { id: "livraison", nom: "À la livraison", desc: "Espèces à la réception", bg: "#1f8a5b", ic: "₣" }
  ].filter(m => PAY[m.id] && PAY[m.id].actif);

  const saved = store.get("vsn_client", {});
  const st = { zone: saved.zone || C.livraison.zones[0].id, pay: MODES[0] ? MODES[0].id : "" };

  const zoneObj = () => C.livraison.zones.find(z => z.id === st.zone) || C.livraison.zones[0];
  const shipping = sub => (C.livraison.gratuiteDes && sub >= C.livraison.gratuiteDes) ? 0 : zoneObj().prix;
  const fill = (tpl, o) => tpl.replace(/\{montant\}/g, o.total).replace(/\{ref\}/g, encodeURIComponent(o.ref)).replace(/\{tel\}/g, encodeURIComponent(o.tel || ""));

  function payInfo(mode, total) {
    const t = `<b>${fmt(total)}</b>`;
    if (mode === "wave") return PAY.wave.lienMarchand
      ? `Après validation, vous serez redirigé vers la page de paiement <b>Wave</b> sécurisée pour régler ${t}.`
      : `Après validation, envoyez ${t} par <b>Wave</b> au <b>${esc(PAY.wave.numero)}</b>, puis envoyez la capture du paiement sur WhatsApp avec votre numéro de commande.`;
    if (mode === "orange") return PAY.orange.codeMarchand
      ? `Composez <b>#144#391*${esc(PAY.orange.codeMarchand)}*${total}#</b> pour payer ${t} par <b>Orange Money</b>, puis envoyez la confirmation sur WhatsApp.`
      : `Après validation, envoyez ${t} par <b>Orange Money</b> au <b>${esc(PAY.orange.numero)}</b>, puis envoyez la capture sur WhatsApp avec votre numéro de commande.`;
    if (mode === "carte") return PAY.carte.urlPaiement
      ? `Vous serez redirigé vers notre page de paiement sécurisée pour régler ${t} par carte Visa ou Mastercard.`
      : `Un lien de paiement par carte sécurisé (Visa / Mastercard) vous sera envoyé sur WhatsApp pour régler ${t}.`;
    if (mode === "livraison") return `Vous réglez ${t} en espèces au livreur à la réception du colis. Un appel de confirmation vous sera passé avant l'envoi.`;
    return "";
  }

  /* ---------- Rendu du panier ---------- */
  function render() {
    const items = Cart.items();
    if (!items.length) {
      root.innerHTML = `<nav class="breadcrumb"><a href="index.html">Accueil</a> › <span>Panier</span></nav>
        <div class="panel empty" style="padding:60px 20px">${I.cart}<h2 style="color:var(--ink)">Votre panier est vide</h2><p>Découvrez nos pompes à vide, anneaux et coffrets couple.</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="boutique.html">Voir la boutique</a><a class="btn btn-outline" href="suivi.html">Suivre une commande</a></div></div>`;
      return;
    }
    const sub = Cart.subtotal(), ship = shipping(sub), total = sub + ship;
    root.innerHTML = `
      <nav class="breadcrumb"><a href="index.html">Accueil</a> › <span>Panier & commande</span></nav>
      <h1 style="font-size:clamp(1.6rem,3vw,2.2rem);margin-bottom:20px">Finaliser ma commande</h1>
      <form class="checkout" id="checkout" novalidate>
        <div>
          <div class="panel">
            <h3><span class="num">1</span> Mon panier (${Cart.count()} article${Cart.count() > 1 ? "s" : ""})</h3>
            ${items.map(i => { const p = byId(i.id); return `
              <div class="cart-line">
                <a class="thumb" href="produit.html?id=${p.id}">${media(p)}</a>
                <div><h4><a href="produit.html?id=${p.id}">${esc(p.nom)}</a></h4>
                  <div class="muted" style="font-size:.85rem;margin-bottom:8px">${fmt(p.prix)} / unité</div>
                  <div style="display:flex;gap:12px;align-items:center">
                    <div class="qty"><button type="button" data-q="-1" data-id="${p.id}">−</button><input value="${i.q}" readonly aria-label="Quantité"><button type="button" data-q="1" data-id="${p.id}">+</button></div>
                    <button type="button" class="remove" data-rm="${p.id}">Retirer</button>
                  </div></div>
                <div class="lt">${fmt(p.prix * i.q)}</div>
              </div>`; }).join("")}
          </div>

          <div class="panel">
            <h3><span class="num">2</span> Livraison</h3>
            <div class="form-grid">
              <div class="field"><label for="f-nom">Prénom ou pseudo *</label><input id="f-nom" name="nom" autocomplete="given-name" value="${esc(saved.nom || "")}" required><div class="hint">Un pseudo suffit, pour votre discrétion.</div></div>
              <div class="field"><label for="f-tel">Téléphone (WhatsApp) *</label><input id="f-tel" name="tel" type="tel" inputmode="tel" placeholder="77 123 45 67" autocomplete="tel" value="${esc(saved.tel || "")}" required><div class="hint">Le livreur vous appellera sur ce numéro.</div></div>
              <div class="field full"><label>Zone de livraison *</label>
                <div class="zone-opts">${C.livraison.zones.map(z => `
                  <label class="zone-opt"><span class="l"><input type="radio" name="zone" value="${z.id}" ${z.id === st.zone ? "checked" : ""}><span><b>${esc(z.nom)}</b><small>Délai : ${z.delai}</small></span></span><b>${shipping(sub) === 0 ? "Offerte" : fmt(z.prix)}</b></label>`).join("")}
                </div></div>
              <div class="field"><label for="f-quartier">Quartier / Ville *</label><input id="f-quartier" name="quartier" placeholder="ex. Sacré-Cœur 3, Dakar" value="${esc(saved.quartier || "")}" required></div>
              <div class="field"><label for="f-repere">Point de repère</label><input id="f-repere" name="repere" placeholder="ex. près de la pharmacie…" value="${esc(saved.repere || "")}"></div>
              <div class="field full"><label for="f-note">Instructions (facultatif)</label><textarea id="f-note" name="note" rows="2" placeholder="Créneau horaire, appeler avant de venir…"></textarea></div>
            </div>
          </div>

          <div class="panel">
            <h3><span class="num">3</span> Paiement</h3>
            <div class="pay-options">${MODES.map(m => `
              <label class="pay-opt ${m.id === st.pay ? "checked" : ""}"><input type="radio" name="pay" value="${m.id}" ${m.id === st.pay ? "checked" : ""}>
                <span class="pi" style="background:${m.bg}">${m.ic}</span><span><b>${m.nom}</b><small>${m.desc}</small></span></label>`).join("")}
            </div>
            <div class="pay-info show" id="pay-info">${payInfo(st.pay, total)}</div>
          </div>
        </div>

        <aside class="summary">
          <div class="panel">
            <h3>Récapitulatif</h3>
            <div class="sum-row"><span>Sous-total</span><span>${fmt(sub)}</span></div>
            <div class="sum-row"><span>Livraison (${esc(zoneObj().nom.split(" (")[0])})</span><span>${ship ? fmt(ship) : "Offerte"}</span></div>
            ${C.livraison.gratuiteDes && sub < C.livraison.gratuiteDes ? `<div class="progress-free">Plus que <b>${fmt(C.livraison.gratuiteDes - sub)}</b> pour la livraison offerte<div class="bar"><i style="width:${Math.min(100, sub / C.livraison.gratuiteDes * 100)}%"></i></div></div>` : ""}
            <div class="sum-row total"><span>Total</span><span>${fmt(total)}</span></div>
            <label class="check" style="font-size:.8rem;align-items:flex-start"><input type="checkbox" id="f-age" required> <span>Je certifie avoir 18 ans ou plus et accepte les conditions de vente.</span></label>
            <button class="btn btn-primary btn-block" type="submit" id="submit">${I.lock} Valider la commande</button>
            <div class="secure">${I.shield} Données confidentielles · Colis anonyme</div>
          </div>
          <div class="panel" style="font-size:.85rem">
            <div style="display:flex;gap:10px;align-items:flex-start">${I.wa.replace("<svg", '<svg style="width:22px;height:22px;color:#25d366;flex-shrink:0"')}<span>Une question avant de commander ? <a style="color:var(--brand);font-weight:600" target="_blank" rel="noopener" href="${waLink(VSN.cartMessage() + "\n\nJ'ai une question avant de valider.")}">Écrivez-nous sur WhatsApp</a></span></div>
          </div>
        </aside>
      </form>`;

    const form = $("#checkout");
    $$("input[name=zone]", form).forEach(r => r.onchange = () => { st.zone = r.value; keepForm(render); });
    $$("input[name=pay]", form).forEach(r => r.onchange = () => {
      st.pay = r.value;
      $$(".pay-opt", form).forEach(l => l.classList.toggle("checked", l.contains(r)));
      $("#pay-info").innerHTML = payInfo(st.pay, total);
    });
    form.onsubmit = e => { e.preventDefault(); submit(form, { sub, ship, total }); };
  }

  // Conserver la saisie lors d'un re-rendu
  function keepForm(fn) {
    const f = $("#checkout"); const vals = {};
    if (f) ["nom", "tel", "quartier", "repere", "note"].forEach(n => vals[n] = f.elements[n].value);
    const age = $("#f-age") && $("#f-age").checked;
    fn();
    const g = $("#checkout"); if (!g) return;
    Object.keys(vals).forEach(n => g.elements[n].value = vals[n]);
    if (age) $("#f-age").checked = true;
  }
  document.addEventListener("cart:change", () => keepForm(render));

  /* ---------- Validation & envoi ---------- */
  function submit(form, t) {
    const v = n => form.elements[n].value.trim();
    let ok = true;
    $$(".field", form).forEach(f => f.classList.remove("error"));
    const tel = v("tel").replace(/[^\d]/g, "").replace(/^00221|^221/, "");
    const err = (n) => { form.elements[n].closest(".field").classList.add("error"); if (ok) form.elements[n].focus(); ok = false; };
    if (!v("nom")) err("nom");
    if (!/^[37]\d{8}$/.test(tel)) err("tel");
    if (!v("quartier")) err("quartier");
    if (!ok) { VSN.toast("Merci de compléter les champs en rouge."); return; }
    if (!$("#f-age").checked) { VSN.toast("Veuillez confirmer que vous avez 18 ans ou plus."); return; }

    const z = zoneObj();
    const order = {
      ref: newOrderRef(),
      date: new Date().toISOString(),
      nom: v("nom"), tel, tel4: tel.slice(-4),
      zone: z.id, zoneNom: z.nom, quartier: v("quartier"), repere: v("repere"), note: v("note"),
      paiement: st.pay, paye: false,
      articles: Cart.items().map(i => ({ id: i.id, qte: i.q, prix: byId(i.id).prix })),
      sousTotal: t.sub, livraison: t.ship, total: t.total,
      statut: "recue", historique: { recue: new Date().toISOString() }
    };
    Orders.save(order);
    store.set("vsn_client", { nom: order.nom, tel: order.tel, zone: order.zone, quartier: order.quartier, repere: order.repere });

    const mode = MODES.find(m => m.id === order.paiement);
    const trackUrl = location.href.replace(/panier\.html.*$/, "suivi.html?ref=" + order.ref);
    const msg =
`🛒 *NOUVELLE COMMANDE ${order.ref}*

${order.articles.map(a => `• ${a.qte} × ${byId(a.id).nom} — ${fmt(a.prix * a.qte)}`).join("\n")}

Sous-total : ${fmt(order.sousTotal)}
Livraison : ${order.livraison ? fmt(order.livraison) : "Offerte"}
*TOTAL : ${fmt(order.total)}*

👤 ${order.nom}
📞 ${order.tel}
📍 ${order.quartier}${order.repere ? " (" + order.repere + ")" : ""} — ${z.nom.split(" (")[0]}
💳 Paiement : ${mode ? mode.nom : order.paiement}${order.note ? "\n📝 " + order.note : ""}

Suivi : ${trackUrl}`;

    // Lien de paiement en ligne s'il est configuré
    let payUrl = "";
    if (order.paiement === "wave" && PAY.wave.lienMarchand) payUrl = fill(PAY.wave.lienMarchand, order);
    if (order.paiement === "carte" && PAY.carte.urlPaiement) payUrl = fill(PAY.carte.urlPaiement, order);

    const wa = waLink(msg);
    window.open(payUrl || wa, "_blank", "noopener");
    Cart.clear();
    confirmation(order, wa, payUrl, mode);
  }

  function confirmation(o, wa, payUrl, mode) {
    window.scrollTo({ top: 0 });
    root.innerHTML = `
      <div class="confirm fade-in" style="padding:40px 0">
        <div class="ok-ic">${I.check}</div>
        <h1 style="font-size:clamp(1.6rem,3vw,2.3rem)">Merci ${esc(o.nom)}, commande enregistrée !</h1>
        <p class="muted">Conservez votre numéro de commande pour suivre votre colis :</p>
        <div class="order-no" id="ref">${o.ref}</div>
        <div class="panel">
          <h3>${I.info.replace("<svg", '<svg style="width:22px;height:22px;color:var(--brand)"')} Dernière étape</h3>
          <p style="margin-bottom:10px">${payInfo(o.paiement, o.total)}</p>
          <p class="muted" style="font-size:.88rem;margin:0">Votre commande a été préparée dans WhatsApp : <b>appuyez sur « Envoyer »</b> pour que nous la recevions. Si WhatsApp ne s'est pas ouvert, utilisez le bouton ci-dessous.</p>
        </div>
        <div class="actions">
          ${payUrl ? `<a class="btn btn-primary" href="${esc(payUrl)}" target="_blank" rel="noopener">${I.lock} Payer ${fmt(o.total)}</a>` : ""}
          <a class="btn btn-wa" href="${wa}" target="_blank" rel="noopener">${I.wa} Envoyer ma commande sur WhatsApp</a>
          <a class="btn btn-dark" href="suivi.html?ref=${o.ref}">${I.truck} Suivre ma commande</a>
        </div>
      </div>`;
  }

  render();
})();
