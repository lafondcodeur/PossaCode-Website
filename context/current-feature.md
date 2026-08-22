# Current Feature: Section héro Nos Membres

> Ce fichier décrit la fonctionnalité ou la section en cours de développement.  
> Mettre à jour à chaque changement de focus.

---

## 🔧 Feature en cours

Section héro "Nos Membres" (recherche de membres), basée sur la maquette `context/screenshot/image.png`

**Status:** Complete

---

## 🎯 Objectif

Implémenter la première section de `src/pages/members.astro` en s'inspirant de la
maquette fournie (titre accrocheur, sous-titre, barre de recherche à deux champs +
bouton, bandeau de portraits en bas de section) tout en respectant la charte
graphique du site (couleurs `blue-possacode`/`orange-possacode`, polices
Phudu/Nunito Sans, wave-line, rayons de bordure existants) plutôt que de copier le
style visuel brut (violet/bleu vif) de la maquette source.

---

## ✅ Critères d'acceptation

- La section est la toute première section à l'intérieur de `<Layout>` sur `/members`.
- Titre en `font-Phudu`, accent `text-orange-possacode`, cohérent avec le reste du site.
- Barre de recherche avec 2 champs (ex: compétence/rôle + ville) et un bouton d'action
  utilisant le style de bouton existant (`boutton-standard` ou équivalent), sans backend
  réel (site statique — comportement visuel uniquement, comme les autres CTA du site).
- Bandeau de portraits en bas de section utilisant des photos déjà présentes dans
  `public/assets/`.
- Au survol d'une carte membre : nom, rôle et lien "Voir plus" affichés en overlay
  (données fictives temporaires, voir Notes ci-dessous).
- Responsive vérifié à 375px / 768px / 1440px, pas d'overflow horizontal.
- Le reste de la page (placeholder "en construction") reste cohérent après l'ajout.

---

## 📍 Fichier concerné

`src/pages/members.astro`

---

## 🗒️ Notes

Maquette source : `context/screenshot/image.png` (fond dégradé violet/bleu clair,
titre "Showcase Your Mastery. Get Connected", barre de recherche avec icônes
loupe/localisation + bouton bleu "Search", bandeau de portraits colorés en bas de
section). Adapter les couleurs à la charte PossaCode (`#1a2251` / `#f14d0e`) plutôt
que de reprendre le violet/bleu vif de la source.

Effet hover sur les cartes membres (demande utilisateur du 2026-08-22) : au survol,
overlay dégradé `blue-possacode` + nom/rôle/lien "Voir plus". Nécessite des données
nom/rôle/lien par carte — question posée à l'utilisateur sur la source de ces
données (fictif temporaire / vraies infos / pas de nom), réponse : **fictif
temporaire**. Créé `src/data/members-preview.ts` (même pattern que
`src/data/experts.ts`) avec 6 entrées de placeholder clairement commentées comme
temporaires. **À faire avant mise en production : remplacer ces 6 entrées par les
vraies informations des membres**, comme pour `experts.ts`.

---

## 📜 History

### Section experts avec noms, rôles et liens profil (2026-08-18)

La section "Ces experts qui impactent notre communauté" affichait 10
cercles de photos (8 desktop / 6 mobile, avec 2 photos dupliquées) sans
aucun nom ni rôle. Remplacée par une grille pilotée par données
(`src/data/experts.ts`, type `{ name, role, image, link }`), rendue via
`src/pages/index.astro` uniquement si `experts.length > 0` — masquant
toute la section si les données sont incomplètes plutôt que d'afficher des
visages anonymes. Audit préalable : aucune vraie donnée de rôle
n'existait dans le repo pour aucun expert (voir
`context/project-overview-astro.md`), et une photo (`_DSC0979.jpg`)
n'avait même pas de nom associé.

À la demande explicite de l'utilisateur, le tableau a ensuite été rempli
avec des **noms, rôles et liens LinkedIn/portfolio fictifs** (données
placeholder marquées comme temporaires dans le code et ici) pour que la
section soit visible immédiatement plutôt que masquée. **À faire avant
mise en production : remplacer les 6 entrées de `src/data/experts.ts` par
les vraies informations** — sinon le site attribue de fausses identités à
de vraies photos de personnes.

Chaque portrait est un `<a>` avec effet hover (anneau orange + léger
agrandissement, nom qui passe en orange) et un style de focus clavier
cohérent avec `Footer.astro` (`focus-visible:outline`), accessible sans
JS ni souris. Grille : 3 lignes de 2 en mobile, 2 lignes de 3 en
tablette/desktop (6 experts, jamais de ligne orpheline).

Deux bugs réels ont été trouvés via vérification en navigateur réel (Edge
headless, MCP Playwright demandé par l'utilisateur mais resté
indisponible dans la session), invisibles via `npm run build` seul :
1. Le fichier `EzéchielAmenAGBLA.png` (nom accentué) faisait planter le
   serveur dev Astro (`URI malformed` dans le middleware trailing-slash de
   Vite) — renommé en `EzechielAmenAGBLA.png`.
2. Les 6 portraits ne s'affichaient pas du tout : la classe Tailwind
   arbitraire `` bg-[url('${expert.image}')] `` utilisait un template
   literal interpolé, que le scanner JIT de Tailwind ne peut pas résoudre
   (il ne scanne que des chaînes littérales du code source) — il générait
   une règle CSS morte pour la chaîne non résolue et aucune règle pour les
   vraies URLs, alors que le HTML généré était pourtant correct. Corrigé
   en passant l'image de fond en attribut `style` inline plutôt qu'en
   classe Tailwind arbitraire. Reverifié à 375px et 1440px après fix :
   6 portraits affichés correctement, aucun crash, aucune ligne orpheline.

MCP Playwright s'est reconnecté plus tard dans la session : vérification
finale refaite avec les vrais outils Playwright (pas Edge headless) à
375px et 1440px — `getComputedStyle` confirme un `background-image`
résolu pour les 6 cercles, tailles correctes (160px mobile / 224px
desktop), aucun overflow horizontal, 3 lignes de 2 en mobile confirmées
par les positions Y des cartes, capture d'écran conforme.

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
