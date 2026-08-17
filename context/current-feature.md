## Current Feature — PossaCode Website

> Ce fichier décrit la fonctionnalité ou la section en cours de développement.  
> Mettre à jour à chaque changement de focus.

---

## 🔧 Feature en cours

Fix page metadata — Layout.astro

**Status:** In Progress

---

## 🎯 Objectif

Remplacer le `<title>` placeholder "Document" par un titre réel et descriptif
pour le site communautaire, et ajouter une meta description ainsi que des
balises Open Graph de base pour les previews de partage social.

---

## ✅ Critères d'acceptation

- Le `<title>` reflète le nom et la mission du site (communauté de
  développeurs) au lieu de "Document"
- Une balise `<meta name="description">` résume le site
- Balises Open Graph présentes : `og:title`, `og:description`, `og:image`
- Aucune régression visuelle ou fonctionnelle sur les pages utilisant
  `<Layout>`

---

## 📍 Fichier concerné

`src/layouts/Layout.astro` (balise `<title>` ligne ~12, `<head>` lignes 9-13)

---

## 🗒️ Notes

Le `<head>` actuel ne contient que `charset` et `viewport`. L'image Open
Graph (`og:image`) devra pointer vers un asset existant dans `public/` (à
vérifier/choisir parmi les images disponibles, ex. logo ou visuel hero).

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

### Fix menu mobile — passage au breakpoint desktop (2026-08-17)

Correction du bug où le menu mobile restait affiché en même temps que la nav
desktop après un redimensionnement au-delà de 768px (navigation dupliquée).
Ajout de `md:hidden` sur `#mobile-menu` et d'un listener `matchMedia`
`(min-width: 768px)` qui force la fermeture du menu et réinitialise l'icône
burger/close lors du passage du breakpoint. Vérifié via Playwright : ouverture
du menu à 375px, resize à 1280px (menu fermé, seule la nav desktop visible),
puis retour à 375px (toggle mobile toujours fonctionnel).

### Fix tap targets mobile — 44px minimum (2026-08-17)

Remontée des cibles tactiles mobiles sous la barre des 44px. Padding vertical
de `.boutton-standard` augmenté (`py-2` → `py-3`), ce qui corrige en un seul
endroit le CTA hero "Nous Rejoindre" (36px → 44px) et le CTA "Participer"
(40px → 48px), les deux partageant cette classe. Ajout de `block py-3` sur
les liens du menu mobile pour remplacer l'espacement visuel par une vraie
zone cliquable (22px → 48px). Vérifié avec des mesures `getBoundingClientRect`
réelles via un script Playwright (`playwright-core` + Edge headless, le
serveur MCP Playwright n'étant pas connecté dans la session) : les 6 cibles
mesurées atteignent 44-48px. Aucune régression visuelle constatée sur les
captures desktop (1440px).

### Fix logos partenaires déformés — section "Ils nous font confiance" (2026-08-17)

Correction de 4 logos partenaires (ACDN, galsendev, logo.webp/Miabé
Hackathon, 10000codeurs) visiblement étirés car dépourvus de classe
`object-fit` explicite (défaut du navigateur : `object-fit: fill`). Ajout de
`object-contain` sur ces 4 `<img>` (`src/pages/index.astro` lignes ~37, 38,
41, 42) pour conserver leur ratio d'aspect naturel sans les rogner. Vérifié
via Playwright (`getComputedStyle` + capture d'écran) que les 4 logos
affichent bien `object-fit: contain` et ne sont plus déformés, cohérence
visuelle rétablie avec les autres logos de la rangée.
