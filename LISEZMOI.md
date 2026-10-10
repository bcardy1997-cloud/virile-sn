# Virile-SN — site vitrine statique

Ouvrez `index.html` dans un navigateur pour voir le site (aucune installation nécessaire).

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil (hero, univers, best-sellers, FAQ, suivi) |
| `boutique.html` | Catalogue avec filtres (catégorie, prix, promo, tri, recherche) |
| `produit.html?id=...` | Fiche produit |
| `panier.html` | Panier + formulaire de commande + choix du paiement |
| `suivi.html` | Suivi de commande (étapes façon Jumia + carte du livreur) |
| `js/config.js` | **À modifier** : WhatsApp, frais de livraison, paiements |
| `js/produits.js` | **À modifier** : catégories et produits (prix, textes, photos) |
| `data/commandes.js` | **À modifier** : statut de chaque commande pour le suivi |
| `css/style.css` | Design (couleurs dans `:root` en haut du fichier) |

## Ajouter de vraies photos
Placez vos photos dans `images/` (carrées, ~800×800 px), puis dans `js/produits.js` :
`image: "images/pompe-classic.jpg"`. Sans photo, une illustration est générée automatiquement.

## Déroulement d'une commande
1. Le client remplit le panier, choisit Wave / Orange Money / Carte / À la livraison et valide.
2. Un numéro est créé (ex. `VS-261005-AB12`) et la commande complète s'ouvre dans WhatsApp vers le **+221 78 291 07 06**.
3. Vous confirmez avec le client (paiement reçu, adresse…).
4. Vous ajoutez la commande dans `data/commandes.js` (copiez le bloc `VS-DEMO-0001`) et mettez le site à jour.
   À chaque étape, changez `statut` et ajoutez la date dans `historique`. Pour la carte, mettez la position du livreur (`livreur.lat/lng`, récupérable sur Google Maps par clic droit).
5. Le client suit sa commande sur `suivi.html` avec son numéro + les 4 derniers chiffres de son téléphone.

⚠ `data/commandes.js` est public : n'y mettez ni nom, ni adresse exacte, ni numéro complet.

## Paiements (`js/config.js`)
- **Wave** : par défaut, le client envoie le montant au numéro indiqué. Si vous ouvrez un compte **Wave Business**, collez votre lien marchand dans `lienMarchand` (ex. `https://pay.wave.com/m/M_XXXX/c/sn/?amount={montant}`) : le client est redirigé directement vers le paiement.
- **Orange Money** : renseignez `codeMarchand` pour afficher le code USSD `#144#391*CODE*MONTANT#`.
- **Visa / Mastercard** : nécessite un compte marchand chez une passerelle (PayDunya, PayTech, CinetPay…) et un petit script serveur qui crée la facture. Mettez son adresse dans `urlPaiement` (`{montant}`, `{ref}`, `{tel}` sont remplacés). En attendant, le lien de paiement est envoyé au client sur WhatsApp.
- **À la livraison** : `actif: false` pour le désactiver.

Vérifiez que les numéros Wave/Orange Money dans `config.js` sont bien ceux qui reçoivent l'argent.

## Mise en ligne (gratuit)
- **Netlify** : glissez le dossier `virile-sn` sur https://app.netlify.com/drop, puis reliez votre nom de domaine.
- ou **GitHub Pages**, ou tout hébergement classique (envoyer les fichiers par FTP).

La carte de suivi (OpenStreetMap) et les polices nécessitent une connexion internet.
