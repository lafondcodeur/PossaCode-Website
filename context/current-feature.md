## Current Feature — PossaCode Website

> Ce fichier décrit la fonctionnalité ou la section en cours de développement.  
> Mettre à jour à chaque changement de focus.

---

## 🔧 Feature en cours

Fix logos partenaires déformés — section "Ils nous font confiance"

**Statut :** In Progress

---

## 🎯 Objectif

Corriger 4 logos partenaires visiblement étirés dans la section "Ils nous
font confiance" de la homepage, qui utilisent `object-fit: fill` par défaut
au lieu de conserver leur ratio d'aspect naturel comme les autres logos de
la même rangée.

---

## ✅ Critères d'acceptation

- Les 4 balises `<img>` concernées (lignes ~37, 38, 41, 42 de
  `src/pages/index.astro`) ont la classe `object-contain` ajoutée
- Les logos ne sont plus étirés/déformés et gardent leur ratio d'aspect
  naturel
- Les logos ne sont pas rognés (pas de `object-cover`)
- Cohérence visuelle avec les autres logos de la même rangée

---

## 📍 Fichier concerné

`src/pages/index.astro` (lignes ~37, 38, 41, 42)

---

## 🗒️ Notes

Les 4 `<img>` en question n'ont actuellement aucune classe `object-fit`
explicite, donc le navigateur applique le défaut `object-fit: fill`, ce qui
étire l'image pour remplir son conteneur. Ajouter `object-contain` corrige
ce problème sans rogner le logo.

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
