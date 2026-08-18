## Current Feature — PossaCode Website

> Ce fichier décrit la fonctionnalité ou la section en cours de développement.  
> Mettre à jour à chaque changement de focus.

---

## 🔧 Feature en cours

_Aucune feature active._

**Status:** Not Started

---

## 🎯 Objectif

_À définir._

---

## ✅ Critères d'acceptation

_À définir._

---

## 📍 Fichier concerné

_À définir._

---

## 🗒️ Notes

_Aucune note pour le moment._

---

## 📜 History

### Fix page metadata — Layout.astro (2026-08-17)

Remplacement du `<title>` placeholder "Document" par un titre réel
("PossaCode — Communauté de développeurs"), ajout d'une
`<meta name="description">` et des balises Open Graph (`og:title`,
`og:description`, `og:image`) pour les previews de partage social.
`og:image` pointe vers `/assets/possacodebb.jpg`, le même logo déjà utilisé
dans le header, garantissant la cohérence et évitant un lien mort.

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

### Fix langue du document — Layout.astro (2026-08-18)

Correction de l'attribut `lang` de la balise `<html>` dans
`src/layouts/Layout.astro` (ligne ~8), passé de `"en"` à `"fr"`. Tout le
contenu de la page étant en français, `lang="en"` induisait en erreur les
lecteurs d'écran et les outils de traduction/SEO.

### Optimisation logo partenaire — Congo DevOps.jpg (2026-08-18)

Le logo pesait 1,36 Mo pour une résolution de 3906×3906px, affiché à
seulement 140×80px dans la section "Ils nous font confiance". Déplacement du
fichier de `public/assets/par/` vers `src/assets/par/` et migration vers le
composant `<Image>` d'`astro:assets` (`densities={[1, 2]}`, `format="webp"`)
dans `src/pages/index.astro`, qui génère désormais deux variantes optimisées
de 1 Ko et 3 Ko au lieu d'un fichier statique unique. Vérifié via
`npm run build` : markup généré avec `srcset` 1x/2x correct, rendu visuel
identique (`object-cover` conservé), aucune régression sur les autres logos
partenaires (non touchés).

### Footer site-wide (2026-08-18)

Nouveau composant `src/components/Footer.astro` (marque + logo, colonnes
Navigation / S'impliquer / Contact, icônes sociales, barre copyright)
importé dans `Layout.astro` juste après le `<slot />` — donc immédiatement
après la CTA finale sur la homepage — et affiché sur les 11 pages du site.
Style final : fond blanc, titres `text-blue-possacode` en `font-Phudu` avec
accent `wave-line` orange, liens `text-gray-700` avec hover
`text-orange-possacode` (le fond est passé de noir → `blue-possacode` →
blanc au fil de demandes successives de l'utilisateur dans la même session).

Pour respecter le critère "chaque lien pointe vers une vraie cible" (pas de
`href="#"`), création de stubs `<Layout>` pour les routes du footer qui
n'existaient pas encore (`community`, `members`, `join`, `donate`,
`partners`, `mentions-legales`, `confidentialite`), et migration de
`event.astro`/`contact.astro` (stubs autonomes sans header/footer) vers
`<Layout>`. Les hrefs de nav du header (`Événements`/`Communauté`/`Nos
Membres`, qui étaient `href=""`) ont été alignés sur ces nouvelles routes
pour rester cohérents avec le footer.

`CONTACT_EMAIL` (`contact@possacode.org`) et les URLs sociales
(LinkedIn/X/Instagram au format `.../possacode`) ont été validés par
l'utilisateur mais pas vérifiés comme des comptes réels existants — à
confirmer avant mise en production.

Vérifié via un script Playwright (`playwright-core` + Edge headless, le
serveur MCP Playwright n'étant pas connecté dans la session) : les 14 liens
résolvent (200 ou `mailto:`/URL externe valide), contraste final contre
`#FFFFFF` — texte body 10.31:1, titres 15.09:1, texte atténué 4.83:1, hover
orange 3.62:1 (sous 4.5:1 mais ≥ 3:1, conforme AA "large text" ; combinaison
déjà utilisée ailleurs sur le site pour des accents sur fond clair). Aucun
noir pur dans l'arbre du footer. 3 breakpoints (375/768/1440px) confirmant
1/2/4 colonnes, `focus-visible` produit un outline visible.

### Prefers-reduced-motion — wave-line (2026-08-18)

Ajout d'une media query `@media (prefers-reduced-motion: reduce)` dans
`src/styles/global.css` : sous cette préférence, `.wave-line` passe à
`animation: none` et `stroke-dashoffset: 0`, affichant le trait complet et
statique au lieu de l'animation `drawLine` continue. Audit du reste du site
(`.astro` + `global.css`) : `.wave-line` est la seule animation CSS
décorative always-on, aucun autre garde-fou n'était nécessaire. Vérifié via
`npm run build` (build réussi, aucune régression).
