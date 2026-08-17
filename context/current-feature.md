## Current Feature — PossaCode Website

> Ce fichier décrit la fonctionnalité ou la section en cours de développement.  
> Mettre à jour à chaque changement de focus.

---

## 🔧 Feature en cours

**Status:** In Progress

Fix horizontal page overflow caused by the hero photo collage on the homepage.

---

## 🎯 Objectif

Éliminer l'overflow horizontal de la page causé par le collage de 3 photos du
hero. À 1280px et 1440px, la 3e image du collage dépasse le viewport car les
images flex n'ont pas de min-width, empêchant flexbox de les réduire en
dessous de leur taille intrinsèque.

---

## ✅ Critères d'acceptation

- Ajouter `min-w-0` aux trois images du collage hero
- Donner à l'image `flex-1` un `max-width` explicite au lieu de compter
  uniquement sur `flex-1` + hauteur fixe sans limite de largeur
- `document.documentElement.scrollWidth` == `window.innerWidth` (pas
  d'overflow horizontal) aux largeurs 1280px, 1440px et 1920px après le fix

---

## 📍 Fichier concerné

`src/pages/index.astro` (lignes ~25-29, collage de 3 images dans le hero)

---

## 🗒️ Notes

Images actuelles :
- `femme1.png` — `flex-1 h-full` (pas de largeur cap)
- `homme1.png` — `w-1/3 h-3/4` (visible md+)
- `femme2.png` — `w-1/4 h-1/2` (visible lg+)

Aucune des trois n'a de `min-w-0`, donc flexbox ne peut pas les compresser
sous leur taille intrinsèque → overflow horizontal à 1280/1440px.

---

## 📜 History

### Section CTA finale — Page d'accueil (2026-08-17)

Remplacement du placeholder (`bg-blue-possacode h-200`) par une section CTA
complète en fin de homepage : titre accrocheur, wave-line, texte d'invitation,
et deux CTA ("Nous Rejoindre" / "Faire un don") cohérents avec le design
system. Vérifié en desktop et mobile via Playwright.
