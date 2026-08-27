# Current Feature

> Ce fichier décrit la fonctionnalité ou la section en cours de développement.  
> Mettre à jour à chaque changement de focus.

---

## 🔧 Feature en cours

Fix contraste texte-sur-orange-possacode (WCAG AA)

**Status:** In Progress

---

## 🎯 Objectif

Corriger le motif récurrent de contraste insuffisant "texte sur fond
`orange-possacode`" détecté par un audit axe-core : 14 nœuds
`color-contrast` (impact `serious`), ratios mesurés entre 3.32:1 et 4.17:1,
tous sous le seuil AA 4.5:1 (texte normal). Au lieu de rustines au cas par
cas, ajouter dans `src/styles/global.css` un token de texte foncé dédié aux
fonds `orange-possacode` (ex. `--color-orange-possacode-ink`, une teinte
assombrie de la couleur de texte actuelle) et l'appliquer aux boutons/
paragraphes concernés à la place de `text-white`/`text-orange-possacode`
utilisés à tort sur fond clair.

---

## ✅ Critères d'acceptation

- Nouveau token de couleur ajouté dans `@theme` (`global.css`) pour un texte
  foncé lisible sur fond `orange-possacode`.
- Les 14 nœuds concernés utilisent ce token (ou une classe Tailwind qui le
  référence) au lieu de `text-white`/`text-orange-possacode` sur fond clair.
- `axe.run()` sur les pages concernées (au minimum la homepage et le header,
  communs à tout le site) ne remonte plus aucune violation `color-contrast`
  sur ces 14 nœuds.
- Aucune régression visuelle non justifiée (cohérence avec les couleurs
  `orange-possacode`/`blue-possacode` du design system, pas de nouvelle
  couleur hors thème).

---

## 📍 Fichier concerné

- `src/styles/global.css` (nouveau token de couleur)
- `src/pages/index.astro` (lignes 35, 36, 88, 132, 144, 156, 176, 185, 191,
  200, 209, 276 — à revérifier au moment du fix, les lignes ont pu bouger
  depuis l'audit)
- `src/components/header.astro` (ligne 20)

---

## 🗒️ Notes

- Origine : audit axe-core, 14 nœuds `color-contrast` (impact `serious`),
  ratios entre 3.32:1 et 4.17:1, tous sous le seuil AA 4.5:1 texte normal.
- Motif récurrent plutôt que 14 cas isolés → traiter à la racine via un
  token de thème dédié, pas des overrides ponctuels par élément.

**Implémenté** : token `--color-orange-possacode-ink` (`#2a0e00`) ajouté
dans `@theme` (`global.css`), appliqué aux 12 nœuds `index.astro` + 1 nœud
`header.astro:20` listés ci-dessus (13 au total), plus le duplicata mobile
du bouton "Faire un don" (`header.astro:41`, même composant, même bug, pas
listé séparément dans l'audit mais visible dès qu'on ouvre le menu mobile).

**Écart avec le compte de "14 nœuds"** : le tableau détaillé de l'audit
(`doc/audit-home-2026-08-27.md`, finding S1) inclut en réalité un 14ᵉ nœud
— `src/layouts/Layout.astro:29` (span "PossaCode Dev Girsl", orange sur
fond `blue-possacode`, 4.17:1) — absent du `Fichier concerné` de cette
feature et de la liste de lignes du `/feature load` d'origine. Ce nœud est
d'une nature différente (texte orange trop *foncé* pour un fond **bleu**
foncé — a besoin d'un orange plus **clair**, pas du token `-ink` qui va
dans le sens inverse) : non corrigé ici, laissé pour une feature séparée
plutôt que d'élargir le scope ou de forcer un token dans la mauvaise
direction. `axe.run()` confirme que c'est désormais la SEULE violation
`color-contrast` restante sur la homepage, à 390/768/1024/1440px et avec le
menu mobile ouvert.

**Trouvé en vérifiant (hors liste initiale, corrigé quand même car même
fichier/même motif)** : à 390-767px, 5 nœuds supplémentaires en
`text-orange-possacode` (gras, 16px) sur fond `blue-possacode` échouaient
aussi à 4.17:1 — invisibles à l'audit initial car son scan ne semble avoir
tourné qu'à un seul viewport desktop. Concerné : le span "PossaCode" de
l'intro (`index.astro` ~l.78) et les 4 mots-clés en gras du paragraphe
"Nous sommes convaincus..." dans le bloc mobile/tablette dupliqué
(`index.astro` ~l.106). Corrigés en `text-white md:text-orange-possacode`
(le bloc desktop équivalent, l.87, n'était pas concerné : texte déjà à
20px gras dès `lg:`, donc "grand texte", seuil 3:1 déjà respecté à 4.17:1)
plutôt qu'avec le token `-ink` (mauvaise direction ici aussi, même
raisonnement que pour `Layout.astro:29`).

**Vérification** : `npm run build` (71 pages, 0 erreur) puis une vraie
session Playwright (`playwright-core`+`axe-core` installés temporairement
en local avec `--no-save`, pilotés via Edge installé sur la machine — MCP
Playwright non connecté dans cette session, désinstallés après
vérification, aucune trace dans `package.json`/`git status`) :
`axe.run({runOnly:['color-contrast']})` sur la homepage à 390/768/1024/
1440px + menu mobile ouvert → 0 violation sur tous les nœuds dans le scope
de cette feature (1 seule violation restante à chaque fois : le nœud
`Layout.astro:29` documenté ci-dessus comme hors scope).
- Ne pas introduire de couleur hors thème (`orange-possacode`/
  `blue-possacode` uniquement, cf. `context/ai-interaction.md`) — le
  nouveau token doit rester une variante assombrie de `orange-possacode`,
  pas une couleur Tailwind générique.
- Vérification finale attendue via `axe.run()` (pas seulement `npm run
  build`), cohérent avec la pratique de vérification déjà établie sur ce
  projet (voir History).

---

## 📜 History

### Fix liens morts href="" des CTA principaux — homepage (2026-08-27)

Les 3 CTA "Nous Rejoindre"/"Faire un don" de la homepage
(`src/pages/index.astro`, lignes 36, 276, 277) avaient `href=""`
(rechargement de la page courante au lieu d'une vraie navigation) — repérés
directement par l'utilisateur, pas via un audit. Pointés vers `/join` et
`/donate`, mêmes routes déjà utilisées pour ces mêmes libellés dans
`src/components/Footer.astro` ; les deux routes existaient déjà comme
stubs `<Layout>` (voir History "Footer site-wide"), aucune nouvelle page
créée.

Vérifié via `npm run build` (71 pages, aucune erreur) et une vraie session
Playwright (`playwright-core` installé temporairement en local avec
`--no-save`, piloté via Edge installé sur la machine — MCP Playwright non
connecté dans cette session, désinstallé après vérification, aucune trace
dans `package.json`/`git status`) : scan DOM de la homepage confirmant 0
`<a>` avec `href=""` restant (54 liens au total) et que les 6 CTA
"Nous Rejoindre"/"Faire un don" de la page (dont ceux déjà présents dans
le header et le footer) résolvent bien vers `/join`/`/donate`.

### Animation d'apparition au scroll — section "Notre histoire" (2026-08-27)

Demande utilisateur : ajouter une animation à la section "Notre histoire".
Choix fait sans autre précision de l'utilisateur : une révélation
progressive au scroll (fade + léger slide-up) sur chaque jalon (photo et
bloc texte) et un effet de "pop" (scale 0→1) sur la puce orange, plutôt
qu'une ligne de progression continue synchronisée au scroll (rejetée :
nécessite `animation-timeline: scroll()`, encore mal supporté, ou du JS de
calcul de scroll continu, plus complexe pour un gain visuel marginal ici).
Cohérent avec la contrainte du projet ("ne pas introduire d'autre librairie
d'animation") : IntersectionObserver natif + transitions CSS uniquement,
même philosophie que le marquee/l'accordéon déjà en place sur cette page.

Deux classes ajoutées dans `global.css` (`.history-reveal` : opacity 0 +
translateY(28px) → opacity 1 + translateY(0) ; `.history-dot-reveal` : scale
0 → 1 avec un léger délai pour que la puce apparaisse juste après le texte),
toutes deux avec leur propre bloc `@media (prefers-reduced-motion: reduce)`
juste en dessous (même pattern que `.wave-line`/`.logo-marquee`) qui les
affiche immédiatement sans transition sous cette préférence. Un seul
`IntersectionObserver` (`threshold: 0.2`, `rootMargin: '0px 0px -10% 0px'`)
observe tous les éléments `.history-reveal`/`.history-dot-reveal` et ajoute
`is-visible` au premier passage dans le viewport (`unobserve` ensuite —
révélation une seule fois, pas de va-et-vient en scrollant vers le haut) ;
repli (`classList.add` immédiat sur tous) si `IntersectionObserver`
n'existe pas dans le navigateur.

**Difficulté de vérification rencontrée et résolue** : `getComputedStyle`
et `page.screenshot()` de Playwright (piloté via Edge local, MCP Playwright
indisponible dans la session) se sont montrés incapables de refléter une
mutation `classList.add()` faite **après le chargement de la page** sur
cette page précise — l'opacité restait mesurée à "0" même en forçant
`el.style.setProperty('opacity', '1', 'important')` en ligne (ce qui, en
CSS standard, gagne toujours face à n'importe quelle règle de feuille de
style, layers ou non) et même après plusieurs secondes d'attente réelle et
un `IntersectionObserver`/`waitForFunction` en poll actif. Plusieurs
hypothèses éliminées une à une avant de conclure à un artefact de l'outil
d'automatisation plutôt qu'à un bug réel :
- Pas un problème de cascade Tailwind v4 (`CSS.getMatchedStylesForNode` via
  CDP confirme que la règle `.history-reveal.is-visible` est bien celle qui
  matche avec la spécificité la plus haute).
- Pas `prefers-reduced-motion` actif par défaut en headless
  (`window.matchMedia(...).matches` confirmé `false`).
- Pas un souci de chargement des polices Google Fonts en sandbox sans accès
  réseau (`document.fonts.status` confirmé `"loaded"` même avec les
  requêtes vers `fonts.googleapis.com` explicitement bloquées).
- Un cas isolé minimal (juste `<div class="box">` + 2 règles CSS + un
  script qui ajoute la classe) reproduit exactement le même pattern et
  fonctionne correctement dans le même environnement — donc le mécanisme
  CSS lui-même n'est pas en cause.
- **Test décisif** : injecter la classe `is-visible` directement dans le
  HTML généré par `npm run build` (donc présente dès le chargement, sans
  aucune mutation JS après coup) donne `getComputedStyle(...).opacity ===
  "1"` de façon fiable. Ceci prouve que la règle CSS et sa spécificité sont
  correctes ; seule la lecture d'un style **après une mutation DOM en
  cours de session** semble se figer sur cette page précise dans cet
  environnement Playwright + Edge headless (`--no-sandbox`) — un problème
  d'outillage de vérification, pas du code livré. La mutation elle-même
  (l'ajout réel de la classe par le script) a été confirmée correcte à
  chaque test (`el.className` contenait bien `is-visible` après coup).

Étant donné cette limite d'outillage (déjà dans l'esprit des limites Edge
headless déjà documentées sur ce projet, mais plus profonde ici), le
comportement au scroll dans un vrai navigateur n'a **pas pu être confirmé
visuellement en session** — seule la mécanique CSS/JS a été validée
indirectement (cascade confirmée par CDP, mutation de classe confirmée,
repli `prefers-reduced-motion` confirmé à 100% fiable sur les mêmes
éléments). Revérifié via `npm run build` (71 pages, aucune erreur) après
nettoyage des fichiers de test temporaires et d'une installation temporaire
de `playwright-core` (`--no-save`, désinstallée après coup).

### Refonte "Notre histoire" en timeline verticale zigzag (2026-08-27)

Remplacement complet de la mise en page interactive (liste d'années
cliquable + un seul jalon affiché à la fois) par une timeline verticale
statique où les 4 jalons sont visibles simultanément, sur le modèle d'une
maquette "She Code Africa" fournie en pièce jointe directe dans le message
de la commande : ligne verticale continue au centre avec puce ronde par
jalon, année + titre + description alignés sur la puce, et des cartes photo
(badge année + légende en overlay bas) disposées en zigzag gauche/droite de
part et d'autre de la ligne.

Implémentation en grille CSS 3 colonnes (`grid-cols-[1fr_2fr_1fr]`) : à
chaque itération sur `historyMilestones`, 3 cellules sont émises dans
l'ordre (photo gauche, jalon central, photo droite) — seule la cellule
correspondant à la parité de l'index contient réellement une carte photo
(pairs à gauche, impairs à droite), l'autre reste vide, ce qui garantit
l'alignement vertical photo/texte sans JS ni mesure manuelle (les 3 cellules
d'une même itération partagent la même ligne de grille). La ligne verticale
et la puce sont positionnées en absolu dans le conteneur du jalon central
(`position: relative`), `bottom-0` sur la ligne s'étend automatiquement
jusqu'au bas de la ligne de grille — donc jusqu'à la puce suivante — même
quand une rangée est étirée en hauteur par une photo plus grande que le
texte (comportement par défaut `align-items: stretch` de CSS Grid).

Les photos et leur alt sont réutilisées telles quelles depuis l'ancienne
version interactive (aucune nouvelle image, toujours les 4 mêmes photos
réelles de membres PossaCode). Sur mobile (`<md`), les colonnes photo sont
masquées (`hidden md:flex`) et seule la timeline texte reste affichée — pas
d'équivalent mobile dans la maquette source, traitement choisi pour éviter
une mise en page à 3 colonnes illisible sur petit écran plutôt que de
forcer un empilement complexe. Ancien script d'interactivité (clic sur une
année/un point de pagination pour changer le jalon affiché) entièrement
supprimé du bloc `<script>` d'`about.astro`, devenu obsolète puisque tous
les jalons sont maintenant visibles en permanence.

Vérifié via `npm run build` (71 pages, aucune erreur) et une vraie session
Playwright (`playwright-core` temporaire, `--no-save`, désinstallé après
coup) : aucun overflow horizontal (`scrollWidth` === `innerWidth`) à
390/768/1440px, cartes photo bien masquées sous 768px (`offsetParent` nul)
et bien visibles à 768px/1440px. Captures d'écran Edge headless confirmant
visuellement le rendu en zigzag (2023/2025 à gauche, 2024/2026 à droite)
fidèle à la maquette de référence, ligne de connexion continue entre les 4
puces.

### Harmonisation taille des titres de section — page A-propos (2026-08-26)

Demande utilisateur (capture d'écran de la homepage à l'appui, titres "Ils
nous font confiance" et "Qui sommes-nous ?") : tous les titres de section de
`about.astro` doivent avoir la même taille et le même style que ceux de la
homepage. Audit : la homepage utilise `text-3xl md:text-5xl font-Phudu
font-bold` pour ses titres de section, alors que les 3 titres de section
d'`about.astro` ("Ces partenaires qui croient en nous", "Notre Vision,
Mission & Valeurs", "Notre histoire") étaient restés à `md:text-4xl` — un
cran en dessous — depuis leur création. Uniformisé les 3 en `md:text-5xl`
(remplacement global de la classe, texte/couleur/wave-line inchangés). Le
`<h1>` du hero de la page (bannière photo pleine largeur, structure
différente des titres de section) volontairement laissé à sa taille propre
(`lg:text-6xl`) — la demande et la capture fournie visaient les titres de
section, pas ce hero distinct.

Effet secondaire accepté : à 768px, le titre "Notre Vision, Mission &
Valeurs" passe de 1 à 3 lignes dans sa colonne (plus étroite qu'un titre
centré pleine largeur) — pas d'overflow ni de rendu cassé, juste plus de
hauteur, tradeoff direct de l'agrandissement demandé.

Vérifié via `npm run build` (71 pages, aucune erreur), captures d'écran Edge
headless à 390/768/1440px, et une vraie session Playwright
(`playwright-core` temporaire, `--no-save`, désinstallé après coup) confirmant
`scrollWidth` === `innerWidth` aux 3 largeurs (aucun overflow horizontal
introduit par l'agrandissement des titres).

### Ajustements section "Notre histoire" (2026-08-26)

Deux retouches demandées par l'utilisateur juste après l'implémentation
initiale (voir entrée suivante) :
1. **Position** : la section a été déplacée après "Notre Vision, Mission &
   Valeurs" (initialement placée juste après le bandeau photo communauté,
   avant la section partenaires). Simple déplacement du bloc `<section>`
   dans `about.astro`, aucune donnée modifiée.
2. **Plage d'années** : réduite de 7 jalons (2020-2026) à 4 (2023-2026), sur
   demande explicite ("Notre histoire démarre à partir de 2023"). Les
   jalons 2020-2022 (naissance, ateliers de formation, partenariats) ont
   été retirés ; celui de 2023 reprend le texte "Naissance de PossaCode"
   initialement associé à 2020. Les jalons 2024 (premier hackathon) et 2025
   (1000 personnes impactées, aligné sur le stat du hero) ont été décalés
   d'un an ; 2026 ("PossaCode aujourd'hui") inchangé. Toujours des
   **placeholders temporaires** (voir décision utilisateur documentée dans
   l'entrée suivante) — seule la chronologie a changé, pas le principe.

Revérifié via `npm run build` (71 pages, aucune erreur) et capture d'écran
Edge headless à 1440px confirmant le nouvel ordre des sections (Vision/
Mission/Valeurs puis Notre histoire) et les 4 années affichées (2023 à
2026, 2026 actif par défaut).

### Section "Notre histoire" — timeline page A-propos (2026-08-26)

Nouvelle section sur `src/pages/about.astro`, entre le bandeau photo
communauté et la section partenaires, inspirée d'une maquette "Notre
histoire" (timeline façon Thiga : liste d'années à gauche, année active en
grand + titre + description au centre, photo à droite avec pagination en
points) fournie en pièce jointe directe dans le message de la commande —
pas trouvée dans `context/screenshot/` (qui ne contient que
`a1-youth-skills_0.webp`/`hero.png`/`image.png`, déjà utilisées ailleurs,
vérifié avant implémentation, même schéma déjà rencontré sur cette page).

Contrairement aux données de membres (où des placeholders fictifs sont déjà
utilisés ailleurs sur ce projet pour des identités décoratives), une section
"Notre histoire" présente des faits organisationnels réels (dates, jalons de
l'association) — question posée à l'utilisateur avant d'inventer quoi que ce
soit. Réponse : utiliser des **jalons placeholder temporaires**, clairement
marqués comme tels. Tableau `historyMilestones` (7 entrées, 2020-2026) créé
dans le frontmatter d'`about.astro` avec un commentaire "à remplacer avant
mise en production" — même limite déjà documentée pour `experts.ts` et
`members-directory.ts`. Les deux derniers jalons (2024 "1000 personnes
impactées", 2026 "80+ membres actifs") réutilisent volontairement les
chiffres déjà affichés dans le bandeau de stats du hero de cette page, pour
rester cohérent avec les données déjà communiquées ailleurs sur le site
plutôt que d'inventer des chiffres contradictoires.

Photo par jalon : les 7 images utilisées (`heri.jpg`, `ca.jpg`, `A3.jpg`,
`NOUS.jpg`, `engroupe.jpg`, `coworking.webp`, `groupe.jpg`) sont toutes de
vraies photos de membres PossaCode (t-shirts/logo de l'association visibles
sur plusieurs) déjà présentes dans `public/assets/` — `heri.jpg` et `ca.jpg`
n'étaient utilisées nulle part ailleurs sur le site (vérifié par recherche
dans tout `src/`), les 5 autres sont réutilisées depuis d'autres sections
déjà vérifiées. Plusieurs fichiers inutilisés du dossier `assets/` ont été
écartés après inspection visuelle : `webi.png` (capture d'écran d'un appel
Google Meet, hors sujet), `new2.png` (photo à fond transparent au style
stock/catalogue, provenance non vérifiée), `femmecode - Copie.jpg` et
`maxresdefault - Copie.jpg` (le nom "maxresdefault" trahit une miniature
YouTube récupérée en ligne, pas une photo PossaCode — même type de risque
que l'incident Vecteezy déjà rencontré sur cette page) et
`POSSACODE DEVDAY JUIN.png` (affiche promotionnelle d'événement, pas une
photo brute, même principe déjà appliqué à `IMG_1379.JPG` sur la section
Vision/Mission/Valeurs).

Interaction (changement de jalon au clic sur une année ou un point de
pagination) en JS vanilla, même pattern que l'accordéon Vision/Mission/
Valeurs de cette page : chaque bouton d'année porte les données du jalon en
attributs `data-*` (`data-year`, `data-title`, `data-description`,
`data-image`, `data-alt`), un seul script met à jour le grand chiffre
d'année, le titre, la description, la source/alt de la photo, et l'état actif
des boutons d'année et des points de pagination — pas de scan JIT Tailwind à
risque (aucune classe interpolée par template literal, retoggle de classes
littérales déjà présentes dans le bundle CSS).

Vérifié via `npm run build` (71 pages, aucune erreur) et une vraie session
Playwright (`playwright-core` installé temporairement en local avec
`--no-save`, piloté via Edge installé sur la machine — MCP Playwright non
connecté dans cette session ; package désinstallé après vérification, aucune
trace dans `package.json`/`git status`) : aucun overflow horizontal
(`scrollWidth` === `innerWidth`) à 390px/768px/1440px, clic sur l'année 2020
met à jour correctement l'année/titre/photo affichés et l'état actif (année
+ point de pagination), clic sur un point de pagination (index 3 → 2023)
fait de même, `naturalWidth`/`naturalHeight` de la photo affichée confirmés
non nuls (chargement réussi). L'artefact de rendu Edge headless legacy qui
coupe le bord droit à 390px (déjà documenté sur ce projet) était visible sur
une capture ponctuelle mais écarté comme faux positif grâce à cette mesure
réelle en session Playwright.

### Remplacement de la photo du bandeau communauté (2026-08-25)

Suite : l'utilisateur a fourni une troisième image (groupe de 4 jeunes
souriants autour d'un ordinateur portable, en extérieur) pour remplacer
`groupe.jpg` dans le bandeau ajouté juste avant. Cette fois déposée dans
`context/screenshot/a1-youth-skills_0.webp` — vérifiée avant utilisation
(contrairement au fichier Vecteezy précédent) : aucun filigrane visible,
nom de fichier sans indice de photo stock non payée. Copiée vers
`public/assets/coworking.webp` (nouveau nom, l'original de
`context/screenshot/` n'étant pas destiné à être servi tel quel) et
référencée dans `about.astro` à la place de `groupe.jpg`. Format déjà
proche d'une bannière large (1300×535, ratio ~2.4:1) donc `object-center`
plutôt que `object-top` (utilisé pour `groupe.jpg`, où les visages étaient
groupés en haut du cadre) suffit à garder les visages visibles au
recadrage.

Vérifié via `npm run build` (71 pages, aucune erreur) et une vraie session
Playwright (MCP connecté) sur `localhost:4321/about` à 1440px et 390px :
image chargée (`naturalWidth`/`naturalHeight` non nuls), aucun overflow
horizontal aux deux largeurs, captures d'écran confirmant le rendu (visages
et ordinateur portable bien visibles, aucun recadrage disgracieux).

### Bandeau photo communauté — entre hero et partenaires, page A-propos (2026-08-24)

Demande utilisateur : ajouter une bande photo large (façon bannière
horizontale courte) entre le hero et la section partenaires
d'`about.astro`, sur le modèle d'une image de référence fournie en pièce
jointe (groupe de lycéennes souriantes faisant des signes de victoire).

Deux images candidates proposées par l'utilisateur en cours de route
n'étaient pas exploitables :
1. Une image collée directement dans le chat — pas de mécanisme
   disponible pour récupérer un fichier binaire collé en conversation et
   l'enregistrer sur disque (vérifié : aucun fichier récent trouvé dans
   les dossiers temporaires courants). Question posée à l'utilisateur.
2. Un fichier ensuite déposé dans `context/screenshot/` — repéré comme
   une photo stock Vecteezy non achetée (nom de fichier avec ID Vecteezy
   `10418142...`, filigrane "Vecteezy" visible sur toute l'image). Publier
   ce fichier tel quel sur le vrai site aurait laissé le filigrane visible
   partout et posé un problème de droit d'usage — signalé à l'utilisateur
   plutôt qu'utilisé silencieusement.

Décision finale de l'utilisateur (question posée) : garder `groupe.jpg`
(déjà dans `public/assets/`, vraie photo de membres PossaCode réunis,
utilisée par ailleurs sur la homepage) plutôt que d'attendre une image
sous licence. Nouvelle section `<section class="w-full h-40 sm:h-52
md:h-64 lg:h-72 overflow-hidden">` avec `object-cover object-top` pour
obtenir l'effet bannière large et courte de la maquette (photo 6000×4000
recadrée en bande horizontale, visages en haut de l'image conservés
visibles). Placée entre le bandeau de statistiques du hero et la section
partenaires.

Vérifié via `npm run build` (71 pages, aucune erreur) et une vraie
session Playwright (MCP connecté) sur `localhost:4321/about` :
`naturalWidth`/`naturalHeight` de l'image confirmés non nuls (chargement
réussi), section pleine largeur (`x: 0`, largeur ≈ largeur de la
fenêtre), aucun overflow horizontal (`scrollWidth` ≤ `innerWidth`),
capture d'écran (`animations: 'disabled'` pour contourner l'attente
infinie de Playwright sur le marquee de la section suivante) confirmant
le rendu bannière.

### Marquee auto-défilant appliqué à la section partenaires — homepage (2026-08-24)

Demande utilisateur : appliquer à la section "Ils nous font confiance" de
la homepage (`src/pages/index.astro`) le même traitement que la section
partenaires d'`about.astro` (marquee auto-défilant), avec les mêmes
partenaires — les deux sections listaient déjà exactement les 7 mêmes
logos avant ce changement (suite à l'alignement fait juste avant sur
`about.astro`), donc le travail portait uniquement sur le comportement
(ligne statique en grille → une seule ligne qui défile).

Repris tel quel le pattern `.logo-marquee`/`.logo-marquee-track` +
tableau `partnerLogos` déjà en place sur `about.astro` (deux groupes flex
dupliqués, le second `aria-hidden`, animation `translateX(-50%)` en
boucle, pause au survol/focus, `prefers-reduced-motion` respecté) —
copié dans le frontmatter et le markup d'`index.astro` sans dupliquer la
logique CSS (déjà globale dans `src/styles/global.css`, réutilisée par les
deux pages). Titre "Ils nous font confiance" (orange, centré, sans
wave-line) laissé inchangé — seule la ligne de logos en dessous a été
convertie, hors périmètre de la demande de retoucher le titre.

Vérifié via `npm run build` (71 pages, aucune erreur) et une vraie session
Playwright (MCP connecté, pas de captures ponctuelles) sur
`localhost:4321/` : 7 logos dans le groupe visible (identiques à
`about.astro`), deux groupes dupliqués de largeur égale (boucle sans
saut), `transform: translateX(...)` progressant sur 2,5s réelles
(`-1269px` → `-1401px`), pause confirmée au survol réel
(`animation-play-state: paused`), `prefers-reduced-motion: reduce`
émulé (animation à `none`, groupe dupliqué à `display: none`), aucun
overflow horizontal à 390px, capture d'écran (`animations: 'disabled'`
pour contourner l'attente infinie de Playwright sur une animation en
boucle) confirmant la même ligne de 7 logos que sur `about.astro`.

### Alignement des logos partenaires sur la homepage — page A-propos (2026-08-24)

Demande utilisateur : la section partenaires d'`about.astro` ne doit
afficher que les mêmes logos que la section "Ils nous font confiance" de
la homepage (`src/pages/index.astro`), pas les 4 logos supplémentaires
(`devcast.png`, `j2code.png`, `possatech_solutions_logo_couleur.png`,
`sfa.jpg`) ajoutés lors de la création de la section — retirés du tableau
`partnerLogos` dans `about.astro`, qui contient maintenant exactement les
7 mêmes partenaires que la homepage (CGDT, ACDN, GalsenDev, UnionLab,
Miabé Hackathon, 10000 Codeurs, Congo DevOps).

Revérifié via `npm run build` (71 pages, aucune erreur) et une vraie
session Playwright (MCP connecté) : `logoCount` = 7 dans le groupe visible
du marquee, largeurs des deux groupes dupliqués toujours identiques (donc
la boucle à 50% reste sans saut après suppression des 4 logos), animation
toujours `running`, aucun overflow horizontal (`scrollWidth` ≤
`innerWidth`), capture d'écran confirmant les 7 logos sur une seule ligne.
**Point technique noté en cours de vérification** : la méthode
`page.screenshot()` de Playwright attend par défaut la fin de toute
animation CSS avant de capturer, ce qui bloque indéfiniment sur un
marquee en boucle infinie (`animation-iteration-count: infinite`) — capture
refaite avec l'option `animations: 'disabled'` pour contourner ce blocage.

### Marquee auto-défilant — section partenaires page A-propos (2026-08-24)

Suite à la section précédente (logos en grille `flex-wrap` sur 2 lignes),
demande utilisateur de repasser sur une seule ligne qui défile
horizontalement en continu — plus proche de la maquette d'origine "Brands
that believe in our vision" que le rendu en grille statique. Implémenté en
CSS pur (`src/styles/global.css`, classes `.logo-marquee`/
`.logo-marquee-track` + `@keyframes logoMarquee`), pas de librairie de
carrousel, cohérent avec les contraintes du projet ("Ne pas introduire
d'autres librairies d'animation").

Technique du marquee sans saut visible : les 11 logos sont dupliqués dans
deux groupes flex identiques (le deuxième `aria-hidden="true"`, `alt=""`,
pour ne pas dupliquer l'annonce aux lecteurs d'écran), animation
`translateX(-50%)` en boucle infinie — comme les deux groupes ont
exactement la même largeur, le décalage de 50% ramène le deuxième groupe
pile à la position de départ du premier, sans saut. Pause au survol/focus
clavier (`:hover`/`:focus-within`) pour laisser le temps de lire un logo.
`prefers-reduced-motion: reduce` coupe l'animation et masque le groupe
dupliqué (même garde-fou déjà en place pour `.wave-line`), pour ne pas
laisser un utilisateur avec cette préférence face à deux jeux de logos
figés côte à côte. Dégradé de masquage (`mask-image`) sur les bords gauche/
droit du conteneur pour un fondu propre à l'entrée/sortie plutôt qu'une
coupe nette.

Logos extraits en tableau `partnerLogos` dans le frontmatter d'`about.astro`
(classes de taille par logo dans le tableau, même pattern déjà utilisé pour
`members-preview.ts` — vérifié que le scanner JIT Tailwind résout bien ces
classes littérales dans un tableau JS, contrairement au bug déjà rencontré
avec des template literals interpolés) pour éviter de dupliquer 11 balises
`<img>` à la main dans les deux groupes.

Vérifié via `npm run build` (71 pages, aucune erreur), inspection du CSS
compilé (`logoMarquee`, classes de taille dynamiques bien générées), et
captures d'écran Edge headless sur serveur de dev réel confirmant une seule
ligne de logos avec effet de fondu aux bords et position de défilement déjà
avancée au moment de la capture (preuve que l'animation tourne).

MCP Playwright s'est reconnecté plus tard dans la session : revérifié avec
une vraie session CDP persistante (pas des captures ponctuelles) sur
`localhost:4321/about`, ce qui a permis de confirmer, cette fois par
interaction réelle en navigateur plutôt que par lecture de code :
- `transform: translateX(...)` relevé deux fois à 3s d'intervalle réel
  (`-2127px` → `-146px`) : progression continue à la vitesse attendue
  (largeur d'un groupe ÷ durée = 2220px ÷ 28s ≈ 79px/s), avec un
  rebouclage cohérent (`-2127 - 3·79 ≈ -2365`, ramené à `-145` après un
  tour de boucle) — la technique de duplication à 50% fonctionne
  réellement, pas seulement sur le papier.
- Survol réel (`locator.hover()`, pas un événement de souris synthétique
  — un premier essai avec `dispatchEvent(MouseEvent)` ne déclenchait pas
  `:hover`, seul un vrai déplacement de curseur Playwright le fait) :
  `animation-play-state` passe à `paused` pendant le survol du conteneur,
  revient à `running` une fois le curseur déplacé ailleurs.
- `prefers-reduced-motion: reduce` émulé via `page.emulateMedia()` :
  `animationName` devient `none`, le second groupe (dupliqué,
  `aria-hidden`) passe à `display: none`, largeur du track = largeur d'un
  seul groupe (aucun résidu de largeur ni logo coupé).
- 390px (mobile réel, pas Edge headless) : `document.documentElement.
  scrollWidth` (375px) ≤ `window.innerWidth` (390px), aucun overflow
  horizontal ; capture d'écran confirmant une seule ligne, aucun retour à
  la ligne.

**Ancienne limite de ce projet levée pour cette vérification** (MCP
Playwright était indisponible dans les sessions précédentes ayant travaillé
sur cette page) : la méthode de vérification par captures d'écran
ponctuelles décrite plus haut est donc remplacée ici par une vérification
en temps réel, plus fiable pour ce type de comportement (animation
continue, pause au survol).

### Section "Ces partenaires qui croient en nous" — page A-propos (2026-08-24)

Nouvelle section sur `src/pages/about.astro`, insérée entre le hero et la
section Vision/Mission/Valeurs, inspirée d'une maquette "Brands that believe
in our vision" fournie en pièce jointe directe dans le message de la commande
(bandeau défilant de logos de marques : Give Internet, Microsoft, nguvu,
Treford, TUNGA, Google, Zendesk, etc.). Ces marques ne sont pas de vrais
partenaires de PossaCode — la maquette ne servait que de référence de mise
en page — donc plutôt que de fabriquer une fausse liste de partenaires,
réutilisé le même titre `font-Phudu` + `wave-line` et le même pattern de
rangée de logos (`flex flex-wrap justify-center`, `object-contain`) déjà
utilisé et vérifié pour la section "Ils nous font confiance" de la homepage
(`src/pages/index.astro`).

Audit de `public/assets/par/` : 11 logos réels au total, dont seulement 7
déjà affichés sur la homepage (`cgdt`, ACDN, galsendev, unionlab, Congo
DevOps, Miabé Hackathon, 10000 Codeurs). 4 logos existaient dans le repo
sans être utilisés nulle part (`devcast.png`, `j2code.png`,
`possatech_solutions_logo_couleur.png`, `sfa.jpg`) — vérifié via recherche
dans tout `src/` avant de les considérer disponibles. Les 11 sont utilisés
ici, donnant à cette section un contenu réel plus complet que la homepage
plutôt qu'une simple duplication. Logo Congo DevOps réutilisé via le même
composant `<Image>` optimisé (`astro:assets`, `densities={[1,2]}`,
`format="webp"`) déjà en place sur la homepage, pas de nouvelle image
statique ajoutée. Alt text descriptif ajouté sur chaque logo (nom du
partenaire) — la homepage avait des `alt=""` vides, corrigé ici sans
toucher à la homepage (hors périmètre de la demande).

Vérifié via `npm run build` (71 pages, aucune erreur) et captures d'écran
Edge headless à 1440px/768px sur serveur de dev réel (MCP Playwright
indisponible dans la session, limite déjà documentée sur ce projet) :
section bien positionnée avant Vision/Mission/Valeurs, titre et wave-line
cohérents avec le reste de la page, logos wrap proprement sans overflow aux
deux largeurs.

### Refonte section Vision/Mission/Valeurs en accordéon + mosaïque — page A-propos (2026-08-24)

Remplacement complet de la section Vision/Mission/Valeurs de
`src/pages/about.astro` (bannière photo + panneau diagonal, ajoutée plus tôt
dans la journée) par une mise en page à deux colonnes inspirée d'une
maquette "Notre manifeste" (façon cabinet de conseil) fournie en pièce
jointe directe dans le message de la commande — pas dans
`context/screenshot/` (vérifié avant implémentation, comme pour les
features précédentes de cette page).

Colonne gauche : titre + intro, puis accordéon de 3 items (Notre vision /
Notre mission / Nos valeurs, texte repris à l'identique de l'ancienne
version, aucune réécriture), un seul item ouvert à la fois. La maquette
source avait 5 items propres à un cabinet de conseil ; gardé à 3 pour coller
aux concepts réels de PossaCode plutôt que d'inventer 2 items supplémentaires
pour matcher le nombre de la source.

Colonne droite : mosaïque 2 colonnes × 3 lignes mêlant 2 photos réelles
(`NOUS.jpg`, `engroupe.jpg`) et 3 panneaux de couleur (un par item de
l'accordéon), synchronisés en JS vanilla avec l'accordéon (anneau orange +
léger zoom sur le panneau actif) — même pattern `<script>` que le filtrage
par onglets de `members.astro`. Couleurs adaptées à la charte PossaCode
(`blue-possacode`/`orange-possacode`) à la place du bordeaux/magenta de la
source.

Deux ajustements faits après premier rendu :
1. Le choix initial de `IMG_1379.JPG` pour une case de la mosaïque s'est
   avéré être une affiche promotionnelle de webinaire (pas une photo de
   communauté) — repéré visuellement via capture d'écran, remplacé par
   `NOUS.jpg`.
2. Le texte descriptif dans les panneaux débordait de leur case à 768px
   (hauteur fixe de la grille mosaïque, texte trop long) — raccourci en
   phrases courtes (2-3 mots) et ajout de `line-clamp-2` en filet de
   sécurité.

Vérifié via `npm run build` (71 pages, aucune erreur), inspection du CSS
compilé (classes Tailwind dynamiques du script de toggle bien générées), et
captures d'écran Edge headless à 1440px/768px/390px sur serveur de dev réel
(MCP Playwright indisponible dans la session, limite déjà documentée sur ce
projet). **Limite** : le comportement interactif au clic (bascule accordéon
+ surbrillance du panneau correspondant) a été vérifié par relecture
attentive du code JS plutôt qu'en interaction réelle en navigateur — aucun
outil d'automatisation de clic n'était disponible dans la session
(playwright-core/puppeteer non installés, MCP Playwright indisponible) ; le
rendu de l'état initial ("Vision" ouvert) a en revanche été confirmé
visuellement.

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

### Carrousel du bandeau de portraits membres (2026-08-24)

Transformation du bandeau statique de portraits de la section héro "Nos
Membres" (`src/pages/members.astro`) en carrousel, plus ajout d'une section
équivalente sur la page d'accueil — nouveau composant réutilisable
`src/components/MemberCarousel.astro` (scroll-snap horizontal, flèches
précédent/suivant, points de pagination, auto-play doux avec pause au
survol/focus/tactile, `prefers-reduced-motion` respecté), en JS vanilla
uniquement (pas de librairie de carrousel, conforme aux contraintes du
projet). Les deux captures d'écran fournies par l'utilisateur au départ
montraient en fait le même bandeau déjà existant sur `members.astro` (photos
et données confirmées via `members-preview.ts`) — pas une section homepage
déjà là — donc la demande "de même sur la page d'accueil" a été traitée comme
l'ajout d'une nouvelle section, placée après la section "experts".

Deux bugs réels trouvés et corrigés après premiers rendus, tous deux
introuvables par simple lecture du code ou capture d'écran statique :

1. **Auto-défilement qui se bloquait après 2-3 cycles** (signalé par
   l'utilisateur : "le carrousel doit défiler automatiquement"). Cause :
   l'auto-play calculait "la carte suivante" via un compteur d'index
   mémorisé, mais la dernière carte ne peut pas toujours atteindre le bord
   gauche du carrousel (le navigateur limite le scroll à
   `scrollWidth - clientWidth`) — deux appels consécutifs pouvaient donc
   redemander la même position déjà atteinte : aucun scroll réel, aucun
   évènement `scroll`, plus aucune progression (interverrouillage
   permanent). Confirmé en observant `scrollLeft` figé pendant 15s+ en
   direct via le Chrome DevTools Protocol (CDP) plutôt que par supposition
   (mouvement de souris, timing d'observation). Corrigé en supprimant tout
   compteur mémorisé : la carte "active" est toujours recalculée depuis la
   position de scroll réelle, et la bascule de fin de course compare
   `scrollLeft` à `scrollWidth - clientWidth` directement. **Méthode de
   vérification notable pour ce projet** : `--virtual-time-budget` d'Edge
   headless n'accélère pas fidèlement les animations de scroll fluide
   pilotées par le compositeur (résultats trompeurs) — la vérification
   fiable d'un comportement qui dépend du temps réel (auto-play, timers)
   nécessite une session CDP persistante avec de vraies attentes en temps
   réel, pas des captures d'écran horodatées.
2. **Taille de carte réduite par rapport à l'original** (signalé par
   l'utilisateur avec capture d'écran : "tu as réduis la taille des images
   et la hauteur"). Les largeurs choisies au départ étaient nettement plus
   larges que les proportions de l'ancien bandeau (`flex-1` sur 3/5/6 cartes
   visibles selon breakpoint), ce qui aplatissait visuellement la même
   hauteur fixe. Corrigé en `w-1/3 sm:w-1/5 md:w-1/6`, qui reproduit les
   proportions d'origine à chaque palier. Avec les cartes remises à leur
   taille d'origine, les 6 membres réels ne laissaient plus rien à faire
   défiler (6 visibles dès 768px) — complété avec 6 membres déjà générés
   dans `members-directory.ts` (avatar DiceBear, déjà dotés d'une page de
   profil valide) plutôt que de vraies photos internet (demandées par
   l'utilisateur en solution de repli) : ni faisable avec les outils
   disponibles (pas de téléchargement de fichier binaire), ni souhaitable
   (attribuerait le visage de vraies personnes à une identité fictive,
   risque déjà évité partout ailleurs sur ce projet). Nouvel export
   `membersCarousel` (12 membres) dans `members-preview.ts`, utilisé par les
   deux carrousels à la place de `membersPreview` (6, inchangé pour tout
   autre usage).

Revérifié après les deux correctifs sur 36 secondes réelles via CDP (12
cartes, progression continue puis retour à 0, aucun blocage), et captures
d'écran à 1440px/768px confirmant les proportions de carte identiques à
l'ancien bandeau. `npm run build` : 71 pages, aucune erreur à chaque étape.

### Bouton "Faire un don" du header rendu interactif (2026-08-27)

Le bouton "Faire un don" du header (`src/components/header.astro`), en
versions desktop et mobile, était un `<div>` sans `href`, sans `role`, sans
`tabindex` — ni focusable au clavier, ni reconnu comme lien par les
technologies d'assistance. Remplacé par un vrai `<a href="/donate">` aux deux
endroits (ligne ~20 desktop, ligne ~41 mobile), même route que le lien
"Faire un don" déjà utilisé dans `Footer.astro`, classes visuelles
existantes conservées à l'identique. Sur la version mobile, ajout de la
classe `block` en plus des classes existantes : un `<a>` est inline par
défaut (contrairement à l'ancien `<div>`, block par défaut), donc sans ce
changement `text-center` n'aurait centré le texte que dans la largeur
réduite du lien (shrink-to-fit) au lieu de toute la largeur du `<li>`.

Vérifié via une vraie session Playwright (`playwright-core` installé
temporairement en local avec `--no-save`, piloté via Edge installé sur la
machine — MCP Playwright non connecté dans cette session, désinstallé après
vérification, aucune trace dans `package.json`/`git status`) : test Tab
confirmant que le focus clavier atteint bien le lien desktop (6e appui sur
Tab depuis le haut de page), rôle accessible "link" confirmé via
`getByRole('link', { name: 'Faire un don' })` sur desktop (1440px) et mobile
(390px, menu ouvert), taille de la cible tactile mobile mesurée à 342×48px
(bien au-dessus du minimum de 44px déjà appliqué ailleurs sur ce projet).
`npm run build` : 71 pages, aucune erreur.

**Point technique noté en cours de vérification** : `page.goto(...,
{ waitUntil: 'networkidle' })` bloque indéfiniment sur le serveur de dev
Astro (le WebSocket HMR de Vite maintient une connexion réseau active en
permanence, donc l'état "réseau inactif" n'est jamais atteint) — remplacé
par `waitUntil: 'load'` pour toutes les navigations de vérification. De
même, `locator.click('#menu-toggle')` (qui attend que l'élément soit
visible/stable) a bloqué 30s sur une page où le bouton hamburger est
`md:hidden` (viewport desktop) ou lorsque plusieurs instances headless
tournaient déjà en parallèle (dizaines de processus `msedge.exe` résiduels
d'exécutions précédentes constatés via `tasklist`) — contourné avec un clic
déclenché directement en JS via `page.evaluate(() =>
document.getElementById('menu-toggle').click())`, qui n'attend aucune
condition de visibilité/stabilité.

Repéré au passage (hors périmètre de cette feature) : ce fichier
`context/current-feature.md` se terminait par une balise `</content>`
orpheline en toute fin de fichier — probablement un résidu d'un collage
antérieur, sans rapport avec le contenu réel — retirée à l'occasion de
cette mise à jour.

### Fix débordement horizontal 1024px — section "Qui sommes-nous ?" (2026-08-27)

Le paragraphe `<p class="w-120">` (`src/pages/index.astro:87`, dans la
grille desktop `grid-cols-[350px_350px_1fr]` de la section "Qui
sommes-nous ?") imposait une largeur fixe de 480px alors que sa colonne de
grille (le 1fr restant après les deux colonnes fixes de 350px et les gaps)
ne fait qu'environ 196-200px à 1024px (premier palier où cette grille
desktop devient visible, `hidden lg:grid`) : `scrollWidth` mesuré à 1268px
contre `innerWidth` 1024px avant correction. Remplacé `w-120` par
`max-w-120`, qui laisse le texte se redimensionner selon l'espace
disponible dans sa colonne au lieu d'imposer 480px fixes, tout en
conservant cette largeur maximale de 480px dès que la colonne est assez
large (≥1440px).

Vérifié via une vraie session Playwright (`playwright-core` installé
temporairement en local avec `--no-save`, piloté via Edge installé sur la
machine — MCP Playwright non connecté dans cette session, désinstallé
après vérification, aucune trace dans `package.json`/`git status`) à 4
largeurs : 1024px (`scrollWidth` = `innerWidth` = 1024, contre 1268 avant
le correctif ; paragraphe mesuré à 200px de large, contraint par sa
colonne), 768px (grille desktop non affichée, `hidden lg:grid`, aucun
overflow), 1280px (paragraphe à 452px, dans sa colonne) et 1440px
(paragraphe à sa pleine largeur maximale de 480px). `npm run build` : 71
pages, aucune erreur.

### Fix hiérarchie de titres — page d'accueil (2026-08-27)

La page comptait 14 balises `<h1>` (`document.querySelectorAll('h1').length
=== 14`) : le titre du hero plus un `<h1>` par titre de section, cassant la
hiérarchie de titres attendue par les lecteurs d'écran et les moteurs de
recherche (un seul `<h1>` par page). Converti les 13 titres de section de
`src/pages/index.astro` (lignes 48, 71, 127, 139, 151, 167, 177, 192, 201,
210, 223, 254, 265) en `<h2>`, en ne touchant qu'au nom de la balise —
classes visuelles (taille, `font-Phudu`, couleur, `wave-line` associée)
inchangées sur chacun. Seul le titre du hero (ligne 23) reste en `<h1>`.

Trois de ces titres ("Comment utiliser tailwindcss dans un projet Astro ?",
répété pour chaque carte d'événement de la colonne de droite) étaient des
`<h1>` strictement identiques (même texte, mêmes classes) : désambiguïsés
lors de l'édition via l'image `<img>` précédente de chaque carte
(`maxresdefault - Copie.jpg`, `new1.jpg`, `femmecode - Copie.jpg`) plutôt
que par une modification en masse, pour ne convertir que l'occurrence
voulue à chaque fois.

Vérifié via une vraie session Playwright (`playwright-core` installé
temporairement en local avec `--no-save`, piloté via Edge installé sur la
machine — MCP Playwright non connecté dans cette session, désinstallé après
vérification, aucune trace dans `package.json`/`git status`) sur le serveur
de dev réel : `document.querySelectorAll('h1').length === 1` confirmé,
relevé de l'intégralité de la structure de titres de la page (`h1` à `h6`,
17 titres au total en comptant ceux du `Footer.astro` déjà en `<h2>`) et
audit programmatique de l'ordre des niveaux (logique de la règle axe-core
`heading-order` : aucun saut de niveau) — aucune violation. Capture d'écran
à 1440px confirmant l'absence de régression visuelle sur le hero et le
titre "Ils nous font confiance", et `scrollWidth === innerWidth` (aucun
overflow introduit). `npm run build` : 71 pages, aucune erreur.
