# Snake+

Un jeu Snake moderne, en plein écran, avec boutique, serpents à capacités, terrains variés, un mode Carrière en arbre avec boss, et des serpents premium à obtenir via un gacha.

Jeu 100% autonome : HTML/CSS/JS vanilla, aucune dépendance à installer, aucun build. Fonctionne directement en ouvrant `index.html` dans un navigateur, ou hébergé tel quel sur GitHub Pages.

## Jouer

Ouvrez simplement `index.html` dans un navigateur (Chrome, Firefox, Safari, Edge).

Pour l'héberger en ligne avec **GitHub Pages** :
1. Poussez ce dépôt sur GitHub.
2. Allez dans *Settings → Pages*.
3. Choisissez la branche `main` (ou `master`) et le dossier racine `/`.
4. Votre jeu sera accessible à `https://<votre-utilisateur>.github.io/<nom-du-repo>/`.

## Contrôles

- **Clavier** : flèches directionnelles (ou WASD en secours) pour se déplacer, `1`/`2`/`3` pour les objets équipés, `Espace` pour la compétence d'un serpent premium, `Échap`/`P` pour mettre en pause.
- Toutes les touches (sauf WASD) sont réassignables dans **Réglages** (icône ⚙️ sur l'accueil).
- **Tactile** : pavé directionnel à l'écran, ou glissement (swipe) sur le plateau de jeu.
- **Souris (menu Carrière)** : molette pour défiler l'arbre, ou cliquer-glisser directement.

## Fonctionnalités

- **Mode Libre** : partie classique sans fin, avec montée en difficulté, ennemis qui apparaissent progressivement, et un système de combo.
- **Mode Carrière** : 36 niveaux répartis en 6 chapitres sous forme d'un arbre horizontal scrollable, avec des embranchements (deux chemins alternatifs au choix) et un boss à la fin de chaque chapitre. Étoiles (1 à 3) selon la performance.
- **8 serpents** à débloquer avec des pièces, chacun avec une capacité passive et un design distinct.
- **5 serpents premium** obtenables uniquement via un gacha (monnaie : cristaux 💎), avec une compétence active rechargeable, une animation dédiée et un son propre :
  - **Ouroboros** — coupe sa propre queue pour s'échapper (2 charges fixes, ne se recharge pas)
  - **Tempête** — dash fulgurant à travers tout (2 charges, recharge rapide)
  - **Nova** — élimine tous les ennemis et les obstacles proches
  - **Léviathan** — balaie tous les obstacles du terrain
  - **Chronos** — suspend le temps et rembobine 5 secondes en arrière
- **5 terrains** avec un multiplicateur de pièces croissant selon la difficulté.
- **Boutique** avec quatre rayons : Serpents, Terrains, Objets (consommables), Gacha.
- **Système de rang** (Bronze → Argent → Or → Platine → Diamant → Maître) basé sur un niveau de joueur et de l'XP ; cliquez sur votre rang pour voir tous les paliers.
- Progression sauvegardée localement dans le navigateur (`localStorage`).

## Structure du projet

```
snake-plus/
├── index.html   Structure de la page et des menus
├── style.css    Tout le style visuel
├── script.js    Toute la logique du jeu
└── README.md    Ce fichier
```

## Notes techniques

- Aucune dépendance externe autre que les polices Google Fonts (Sora, Inter).
- Le rendu du jeu se fait sur un `<canvas>` en 2D, avec une grille qui s'adapte dynamiquement à la taille de l'écran.
- Les sons sont générés en direct avec la Web Audio API (aucun fichier audio à charger).
- Aucune donnée n'est envoyée à un serveur : tout est local à l'appareil de la personne qui joue.
