# Current Feature: Section Vision / Mission / Valeurs — page A-propos

> Ce fichier décrit la fonctionnalité ou la section en cours de développement.  
> Mettre à jour à chaque changement de focus.

---

## 🔧 Feature en cours

Nouvelle section "Vision / Mission / Valeurs" sur `src/pages/about.astro`, inspirée
d'une maquette fournie en pièce jointe directe dans la commande (bannière photo,
panneau coloré en dessous avec coupe diagonale, contenant Vision/Mission/Valeurs).

**Status:** In Progress

---

## 🎯 Objectif

- Ajouter une section Vision/Mission/Valeurs sous le hero existant de la page
  A-propos, avec une bannière photo et un panneau coloré à coupe diagonale
  (même technique déjà utilisée sur le bandeau de stats du hero).
- Adapter les couleurs de la maquette (magenta/jaune) à la charte PossaCode
  (blue-possacode / orange-possacode / blanc).
- Réutiliser le texte réel déjà établi pour Vision/Mission/Valeurs
  (`src/pages/index.astro`, section "Mission, Valeur, Vision") plutôt que
  d'inventer un nouveau contenu.

---

## ✅ Critères d'acceptation

- Section visuellement cohérente avec la charte (couleurs, `font-Phudu`,
  `wave-line`) et avec le reste de la page A-propos.
- Responsive (mobile/tablette/desktop), pas d'overflow horizontal.
- Contenu Vision/Mission/Valeurs identique en substance à celui déjà publié
  sur la homepage.
- Build (`npm run build`) sans erreur.

---

## 📍 Fichier concerné

`src/pages/about.astro`

---

## 🗒️ Notes

Image de référence : pièce jointe directe dans le message de la commande, pas
trouvée dans `context/screenshot/` (qui ne contient que `hero.png`/`image.png`,
déjà utilisées pour d'autres sections — vérifié).
