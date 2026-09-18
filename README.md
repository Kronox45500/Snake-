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

- **4 modes de jeu** :
  - **Libre** — partie classique sans fin, difficulté croissante, ennemis progressifs, combos.
  - **Chrono** — 60 secondes pour marquer le plus de points possible.
  - **Zen** — aucune mort possible, juste pour se détendre.
  - **Carrière** — 36 niveaux en 6 chapitres, arbre horizontal scrollable avec embranchements et un vrai **boss** à pattern (télégraphie une attaque avant de faire apparaître des obstacles) à la fin de chaque chapitre.
- **10 serpents de base** à débloquer avec des pièces, chacun avec une capacité passive et un design distinct (dont Camouflage, indétectable par les chasseurs, et Régénérateur, qui s'auto-allège).
- **7 serpents premium** obtenables uniquement via un gacha (monnaie : cristaux 💎), avec une compétence active rechargeable, une animation et un son dédiés :
  Ouroboros, Tempête, Titan, Nova, Léviathan, Chronos, Mirage.
- **7 terrains**, dont Glace (glissante) et Éclipse (brouillard de guerre), avec un multiplicateur de pièces croissant selon la difficulté.
- **Système d'amélioration** : dépensez des pièces pour faire progresser chaque serpent possédé (jusqu'à 5 niveaux), boostant les gains de pièces et, pour les serpents premium, réduisant le temps de recharge de leur compétence.
- **Succès (16) et défis quotidiens (3)**, avec récompenses en pièces, cristaux et XP.
- **Musique de fond procédurale** générée en direct, avec réglages de volume séparés pour la musique et les effets sonores.
- **Boutique** avec cinq rayons : Serpents, Terrains, Objets, Amélioration, Gacha.
- **Système de rang** (Bronze → Argent → Or → Platine → Diamant → Maître) basé sur un niveau de joueur et de l'XP ; cliquez sur votre rang pour voir tous les paliers.
- **Menu adapté au PC** : mise en page plus large sur grand écran, listes en grille, effets au survol, défilement à la molette ou au cliqué-glissé pour l'arbre de carrière.
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
