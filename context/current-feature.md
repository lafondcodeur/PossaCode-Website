# Current Feature

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

### Section héro — page A-propos (2026-08-24)

Nouvelle première section sur `src/pages/about.astro` (jusque-là une page
placeholder `<h1>About Page</h1>`), inspirée d'une maquette "cabinet de
conseil Produit & IA" fournie en pièce jointe directe dans le message de la
commande — pas dans `context/screenshot/` (qui ne contient que `hero.png`/
`image.png`, déjà utilisées pour d'autres sections). Structure reprise (bannière
sombre avec photo, titre + sous-titre, deux CTA, bandeau de statistiques) mais
contenu et couleurs adaptés à PossaCode plutôt que repris tels quels : le
texte source ("Le cabinet de conseil Produit & IA...") décrit un tout autre
positionnement (conseil produit/IA) que celui de l'association, donc titre et
sous-titre réécrits autour de la mission réelle de PossaCode (formation,
meetups, hackathons), en gardant `font-Phudu` + `wave-line` et les couleurs
`blue-possacode`/`orange-possacode` du reste du site. Overlay dégradé
`blue-possacode` sur la photo (au lieu du noir de la source) pour rester
cohérent avec la charte.

Photo de fond : `public/assets/A3.jpg` (trois membres de PossaCode collaborant
autour d'une tablette), choisie parmi les photos déjà existantes du repo pour
sa composition proche de la référence (plusieurs personnes engagées, tons
chauds) plutôt qu'une photo de stock externe.

CTA "Nous contacter" → `/contact` (bouton `boutton-standard`, cohérent avec le
reste du site) et "Nos événements" → `/event` (bouton blanc), remplaçant "Nos
réalisations" de la maquette par une vraie page existante du site plutôt qu'un
lien inventé.

Bandeau de 3 statistiques en bas de section : "80+ membres" et "1000+
personnes impactées" repris tels quels de la section "Qui sommes-nous ?" de la
page d'accueil (`src/pages/index.astro`) pour rester cohérent avec les chiffres
déjà communiqués ailleurs sur le site, plutôt que d'inventer de nouveaux
chiffres comme dans la maquette source (200+/300+/11 000+, propres à un cabinet
de conseil). Troisième statistique ("5 domaines d'expertise") dérivée du nombre
réel de catégories dans `memberCategories` (`src/data/members-directory.ts`)
plutôt qu'un chiffre fictif.

Vérifié via `npm run build` (71 pages, aucune erreur) et captures d'écran Edge
headless à 1440px/768px : rendu propre, CTA et bandeau de stats bien alignés,
aucun overflow visible. **Limite connue** (déjà documentée sur ce projet) :
capture à 390px affectée par l'artefact de rendu Edge headless qui coupe le
bord droit sur tout le site — confirmé en comparant avec une capture de la
homepage (page déjà validée) au même viewport, montrant le même artefact.
CSS responsive (`md:`, `flex-wrap` sur les CTA) relu directement pour combler
cette limite.

Retouche demandée par l'utilisateur après premier rendu (captures de la
maquette source à l'appui) : le bandeau de statistiques n'avait à l'origine
qu'un simple fond blanc plat sous la photo, alors que la référence montre un
pan blanc diagonal qui remonte sur la photo. Ajouté un triangle blanc
(`clip-path: polygon(0_100%,100%_0,100%_100%)`) positionné en négatif
au-dessus du bandeau de stats (`left-1/4` à `right-0`), qui crée l'effet de
découpe diagonale remontant sur la photo à partir d'environ 25% de la largeur
jusqu'au bord droit — sans toucher au texte des statistiques lui-même (qui
reste dans un bloc rectangulaire classique en dessous, non clippé, pour éviter
tout risque de texte coupé). Revérifié à 1440px et 768px : découpe diagonale
propre, aucun chevauchement avec le texte du hero.

---

## 📜 History

### Section héro "Nos Membres" — recherche et bandeau de portraits (2026-08-22)

Nouvelle première section sur `src/pages/members.astro`, inspirée de la maquette
fournie (`context/screenshot/image.png` : fond dégradé violet/bleu, titre
"Showcase Your Mastery. Get Connected", barre de recherche à deux champs, bandeau
de portraits colorés). Couleurs adaptées à la charte PossaCode (`blue-possacode`
`#1a2251` / `orange-possacode` `#f14d0e`) plutôt que reprise du violet/bleu vif de
la source. Titre en `font-Phudu` + `wave-line`, barre de recherche à deux champs
(compétence/rôle + ville) et bouton `boutton-standard`, volontairement non
fonctionnelle (`type="button"`, pas de `<form>`) — site statique, cohérent avec
les autres CTA du site. L'ancien `<h1>` placeholder "Nos Membres" est repassé en
`<h2>` pour garder un seul `<h1>` par page (celui du nouveau titre héro).

Bandeau de 6 cartes membres réutilisant des photos déjà présentes dans
`public/assets/` (homme1-3.png, femme1-3.png), ajustées sur demandes successives
de l'utilisateur : hauteur augmentée (`h-52`→`h-96` selon breakpoint), marges
extérieures + espacement entre cartes (`px-6/10` + `gap-3/5`), coins arrondis
(`rounded-2xl`) et ombre teintée `shadow-blue-possacode/15`.

Effet hover ajouté ensuite : overlay dégradé `blue-possacode` + nom, rôle et lien
"Voir plus" au survol d'une carte, plus anneau orange et léger zoom sur la photo
(même pattern que la section "experts" de la homepage). Comme ces 6 photos
n'avaient aucune identité associée (décoratives), question posée à l'utilisateur
sur la source des données nom/rôle/lien à afficher — réponse : **placeholders
fictifs temporaires**. Créé `src/data/members-preview.ts` (même pattern que
`src/data/experts.ts`, type `{ name, role, image, link }`), 6 entrées clairement
commentées comme temporaires dans le code. **À faire avant mise en production :
remplacer ces 6 entrées par les vraies informations des membres** — même limite
déjà documentée pour `experts.ts`.

Classes Tailwind dynamiques (couleurs de fond, visibilité responsive par carte)
passées via des tableaux indexés par position plutôt que des template literals
interpolés, pour éviter de reproduire le bug de scanner JIT déjà rencontré sur la
section experts (`bg-[url('${...}')]` non résolu). Vérifié dans le CSS compilé
que les classes dynamiques (`bg-[#fff3ee]`, `bg-[#e9ecf7]`, `group-hover:*`,
`scale-110`) sont bien générées.

Vérifié via `npm run build` (11 pages, aucune erreur) et captures d'écran à
768px/1440px (Edge headless, MCP Playwright indisponible dans la session) : rendu
propre, aucun overflow, overlay hover confirmé visuellement en forçant
temporairement l'état hover d'une carte avant de revenir à l'état normal. **Limite
connue** : le mode `--screenshot` d'Edge headless legacy a un artefact de rendu à
375px qui affecte tout le site (y compris des pages déjà validées comme la
homepage) — le rendu mobile de cette section n'a donc pas pu être confirmé
visuellement avec un outil fiable dans cette session, seul le CSS responsive
(`sm:`/`md:`) a été relu.

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

### Section "Découvrez nos talents" (annuaire filtrable) — page Nos Membres (2026-08-23)

Nouvelle section sur `src/pages/members.astro`, sous le bandeau héro existant,
inspirée de la maquette "Discover the Emerging Masters" (`context/screenshot/image.png`) :
titre + sous-titre, onglets de catégories avec icônes (Développeur, Design,
DevOps, Data, Chef de projet), grille de cartes membres (photo, note étoilée,
nom, rôle, tags de compétences), une carte mise en avant ("featured"), bouton
"Voir tout". Remplace le placeholder "L'annuaire complet arrive bientôt".
Couleurs adaptées à la charte PossaCode plutôt que reprise du violet/bleu vif
de la source, titres `font-Phudu` + `wave-line`, cohérents avec le reste de la
page. Filtrage par onglet réellement fonctionnel en JS côté client (vanilla,
`<script>` Astro, pas de backend) : clic sur un onglet → `classList.toggle('hidden', ...)`
sur les cartes selon `data-category` ; "Voir tout" retire tous les `hidden`.

Nouveau fichier `src/data/members-directory.ts`, séparé de
`src/data/members-preview.ts` (qui reste dédié au seul bandeau héro) car les
cartes de cette section ont besoin de champs supplémentaires (catégorie,
note, avis, compétences) et d'un volume de données différent — les réutiliser
dans le même tableau aurait cassé le rendu du bandeau héro (boucle indexée sur
6 éléments).

Décision utilisateur explicite (2 questions posées en cours de route) :
1. Vu que le site n'a que 6 photos "génériques" déjà utilisées comme
   placeholders (`homme1-3.png`, `femme1-3.png` — les autres photos d'assets
   appartiennent à de vraies personnes identifiées dans la section "experts"),
   les 6 membres réels du bandeau héro sont repris en tête de chaque
   catégorie plutôt que de réutiliser leur photo sous un faux nom.
2. Le reste (12 cartes par catégorie demandées, 60 au total) est généré avec
   un **avatar aléatoire non-photo** : dégradé aux couleurs PossaCode
   (`#1a2251`/`#f14d0e`) + initiales, rendu en SVG à la volée par l'API
   publique DiceBear (`api.dicebear.com`, seed = nom complet → déterministe
   d'un build à l'autre), pour éviter d'attribuer une photo de stock à une
   fausse identité. Noms/rôles/compétences générés par pools thématiques par
   catégorie (voir commentaires dans le fichier) — **données fictives
   temporaires, à remplacer avant mise en production**, même limite déjà
   documentée pour `experts.ts` et `members-preview.ts`.

Grille passée de `flex flex-wrap` (essayé avec 6 membres, cartes non centrées
proprement) à `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` une fois le
volume de 12 cartes/catégorie confirmé — mieux adapté à un nombre de cartes
constant par onglet. `loading="lazy"` ajouté sur les avatars vu le nombre
total de `<img>` dans le DOM (60, seules 12 visibles à la fois).

Vérifié via `npm run build` (11 pages, aucune erreur), inspection du HTML/CSS
compilés (classes Tailwind dynamiques bien générées, aucune classe
interpolée à risque comme lors des bugs précédents), et lancement réel du
serveur de dev (`npm run dev`) avec captures d'écran Edge headless à 1440px :
grille de 12 cartes pour l'onglet par défaut ("Développeur") confirmée
visuellement, avatars générés + photos réelles cohérents avec la charte,
carte "featured" (Chloé Bakala) présente une seule fois tous onglets confondus.
**Limite connue** (déjà documentée sur cette page) : le rendu mobile à 375-390px
n'a pas pu être confirmé visuellement de façon fiable (artefact Edge headless
affectant tout le site) — le CSS responsive (`sm:`/`md:`, `overflow-x-auto`
sur les onglets) a été relu directement à la place.

### Page de profil complet d'un membre (2026-08-24)

Nouvelle route dynamique `src/pages/members/[slug].astro` (une page statique
générée par membre via `getStaticPaths()`, 60 au total) inspirée d'une
maquette "ABOUT" fournie en pièce jointe directe dans le message de la
commande — pas trouvée dans `context/screenshot/` comme l'énoncé le laissait
penser (ce dossier ne contient que `hero.png`/`image.png`, déjà utilisées
pour d'autres sections de cette page). Structure adaptée à la charte
PossaCode plutôt que reprise du fond sombre/accents jaune-vert de la source :
carte claire avec photo + note à gauche, badge de catégorie, nom, rôle, bio,
bouton CV, réseaux sociaux et compétences à droite.

`src/data/members-directory.ts` et `members-preview.ts` étendus avec un
`slug` calculé (fonction `slugify` extraite dans `src/utils/slug.ts`,
partagée entre les deux fichiers pour garantir des slugs identiques pour les
6 membres réels communs aux deux) et un champ `github` fictif (même limite
que le `link` LinkedIn déjà documenté). Les liens "Voir plus" du bandeau héro
et les cartes de l'annuaire filtrable de `members.astro` pointent désormais
vers `/members/{slug}` au lieu de liens externes.

Bio générée via un template (`src/utils/member-bio.ts`, à partir du rôle, de
la catégorie et des compétences du membre) plutôt que rédigée à la main pour
chacun des ~60 profils. `Layout.astro` reçoit désormais des props `title`/
`description` optionnelles (rétrocompatibles, valeurs par défaut = les
anciennes constantes en dur) pour permettre des métadonnées par page.

Deux décisions pour rester cohérent avec les conventions déjà établies sur ce
projet plutôt que d'introduire un lien mort ou un faux document :
- **CV** : aucun fichier réel n'existe pour aucun membre. Le bouton
  "Télécharger le CV" est rendu `disabled` (avec tooltip), sur le même
  principe que la barre de recherche non fonctionnelle du bandeau héro
  (`type="button"`, pas de vrai comportement) plutôt que de fabriquer un faux
  PDF ou un lien mort.
- **Compétences** : à la demande explicite de l'utilisateur (suite à un
  premier rendu en tags texte simples), remplacées par de vraies icônes de
  marque. Générées une seule fois via le paquet npm `simple-icons` (CC0),
  figées dans `src/data/skill-icons.ts` (39 logos), puis le paquet a été
  désinstallé — seul le fichier de données statique reste, sans dépendance
  runtime. Adobe, Amazon/AWS, Microsoft, Canva, InVision et Tableau sont
  volontairement absents (Simple Icons a retiré ces marques de son catalogue
  à la demande de leurs propriétaires) : plutôt que de contourner ce retrait
  via une autre source, ces compétences ainsi que les méthodologies sans
  marque (Agile, CI/CD, Scrum au sens générique, etc.) utilisent une icône
  générique neutre (badge bouclier, couleurs PossaCode).

Vérifié via `npm run build` (71 pages, aucune erreur), inspection du HTML
généré (`curl` : 60 liens `/members/{slug}` uniques présents sur la page
Nos Membres) et captures d'écran Edge headless à 1440px/768px de plusieurs
fiches (colonne photo/infos qui s'empile bien sous `md`, icônes de
compétences aux bonnes couleurs de marque, icône générique de repli rendue
isolément pour confirmer qu'elle ne ressemble pas à une icône cassée). Agent
`responsive-auditor` sollicité mais sans MCP Playwright connecté dans cette
session (limite déjà documentée sur ce projet) — vérification manuelle via
Edge headless à la place. **Limite connue** : rendu mobile strict à 375px non
reconfirmé visuellement de façon fiable ; CSS responsive relu directement
(grid `md:grid-cols-[240px_1fr]`, `flex-wrap` sur les tags de compétences).

### Section Vision / Mission / Valeurs — page A-propos (2026-08-24)

Nouvelle section sur `src/pages/about.astro`, sous le hero existant, inspirée
d'une maquette "Our Vision / Our Mission / Our Values" fournie en pièce jointe
directe dans le message de la commande — pas trouvée dans `context/screenshot/`
(qui ne contient que `hero.png`/`image.png`, déjà utilisées pour d'autres
sections, vérifié avant implémentation). Structure reprise (bannière photo,
panneau coloré en dessous avec coupe diagonale remontant sur la photo,
Vision/Valeurs empilées à gauche et Mission à droite) mais couleurs adaptées à
la charte PossaCode plutôt que reprises telles quelles : le magenta/jaune vif
de la source remplacé par `blue-possacode` (panneau) et `orange-possacode`
(titres), cohérent avec le reste du site. Coupe diagonale réalisée avec la
même technique `clip-path` déjà utilisée sur le bandeau de stats du hero de
cette page, réutilisée ici en couleur `blue-possacode` au lieu de blanc.

Contenu texte (Vision/Mission/Valeurs) repris tel quel de la section "Mission,
Valeur, Vision" déjà existante sur `src/pages/index.astro` plutôt qu'inventé,
pour rester cohérent avec le positionnement déjà communiqué ailleurs sur le
site.

Photo : `public/assets/engroupe.jpg` (groupe de membres PossaCode réunis,
fond bleu), choisie car inutilisée ailleurs sur le site jusqu'ici (vérifié) et
dans la même veine que la référence (plusieurs personnes de la communauté).

Vérifié via `npm run build` (71 pages, aucune erreur) et captures d'écran Edge
headless à 1440px/768px/390px (serveur de dev réel, MCP Playwright
indisponible dans la session) : coupe diagonale propre, colonnes Vision/Valeurs
+ Mission bien alignées en 2 colonnes dès 768px, empilement à une colonne en
mobile (Vision, Valeurs, Mission dans l'ordre), aucun overflow horizontal
propre à cette section. **Limite déjà documentée sur ce projet** : la capture
à 390px reste affectée par l'artefact de rendu Edge headless qui coupe le bord
droit sur tout le site (visible sur le hero existant, pas propre à la nouvelle
section).
</content>
