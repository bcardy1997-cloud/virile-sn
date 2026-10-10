/* =========================================================
   VIRILE-SN — SUIVI DES COMMANDES
   Après chaque commande reçue sur WhatsApp, ajoutez/modifiez
   une entrée ici puis remettez le fichier en ligne.

   ⚠ Ce fichier est PUBLIC : n'y mettez jamais le nom complet,
   l'adresse exacte ni le numéro complet du client.
   Seuls les 4 derniers chiffres du téléphone servent à vérifier.

   statut : recue | confirmee | preparee | expediee | livree | annulee
   historique : date/heure de chaque étape franchie
   livreur.lat / livreur.lng : position actuelle du livreur (carte)
   destination : position approximative du quartier de livraison
   ========================================================= */
window.VIRILE_COMMANDES = {

  "VS-DEMO-0001": {
    tel4: "0000",
    statut: "expediee",
    paiement: "wave",
    paye: true,
    zone: "dakar",
    quartier: "Sacré-Cœur 3",
    articles: [
      { id: "pompe-electrique-pro", qte: 1 },
      { id: "gel-lubrifiant-100", qte: 1 }
    ],
    historique: {
      recue:     "2026-10-03 10:12",
      confirmee: "2026-10-03 10:40",
      preparee:  "2026-10-03 16:05",
      expediee:  "2026-10-04 09:15"
    },
    livreur: { nom: "Moussa", lat: 14.7090, lng: -17.4560 },
    destination: { lat: 14.7215, lng: -17.4660 },
    message: "Votre colis est en route. Le livreur vous appellera 15 min avant d'arriver."
  }

};
