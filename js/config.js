/* =========================================================
   VIRILE-SN — FICHIER DE CONFIGURATION
   Modifiez ici : numéro WhatsApp, livraison, paiement.
   ========================================================= */
window.VIRILE_CONFIG = {
  nom: "Virile-SN",
  slogan: "Confiance, plaisir & complicité",

  // Numéro WhatsApp au format international SANS "+" ni espaces
  whatsapp: "221782910706",
  telephoneAffiche: "+221 78 291 07 06",
  email: "contact@virile-sn.com",
  ville: "Dakar, Sénégal",
  devise: "FCFA",

  /* ---------- LIVRAISON ---------- */
  livraison: {
    gratuiteDes: 50000, // livraison offerte à partir de ce montant (0 = jamais)
    zones: [
      { id: "dakar",    nom: "Dakar (Plateau, Médina, Mermoz, Almadies…)", prix: 1500, delai: "24h",    lat: 14.6928, lng: -17.4467 },
      { id: "banlieue", nom: "Banlieue (Pikine, Guédiawaye, Keur Massar, Rufisque…)", prix: 2500, delai: "24–48h", lat: 14.7547, lng: -17.3906 },
      { id: "regions",  nom: "Régions (Thiès, Mbour, Saint-Louis, Kaolack…)", prix: 3500, delai: "48–72h", lat: 14.7910, lng: -16.9359 }
    ]
  },

  // Point de départ des colis (affiché sur la carte de suivi)
  depot: { nom: "Entrepôt Virile-SN", lat: 14.6937, lng: -17.4441 },

  /* ---------- PAIEMENT ----------
     Chaque mode peut être activé/désactivé.
     Tant qu'aucune passerelle n'est branchée, le client reçoit des
     instructions + la commande part sur WhatsApp pour validation.   */
  paiement: {
    wave: {
      actif: true,
      numero: "782910706",          // numéro Wave qui reçoit les paiements (à vérifier)
      // Lien marchand Wave Business (optionnel). {montant} et {ref} sont remplacés.
      // ex : "https://pay.wave.com/m/M_XXXXXXXX/c/sn/?amount={montant}"
      lienMarchand: ""
    },
    orange: {
      actif: true,
      numero: "782910706",          // numéro Orange Money (à vérifier)
      codeMarchand: ""              // si renseigné : affiche le code USSD #144#391*CODE*MONTANT#
    },
    carte: {
      actif: true,
      // Passerelle carte Visa/Mastercard (PayDunya, PayTech, CinetPay…).
      // URL de votre petit serveur qui crée la facture et redirige vers la page de paiement.
      // {montant}, {ref}, {tel} sont remplacés. Laisser vide = lien envoyé sur WhatsApp.
      urlPaiement: ""
    },
    livraison: {
      actif: true                   // paiement en espèces à la livraison
    }
  }
};
