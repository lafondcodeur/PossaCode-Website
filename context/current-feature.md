## Current Feature — PossaCode Website

> Ce fichier décrit la fonctionnalité ou la section en cours de développement.  
> Mettre à jour à chaque changement de focus.

---

## 🔧 Feature en cours

Fix section "Ces experts qui impactent notre communauté" — portraits anonymes

**Status:** In Progress

---

## 🎯 Objectif

La section affiche actuellement 10 cercles de photos (8 en desktop, 6 en
mobile/tablette) sans aucun nom ni rôle visible nulle part. Ajouter un nom et
un rôle/titre sous (ou au survol/focus de) chaque portrait, à partir de
données réelles. Si les données ne sont pas disponibles pour un expert
donné, ne pas afficher de visage anonyme dans cette section axée confiance —
masquer la section entière tant que les données ne sont pas complètes.

---

## ✅ Critères d'acceptation

- Chaque portrait affiché montre un nom ET un rôle/titre (⚠️ **exception
  temporaire demandée par l'utilisateur le 2026-08-18** : données fictives
  en attendant les vraies infos, voir Notes).
- Accessible sans dépendre uniquement du hover (visible aussi au focus
  clavier, et idéalement affiché en permanence sous la photo plutôt que
  caché par défaut).
- Si les données (nom + rôle) manquent pour un ou plusieurs portraits, la
  section entière est masquée jusqu'à ce que les données soient complètes —
  pas de mélange visages nommés / visages anonymes.
- Pas de doublon visuel : la grille desktop actuelle réutilise 2 photos
  (gedeon.jpg, EzéchielAmenAGBLA.png) deux fois chacune pour combler 8
  cases avec seulement 6 fichiers images distincts — à corriger si la
  section est réactivée.
- Chaque portrait a un effet de hover et mène vers le profil LinkedIn/
  portfolio de l'expert (⚠️ **exception temporaire demandée par
  l'utilisateur le 2026-08-18** : liens fictifs en attendant les vraies
  URLs, voir Notes).

---

## 📍 Fichier concerné

`src/pages/index.astro` (section "Experts") + `src/data/experts.ts`
(données des experts, extraites dans un fichier séparé à la demande de
l'utilisateur le 2026-08-18)

---

## 🗒️ Notes

Audit des données disponibles avant implémentation :

- `context/project-overview-astro.md` (section "👨‍💻 Experts Mis en Avant")
  liste 5 noms : Modeste ASSIONBON, Gédéon, Ezéchiel Amen AGBLA, Nadet,
  Adonai Nangui — **mais aucun rôle/titre** n'est fourni pour aucun d'eux.
- Le fichier image `_DSC0979.jpg` (utilisé dans les deux grilles) n'a
  **aucun nom associé** dans la documentation existante.
- Aucune autre source de données (pas de content collection, pas de JSON,
  pas de mention de rôle/poste) n'a été trouvée dans le repo.
- Conclusion : les données réelles sont incomplètes (rôles manquants pour
  tous, nom manquant pour un portrait) → la section doit rester masquée
  jusqu'à ce que le nom ET le rôle de chaque expert affiché soient fournis
  par l'utilisateur/client, plutôt que d'inventer des rôles ou de laisser
  des visages anonymes dans une section de confiance.

Implémentation : la grille statique à 8/6 cercles (avec doublons de photos)
a été remplacée par un tableau `experts` piloté par données dans le
frontmatter d'`index.astro` (`{ name, role, image }`). La section entière
n'est rendue que si `experts.length > 0`. Chaque carte affiche nom + rôle en
permanence sous la photo (pas caché derrière un hover) pour rester
accessible au clavier sans JS. Vérifié via `npm run build` + grep sur
`dist/index.html` : les 6 images distinctes apparaissent chacune une seule
fois (plus de doublons ModesteASSIONGBON/gedeon/EzéchielAmenAGBLA/nadet/
_DSC0979/AdonaiNangui), chaque nom/rôle placeholder rendu correctement.

**2026-08-18 — demande explicite de l'utilisateur** : remplir le tableau
`experts` avec des **données fictives** (nom + rôle inventés, ex. "Modeste
Assiongbon — Ingénieur Backend") en gardant les 6 images réelles existantes,
pour que la section soit visible dès maintenant plutôt que masquée. Le code
utilise toujours la même image par expert (aucun doublon). Un commentaire
dans `index.astro` marque ces données comme temporaires. **À faire avant
mise en production** : remplacer les 6 entrées par les vrais noms/rôles —
sinon le site affiche de fausses identités attribuées à de vraies photos de
personnes, ce qui est plus trompeur que la section masquée initiale.

**2026-08-18 — ajout hover + lien profil** : chaque carte expert est
maintenant un `<a>` (au lieu d'un `<div>`) pointant vers `expert.link`
(ajouté au type `Expert` dans `src/data/experts.ts`), `target="_blank"
rel="noopener noreferrer"`. Effet hover : anneau orange (`ring-4
ring-orange-possacode`) + léger agrandissement (`scale-105`) sur la photo,
nom qui passe en orange, transition fluide. Focus clavier : même style
`focus-visible:outline` que `Footer.astro` (cohérence avec le reste du
site) — accessible sans souris. Les 6 URLs sont **elles aussi fictives**
(`linkedin.com/in/<slug-fictif>`, ne résolvent vers aucun vrai profil) —
même statut temporaire que le nom/rôle, à remplacer ensemble avant mise en
production. Vérifié via `npm run build` + grep sur `dist/index.html` : les
6 `href` distincts sont bien présents.

**2026-08-18 — vérification live (Edge headless, MCP Playwright non connecté
malgré demande explicite de l'utilisateur) : 2 bugs réels trouvés,
invisibles via `npm run build` seul** :

1. **Crash serveur dev sur nom de fichier accentué.** `EzéchielAmenAGBLA.png`
   provoquait un plantage `URI malformed` (`vite-plugin-astro-server/
   trailing-slash.js`) reproductible en navigant sur la page en dev — le
   build de production n'était pas affecté (ce middleware est dev-only),
   mais le dev server devenait peu fiable. Fix : fichier renommé en
   `EzechielAmenAGBLA.png` (ASCII), référence mise à jour dans
   `experts.ts`.
2. **Les 6 portraits ne s'affichaient pas du tout** (cercles vides) malgré
   un HTML généré correct. Cause : la classe Tailwind arbitraire
   `` bg-[url('${expert.image}')] `` utilisait un template literal
   interpolé dans `.map()` — le scanner JIT de Tailwind ne peut extraire
   que des chaînes de classe *littérales* trouvées telles quelles dans le
   code source, donc il a généré une règle CSS inutile pour la chaîne
   littérale non résolue (`background-image:url(${expert.image})`) et
   aucune règle pour les vraies URLs. Le HTML contenait les bonnes classes,
   `npm run build` ne signalait aucune erreur, et un grep sur
   `dist/index.html` semblait "passer" — seul un rendu réel dans un
   navigateur révélait le problème. Fix : l'image de fond dynamique est
   passée en attribut `style` inline (`style={`background-image:
   url('${expert.image}')`}`) au lieu d'une classe Tailwind arbitraire ;
   `bg-cover`/`bg-top` restent des classes Tailwind statiques (valides).

Revérifié via Edge headless (`--run-all-compositor-stages-before-draw
--virtual-time-budget=10000`, MCP Playwright toujours indisponible dans la
session) à 375px et 1440px après les deux fixes : les 6 portraits
s'affichent correctement avec leur photo, aucun chevauchement, grille
équilibrée (2 lignes de 3 en desktop/tablette, 3 lignes de 2 en mobile,
aucune ligne orpheline), aucun crash. Cette vérification live a été
explicitement demandée par l'utilisateur après que l'audit statique du
sous-agent (sans outils Playwright disponibles) n'ait pu que réviser le
code source sans rien confirmer visuellement.

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
