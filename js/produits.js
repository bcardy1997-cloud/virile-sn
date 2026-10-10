/* =========================================================
   VIRILE-SN — CATALOGUE
   Pour ajouter un produit : copiez un bloc { ... } et modifiez-le.
   image : mettez "images/mon-produit.jpg" pour utiliser une vraie photo
           (laissez "" pour l'illustration automatique).
   visuel : pompe | pompe-elec | hydro | extenseur | manchon | anneaux |
            anneau-vib | gel | spray | huile | nettoyant | coffret
   ========================================================= */
window.VIRILE_CATEGORIES = [
  { id: "pompes",      nom: "Pompes à vide",          icone: "pompe",     desc: "Les pompes à vide créent une dépression autour du pénis pour favoriser l'afflux sanguin. Manuelles, électriques ou à eau : un entraînement régulier pour plus de fermeté et de confiance." },
  { id: "extenseurs",  nom: "Extenseurs & gaines",    icone: "extenseur", desc: "Extenseurs à traction douce et gaines de prolongation pour gagner en sensations et en assurance, seul ou à deux." },
  { id: "anneaux",     nom: "Anneaux & cockrings",    icone: "anneaux",   desc: "Les anneaux aident à maintenir l'érection plus longtemps. Silicone souple, réglables ou vibrants pour le plaisir partagé." },
  { id: "soins",       nom: "Gels, sprays & soins",   icone: "gel",       desc: "Lubrifiants, sprays et huiles de massage pour un confort optimal et des moments plus intenses." },
  { id: "couple",      nom: "Coffrets couple",        icone: "coffret",   desc: "Des coffrets pensés pour raviver la complicité et l'épanouissement du couple. Idéal à offrir." },
  { id: "accessoires", nom: "Entretien & accessoires", icone: "nettoyant", desc: "Nettoyants, pièces de rechange et accessoires pour garder vos produits en parfait état." }
];

window.VIRILE_PRODUITS = [
  {
    id: "pompe-classic", nom: "Pompe à vide manuelle Classic", cat: "pompes",
    prix: 15000, ancienPrix: 19000, badge: "Best-seller", populaire: true,
    visuel: "pompe", couleur: "#b3122e", image: "",
    court: "Cylindre transparent gradué, poire de pompage et valve de sécurité. Le modèle idéal pour débuter.",
    points: ["Cylindre gradué 20 cm × Ø 6 cm", "Poire manuelle avec valve de décompression rapide", "Manchon d'entrée en silicone confortable", "Livré avec 1 anneau de maintien"],
    utilisation: ["Appliquez un peu de lubrifiant à base d'eau sur la base.", "Placez le cylindre et pompez doucement, sans forcer.", "Séances de 10 à 15 min maximum, relâchez la pression à la moindre gêne."],
    contenu: ["1 cylindre", "1 poire + tuyau", "1 manchon silicone", "1 anneau"]
  },
  {
    id: "pompe-electrique-pro", nom: "Pompe électrique automatique Pro", cat: "pompes",
    prix: 35000, ancienPrix: 42000, badge: "-17%", populaire: true,
    visuel: "pompe-elec", couleur: "#1f2a44", image: "",
    court: "Pompe rechargeable USB avec 3 niveaux d'aspiration et arrêt automatique. Mains libres, simple et précise.",
    points: ["3 intensités d'aspiration + mode massage", "Batterie rechargeable USB (≈ 60 min)", "Bouton de relâchement instantané", "Silencieuse et discrète"],
    utilisation: ["Chargez complètement avant la première utilisation.", "Commencez au niveau 1 pendant les premières séances.", "Ne dépassez pas 15 minutes par séance."],
    contenu: ["1 cylindre électrique", "1 câble USB", "2 manchons (S/M)", "1 pochette discrète"]
  },
  {
    id: "hydropompe-aqua", nom: "Hydropompe Aqua (pompe à eau)", cat: "pompes",
    prix: 45000, badge: "Premium", populaire: true,
    visuel: "hydro", couleur: "#0e5a8a", image: "",
    court: "Utilisée sous la douche ou dans le bain, l'eau répartit la pression de façon homogène pour un confort supérieur.",
    points: ["Technologie à eau : pression plus douce et uniforme", "Utilisation sous la douche", "Soufflet de pompage ergonomique", "Matériaux sans phtalates"],
    utilisation: ["Remplissez le cylindre d'eau tiède.", "Positionnez-vous et pressez le soufflet progressivement.", "Relâchez la valve pour retirer la pompe."],
    contenu: ["1 hydropompe", "1 sangle de transport", "1 manchon confort"]
  },
  {
    id: "kit-pompe-anneaux", nom: "Kit pompe + 3 anneaux", cat: "pompes",
    prix: 22000, ancienPrix: 26000, badge: "Pack", populaire: true,
    visuel: "pompe", couleur: "#7a0c1f", image: "",
    court: "La pompe manuelle accompagnée de 3 anneaux de tailles différentes pour prolonger l'effet après la séance.",
    points: ["Pompe manuelle avec manomètre", "3 anneaux silicone (Ø 3,5 / 4 / 4,5 cm)", "Gel lubrifiant 50 ml offert"],
    utilisation: ["Utilisez la pompe, puis glissez l'anneau à la base.", "Ne gardez pas l'anneau plus de 20 minutes."],
    contenu: ["1 pompe avec manomètre", "3 anneaux", "1 gel 50 ml"]
  },
  {
    id: "extenseur-comfort", nom: "Extenseur à traction Comfort", cat: "extenseurs",
    prix: 28000, populaire: true,
    visuel: "extenseur", couleur: "#3b2a5c", image: "",
    court: "Extenseur à traction douce et réglable, avec sangle confort. Un programme progressif, à suivre dans la durée.",
    points: ["Tiges réglables en longueur", "Sangle silicone confort", "Port discret sous les vêtements", "Guide d'utilisation progressif inclus"],
    utilisation: ["Commencez par 1 h par jour avec une tension minimale.", "Augmentez très progressivement.", "Retirez immédiatement en cas d'engourdissement ou de douleur."],
    contenu: ["1 extenseur", "Tiges d'extension", "2 sangles", "1 étui"]
  },
  {
    id: "gaine-extension", nom: "Gaine de prolongation réaliste", cat: "extenseurs",
    prix: 12000, badge: "Nouveau",
    visuel: "manchon", couleur: "#9c5b3c", image: "",
    court: "Gaine souple qui ajoute longueur et épaisseur, texture stimulante pour le plaisir de votre partenaire.",
    points: ["+5 cm de longueur, +1 cm de diamètre", "Matière douce au toucher", "Anneau de maintien intégré"],
    utilisation: ["Utilisez avec un lubrifiant à base d'eau.", "Nettoyez avant et après chaque usage."],
    contenu: ["1 gaine", "1 sachet de lubrifiant"]
  },
  {
    id: "anneaux-silicone-x3", nom: "Set de 3 anneaux silicone", cat: "anneaux",
    prix: 6000, populaire: true,
    visuel: "anneaux", couleur: "#b3122e", image: "",
    court: "Trois anneaux souples et extensibles pour une érection plus ferme et plus durable.",
    points: ["3 diamètres pour trouver le bon ajustement", "Silicone médical hypoallergénique", "Lavables et réutilisables"],
    utilisation: ["Placez l'anneau à la base en début d'érection.", "Durée maximale : 20 minutes."],
    contenu: ["3 anneaux"]
  },
  {
    id: "anneau-vibrant-duo", nom: "Anneau vibrant Duo", cat: "anneaux",
    prix: 10000, ancienPrix: 12500, badge: "Couple",
    visuel: "anneau-vib", couleur: "#6d1a7e", image: "",
    court: "Anneau avec mini-vibreur pour le plaisir des deux partenaires. Rechargeable et étanche.",
    points: ["10 modes de vibration", "Rechargeable USB", "Étanche"],
    utilisation: ["Chargez avant utilisation.", "Positionnez le vibreur vers le haut pour stimuler votre partenaire."],
    contenu: ["1 anneau vibrant", "1 câble USB"]
  },
  {
    id: "gel-lubrifiant-100", nom: "Gel lubrifiant à base d'eau 100 ml", cat: "soins",
    prix: 5000, populaire: false,
    visuel: "gel", couleur: "#2b7a78", image: "",
    court: "Lubrifiant longue durée, non gras, compatible avec les préservatifs et tous les accessoires.",
    points: ["Base aqueuse, sans parfum", "Compatible préservatifs et silicone", "Ne tache pas"],
    utilisation: ["Appliquez la quantité souhaitée.", "Se rince facilement à l'eau."],
    contenu: ["1 flacon 100 ml"]
  },
  {
    id: "spray-endurance", nom: "Spray endurance homme", cat: "soins",
    prix: 8000, badge: "Populaire", populaire: true,
    visuel: "spray", couleur: "#1f2a44", image: "",
    court: "Spray à effet rafraîchissant qui aide à mieux contrôler l'excitation pour prolonger le rapport.",
    points: ["Action en 10 minutes", "Format de poche discret", "Environ 60 pulvérisations"],
    utilisation: ["1 à 3 pulvérisations 10 min avant le rapport.", "Faites un test sur une petite zone avant la première utilisation."],
    contenu: ["1 spray 15 ml"]
  },
  {
    id: "huile-massage", nom: "Huile de massage sensuelle", cat: "soins",
    prix: 6500,
    visuel: "huile", couleur: "#c9a24a", image: "",
    court: "Huile chauffante au parfum boisé pour des massages complices et relaxants.",
    points: ["Effet chauffant léger", "Parfum boisé & épicé", "Ne colle pas"],
    utilisation: ["Chauffez quelques gouttes entre vos mains.", "Usage externe uniquement."],
    contenu: ["1 flacon 100 ml"]
  },
  {
    id: "coffret-complicite", nom: "Coffret Complicité couple", cat: "couple",
    prix: 30000, ancienPrix: 36000, badge: "Idée cadeau", populaire: true,
    visuel: "coffret", couleur: "#7a0c1f", image: "",
    court: "Un coffret pour raviver la flamme : anneau vibrant, huile de massage, lubrifiant et jeu de cartes coquin.",
    points: ["Anneau vibrant Duo", "Huile de massage 100 ml", "Gel lubrifiant 50 ml", "Jeu de 30 cartes « défis à deux »"],
    utilisation: ["Parfait pour une soirée en amoureux ou à offrir."],
    contenu: ["1 coffret cadeau neutre"]
  },
  {
    id: "coffret-confiance", nom: "Coffret Confiance homme", cat: "couple",
    prix: 40000, ancienPrix: 47000,
    visuel: "coffret", couleur: "#1f2a44", image: "",
    court: "Le pack complet pour reprendre confiance : pompe manuelle, anneaux, spray endurance et lubrifiant.",
    points: ["Pompe à vide Classic", "Set de 3 anneaux", "Spray endurance", "Gel lubrifiant 100 ml"],
    utilisation: ["Suivez le guide inclus pour un programme de 4 semaines."],
    contenu: ["1 coffret discret"]
  },
  {
    id: "nettoyant-jouets", nom: "Nettoyant antibactérien 150 ml", cat: "accessoires",
    prix: 4000,
    visuel: "nettoyant", couleur: "#2b7a78", image: "",
    court: "Mousse nettoyante sans alcool pour entretenir pompes, anneaux et accessoires en toute hygiène.",
    points: ["Sans alcool, n'abîme pas le silicone", "Sans rinçage"],
    utilisation: ["Vaporisez, laissez agir 1 min, essuyez."],
    contenu: ["1 flacon 150 ml"]
  },
  {
    id: "manchons-rechange", nom: "Manchons de rechange pour pompe (x2)", cat: "accessoires",
    prix: 3500,
    visuel: "anneaux", couleur: "#5a5560", image: "",
    court: "Manchons d'entrée en silicone compatibles avec la plupart des pompes Ø 6 cm.",
    points: ["Assurent une meilleure étanchéité", "Taille universelle"],
    utilisation: ["Remplacez dès que le manchon se fend ou perd sa souplesse."],
    contenu: ["2 manchons"]
  }
];
