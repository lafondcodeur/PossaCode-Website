## Current Feature — PossaCode Website

> Ce fichier décrit la fonctionnalité ou la section en cours de développement.  
> Mettre à jour à chaque changement de focus.

---

## 🔧 Feature en cours

**Statut : In Progress**

Fix — Menu mobile qui reste ouvert lors du passage au breakpoint desktop

---

## 🎯 Objectif

Corriger le bug d'affichage dans `src/components/header.astro` : lorsque le
menu mobile est ouvert (classe `hidden` retirée via JS) puis que le viewport
passe le breakpoint `md` (768px) par redimensionnement, le menu mobile et la
nav desktop s'affichent simultanément (navigation dupliquée).

---

## ✅ Critères d'acceptation

- `#mobile-menu` a la classe `md:hidden` ajoutée à sa liste de classes, pour
  qu'il ne puisse jamais s'afficher au-dessus du breakpoint `md` même si la
  classe JS `hidden` a été retirée.
- Le script de toggle écoute les changements de breakpoint (via
  `matchMedia('(min-width: 768px)')` et/ou un listener `resize`) et, lors du
  passage au-dessus de 768px, force la fermeture du menu mobile (remet la
  classe `hidden`) et réinitialise l'état de l'icône burger/close.
- Vérifier manuellement (ou via Playwright) : ouvrir le menu mobile sous
  768px, redimensionner au-dessus de 768px → seule la nav desktop est
  visible, l'icône burger est revenue à son état fermé, et redescendre
  ensuite sous 768px rouvre correctement le comportement mobile standard.

---

## 📍 Fichier concerné

- `src/components/header.astro` (ligne ~34 pour `#mobile-menu`, + script de
  toggle du menu)

---

## 🗒️ Notes

- Le `#mobile-menu` est actuellement toggle uniquement via une classe `hidden`
  gérée en JS, sans garde `md:hidden` — c'est la cause racine du bug.
- Ne pas introduire de nouvelle librairie JS/animation ; rester en JS vanilla
  cohérent avec le reste du header.

---

## 📜 History

### Section CTA finale — Page d'accueil (2026-08-17)

Remplacement du placeholder (`bg-blue-possacode h-200`) par une section CTA
complète en fin de homepage : titre accrocheur, wave-line, texte d'invitation,
et deux CTA ("Nous Rejoindre" / "Faire un don") cohérents avec le design
system. Vérifié en desktop et mobile via Playwright.

### Fix overflow horizontal — Collage photo hero (2026-08-17)

Correction de l'overflow horizontal causé par le collage de 3 photos du hero
à 1280px et 1440px : ajout de `min-w-0` sur les trois images flex et d'un
`max-width` explicite sur l'image `flex-1` (qui n'avait aucune limite de
largeur). Vérifié via Playwright que `scrollWidth` ne dépasse plus
`innerWidth` à 1280px, 1440px et 1920px.
