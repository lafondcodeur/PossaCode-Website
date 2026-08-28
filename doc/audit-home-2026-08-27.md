# Audit UI — Page d'accueil (`/`)

**Scope** : route unique `/` (`src/pages/index.astro`, via `src/layouts/Layout.astro`, `src/components/header.astro`, `src/components/Footer.astro`, `src/components/MemberCarousel.astro`)
**Date** : 2026-08-27
**URL cible** : http://localhost:4321/
**Serveur** : dev server déjà lancé par l'utilisateur (`npm run dev`, Astro, port 4321) — non redémarré, non arrêté par cet audit.
**Méthode** : session Playwright réelle (`playwright-core`, installé temporairement en local avec `--no-save`, désinstallé après l'audit), piloté via Microsoft Edge headless installé sur la machine (MCP Playwright non connecté dans cette session). axe-core 4.x injecté et exécuté avec `runOnly: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']`. Captures d'écran et mesures `getBoundingClientRect`/`getComputedStyle` à 375/768/1024/1440px. Aucun fichier applicatif modifié — seul ce rapport a été écrit.

---

## Résumé

| Route      | Critique | Sérieux | Modéré | Mineur | Statut   |
| ---------- | -------- | ------- | ------ | ------ | -------- |
| `/` (home) | 4        | 5       | 5      | 5      | **FAIL** |

Vérifications qui **passent** (à ne pas re-tester inutilement lors du prochain audit) : aucune image cassée (0 `naturalWidth === 0`), aucune réponse réseau ≥ 400, aucune erreur console/page, `html lang="fr"` correct, landmarks `header`/`nav`(x3)/`main`/`footer` tous présents, aucun overflow horizontal à 375/768/1440px, favicon servi avec succès (200) même si non déclaré en `<head>`.

---

## Findings — route `/`

### CRITIQUE

---

**C1 — Le bouton "Faire un don" du header n'est pas un élément interactif**

- **Catégorie** : a11y
- **Localisation** : `src/components/header.astro:20` (pastille desktop) et `src/components/header.astro:41` (menu mobile)
- **Preuve mesurée** : les deux éléments portant le texte "Faire un don" sont des `<div>` sans `href`, sans `role`, sans `tabindex` (`{"tag":"DIV","role":null,"tabindex":null}` — vérifié en évaluant le DOM réel). Résultat : inatteignable au clavier (`Tab`), invisible pour un lecteur d'écran comme cible interactive (pas de rôle `button`/`link`), et sans aucune action au clic. C'est le CTA "don" le plus visible du site (pastille orange toujours visible en desktop) et il ne fait rigoureusement rien.
- **Fix spec** :

```
/feature load Rendre le bouton "Faire un don" du header réellement interactif. src/components/header.astro lignes 20 et 41, actuellement <div> sans href/role/tabindex, doit être un vrai lien. Remplacer les deux <div class="...">Faire un don</div> par <a href="/donate" class="...">Faire un don</a> (même route que le lien "Faire un don" déjà utilisé dans le footer), en conservant les classes visuelles existantes, verifié avec un test Tab (focus atteint l'élément) et getComputedStyle du role implicite "link".
```

---

**C2 — Overflow horizontal à 1024px avec texte visuellement coupé (section "Qui sommes-nous ?")**

- **Catégorie** : responsive
- **Localisation** : `src/pages/index.astro:87`, `<p class="text-xl text-justify text-white font-nunito w-120">`
- **Preuve mesurée** : à 1024px, `document.documentElement.scrollWidth = 1268` contre `window.innerWidth = 1024` (244px de débordement, mesuré en session réelle). Capture d'écran (`screenshot-1024.png`) confirme visuellement le texte du paragraphe ("...la formation...", "...conférences...") coupé net sur le bord droit de la section bleue. Cause : la classe Tailwind `w-120` (480px fixes) sur ce paragraphe force la 3ᵉ colonne de la grille `grid-cols-[350px_350px_1fr]` (activée dès `lg:` = 1024px) à dépasser l'espace disponible (350+350+2×gap-6+480 > 1024 − padding). Aucun overflow à 375/768/1440px (vérifié, seul le palier 1024–~1279px est touché, avant que davantage d'espace ne soit disponible à `xl`).
- **Fix spec** :

```
/feature load Corriger le débordement horizontal à 1024px de la section "Qui sommes-nous ?". src/pages/index.astro ligne 87, <p class="w-120">, scrollWidth mesuré à 1268px contre innerWidth 1024px (244px au-dessus). Remplacer w-120 par max-w-120 (ou une largeur fluide type w-full lg:max-w-md) pour que le paragraphe puisse rétrécir dans sa colonne au lieu d'imposer 480px fixes, verifié avec document.documentElement.scrollWidth <= window.innerWidth a 1024px.
```

---

**C3 — 14 balises `<h1>` sur une seule page (une seule autorisée)**

- **Catégorie** : a11y
- **Localisation** : `src/pages/index.astro`, sections "Hero" (l.23), "Partenaires" (l.48), "Qui sommes-nous" (l.71), "Vision/Mission/Valeurs" (l.127/139/151), "Nos événements" (l.167 + 4× titres d'articles identiques l.177/192/201/210), "Experts" (l.223), "Membres" (l.254), "CTA finale" (l.265)
- **Preuve mesurée** : `document.querySelectorAll('h1')` retourne 14 éléments (liste complète capturée). La structure de titres passe directement de 14×H1 à des H2 (footer), sans aucun H2/H3 intermédiaire pour hiérarchiser les sections — un lecteur d'écran en navigation par titres (touche H) perçoit 14 titres de niveau 1 équivalents, sans hiérarchie de page exploitable.
- **Fix spec** :

```
/feature load Corriger la hiérarchie de titres de la page d'accueil. src/pages/index.astro, 14 balises h1 mesurées (document.querySelectorAll('h1').length === 14), doit être exactement 1. Garder un seul <h1> pour le titre du hero (ligne 23) et convertir tous les autres titres de section (lignes 48, 71, 127, 139, 151, 167, 177, 192, 201, 210, 223, 254, 265) en <h2>, en conservant les classes visuelles (taille, font-Phudu, wave-line) inchangees, verifié avec document.querySelectorAll('h1').length === 1 et un audit axe heading-order.
```

---

**C4 — 3 liens morts (`href=""`) sur des CTA principaux**

- **Catégorie** : content
- **Localisation** : `src/pages/index.astro:36` (hero "Nous Rejoindre"), `src/pages/index.astro:276` (CTA finale "Nous Rejoindre"), `src/pages/index.astro:277` (CTA finale "Faire un don")
- **Preuve mesurée** : scan DOM des `<a>` avec `href === ""` — 3 correspondances exactes, confirmées par axe (`.px-8.boutton-standard[href=""]` cité dans la violation `color-contrast` du nœud 13). Ces 3 liens sont les CTA les plus visibles du site (hero et section de conversion finale) et ne mènent nulle part (rechargement de la page courante).
- **Fix spec** :

```
/feature load Corriger les 3 liens morts href="" des CTA principaux. src/pages/index.astro lignes 36, 276 et 277, actuellement href="" (rechargement de la page courante). Pointer "Nous Rejoindre" vers /join et "Faire un don" vers /donate (memes routes deja utilisees dans le footer src/components/Footer.astro), verifié avec un scan DOM confirmant qu'aucun <a> n'a plus href="" sur la page.
```

---

### SÉRIEUX

---

**S1 — 14 nœuds en échec de contraste de texte (règle axe `color-contrast`, impact `serious`)**

- **Catégorie** : a11y
- **Localisation et preuve** (ratios mesurés par axe-core, seuil requis AA = 4.5:1 texte normal / 3:1 texte large ≥24px ou ≥18.66px gras) :
  | Élément | Ratio mesuré | Couleurs | Fichier |
  |---|---|---|---|
  | Bandeau "PossaCode Dev Girsl" (span orange) | **4.17:1** | `#f14d0e` sur `#1a2251`, 14px normal | `src/layouts/Layout.astro:29` |
  | Pastille "Faire un don" (header) | **3.61:1** | `#ffffff` sur `#f14d0e`, 16px normal | `src/components/header.astro:20` |
  | "Intégrer une communauté" (hero) | **3.32:1** | `#f14d0e` sur `#fff3ee`, 18px | `src/pages/index.astro:35` |
  | Bouton "Nous Rejoindre" (hero) | **3.61:1** | `#ffffff` sur `#f14d0e`, 16px gras | `src/pages/index.astro:36` |
  | Lien "En savoir plus..." (desktop) | **3.61:1** | `#ffffff` sur `#f14d0e`, 20px normal | `src/pages/index.astro:88` |
  | Paragraphe "Notre vision" | **4.17:1** | `#1a2251` sur `#f14d0e`, 16px | `src/pages/index.astro:132` |
  | Paragraphe "Notre mission" | **3.61:1** | `#ffffff` sur `#f14d0e`, 16px | `src/pages/index.astro:144` |
  | Paragraphe "Nos valeurs" | **4.17:1** | `#1a2251` sur `#f14d0e`, 16px | `src/pages/index.astro:156` |
  | Date "25 Mars 2026" (article vedette) | **3.61:1** | `#f14d0e` sur `#ffffff`, 18px | `src/pages/index.astro:176` |
  | Bouton "Participer" | **3.61:1** | `#ffffff` sur `#f14d0e`, 18px gras | `src/pages/index.astro:185` |
  | Date "25 Mars 2026" ×3 (liste d'articles) | **3.61:1** (×3) | `#f14d0e` sur `#ffffff`, 18px | `src/pages/index.astro:191,200,209` |
  | Bouton "Nous Rejoindre" (CTA finale) | **3.61:1** | `#ffffff` sur `#f14d0e`, 18px gras | `src/pages/index.astro:276` |

  Motif récurrent : tout texte blanc ou orange sur fond `orange-possacode`/blanc en dessous de 24px (ou 18.66px gras) tombe systématiquement autour de 3.3–4.2:1, sous le seuil AA de 4.5:1.

- **Fix spec** :

```
/feature load Corriger le motif recurrent de contraste insuffisant texte-sur-orange-possacode. 14 nœuds axe color-contrast (impact serious) mesures entre 3.32:1 et 4.17:1 sur src/pages/index.astro (lignes 35,36,88,132,144,156,176,185,191,200,209,276) et src/components/header.astro:20, tous sous le seuil AA 4.5:1 texte normal. Ajouter dans src/styles/global.css un token de texte fonce dedie aux fonds orange-possacode (ex. --color-orange-possacode-ink assombri) et l'appliquer aux boutons/paragraphes concernes au lieu de text-white/text-orange-possacode sur fond clair, verifié avec axe.run() ne remontant plus de violation color-contrast sur ces 14 nœuds.
```

---

**S2 — 12 puces de pagination du carrousel de membres sous la taille minimale (règle axe `target-size`, impact `serious`)**

- **Catégorie** : a11y / responsive
- **Localisation** : `src/components/MemberCarousel.astro:69`, `<button data-carousel-dot={i} class="w-2.5 h-2.5 ...">`
- **Preuve mesurée** : axe rapporte 12 nœuds (`button[data-carousel-dot="0"]` à `"11"`) à **10×10px**, sous le minimum WCAG 2.2 de 24×24px, avec un espace cliquable sûr mesuré à seulement 12px de diamètre au lieu de 24px minimum.
- **Fix spec** :

```
/feature load Agrandir les puces de pagination du carrousel de membres au minimum tactile WCAG 2.2. src/components/MemberCarousel.astro ligne 69, class="w-2.5 h-2.5" mesure 10x10px, sous le seuil de 24x24px. Garder le point visuel a w-2.5 h-2.5 mais l'envelopper dans une zone cliquable min-w-6 min-h-6 flex items-center justify-center (ou ajouter un padding invisible sur le bouton lui-meme), verifié avec un audit axe target-size ne remontant plus de violation sur [data-carousel-dot].
```

---

**S3 — Texte "Lorem ipsum" laissé en production**

- **Catégorie** : content
- **Localisation** : `src/pages/index.astro:181-184`
- **Preuve** : `"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta, consectetur vel. Voluptatem, expedita architecto eligendi laborum fugiat illo molestias ullam, molestiae repellendus consectetur, ad culpa animi cupiditate provident quae non."` — texte de remplissage latin visible tel quel dans l'extrait de l'article vedette de la section "Nos événements".
- **Fix spec** :

```
/feature load Remplacer le texte Lorem ipsum de l'extrait d'article evenement par un vrai resume. src/pages/index.astro lignes 181-184, contient actuellement du texte de remplissage latin visible en production. Ecrire 2-3 phrases reelles decrivant l'evenement "Comment utiliser tailwindcss dans un projet Astro ?" (ou masquer la section si aucun evenement reel n'est confirme, meme principe deja applique a la section "experts"), verifié par relecture visuelle du texte affiché.
```

---

**S4 — Bloc dupliqué : même titre et même date répétés 4 fois dans "Nos événements"**

- **Catégorie** : content
- **Localisation** : `src/pages/index.astro:176-214`
- **Preuve** : les 4 cartes de la section "Nos événements" (1 vedette + 3 en liste) affichent toutes exactement le même titre `"Comment utiliser tailwindcss dans un projet Astro ?"` et la même date `"25 Mars 2026"`, avec seulement l'image qui change. Un visiteur ou un moteur de recherche ne peut pas distinguer ces 4 entrées d'un même événement dupliqué par erreur.
- **Fix spec** :

```
/feature load Différencier les 4 cartes evenement dupliquees de la section "Nos evenements". src/pages/index.astro lignes 176-214, 4 cartes avec titre et date identiques ("Comment utiliser tailwindcss dans un projet Astro ?" / "25 Mars 2026"). Remplacer par 4 evenements reels distincts (ou reduire a 1 seul evenement reel si aucun autre n'est confirme, plutot que dupliquer un placeholder), verifié par relecture visuelle confirmant 4 titres/dates distincts.
```

---

**S5 — Collision header/nav à 768px : "A-propos" se replie sur 2 lignes collé au logo**

- **Catégorie** : responsive / visual
- **Localisation** : `src/components/header.astro:6` (conteneur flex `justify-between` sans `gap`), lien `src/components/header.astro:12`
- **Preuve mesurée** (`getBoundingClientRect` à 768px) : le logo se termine à `x = 179px` (`x:40, w:139`) et le lien "A-propos" commence exactement à `x = 179px` — **0px d'espace**. La hauteur mesurée du lien "A-propos" est de 45px pour un texte normalement sur une ligne (~24px), confirmant qu'il se replie sur 2 lignes ("A-" / "propos"), collé au bord du logo. Capture `header-768.png` confirme visuellement la collision.
- **Fix spec** :

```
/feature load Corriger la collision entre le logo et la nav a 768px. src/components/header.astro ligne 6, conteneur flex justify-between sans gap, mesure logo.x+width = nav.x = 179px (0px d'ecart), provoquant le retour a la ligne du lien "A-propos" (hauteur mesuree 45px au lieu de ~24px). Ajouter un gap-4 (ou plus) sur le conteneur flex principal et/ou passer les items de nav en whitespace-nowrap, verifié avec getBoundingClientRect confirmant un ecart >= 16px entre le logo et le premier lien de nav a 768px, et une hauteur de lien <= 30px (une seule ligne).
```

---

### MODÉRÉ

---

**M1 — Couleurs hexadécimales brutes dupliquant les tokens du thème**

- **Catégorie** : visual
- **Localisation** : `src/layouts/Layout.astro:28` (`bg-[#1A2251]`), `src/layouts/Layout.astro:29` (`text-[#F14D0E]`), `src/components/header.astro:20` (`bg-[#F14D0E]`), `src/pages/index.astro:21` (`bg-[#fff3ee]`), `src/pages/index.astro:68` (`bg-[#1A2251]`)
- **Preuve** : `#1A2251` et `#F14D0E` sont exactement `--color-blue-possacode` et `--color-orange-possacode` définis dans `src/styles/global.css` (`@theme`), mais réécrits en hex brut à 4 endroits au lieu d'utiliser les classes `bg-blue-possacode`/`text-orange-possacode`/`bg-orange-possacode`. `#fff3ee` (teinte claire de fond hero) n'a, elle, aucun token équivalent dans `@theme` — sa réutilisation en dur (index.astro:21, et déjà ailleurs sur `members/[slug].astro:64`) suggère qu'elle mériterait de devenir un token nommé plutôt que d'être recopiée en hex à chaque usage.
- **Fix spec** :

```
/feature load Remplacer les couleurs hex brutes par les tokens du theme existants. src/layouts/Layout.astro lignes 28-29, src/components/header.astro ligne 20, src/pages/index.astro lignes 21 et 68, contiennent bg-[#1A2251]/text-[#F14D0E]/bg-[#F14D0E]/bg-[#fff3ee] qui dupliquent orange-possacode/blue-possacode en hex brut. Remplacer #1A2251 par bg-blue-possacode, #F14D0E par bg-orange-possacode/text-orange-possacode, et ajouter un token --color-cream-possacode (#fff3ee) dans le @theme de src/styles/global.css pour remplacer les 2 occurrences de bg-[#fff3ee], verifié avec une recherche grep confirmant 0 occurrence de bg-\[#/text-\[# restante sur ces couleurs.
```

---

**M2 — Images de contenu significatif sans texte alternatif descriptif**

- **Catégorie** : a11y
- **Localisation** : `src/pages/index.astro:115-119` (galerie "Images Member Section", 5 photos), `src/pages/index.astro:175,189,198,207` (photos des 4 articles "Nos événements")
- **Preuve** : ces 9 `<img>` ont toutes `alt=""`. Contrairement aux photos purement décoratives du bandeau statistique (`ca.jpg`/`groupe.jpg`, où `alt=""` est un choix WCAG valide car l'information est déjà portée par le texte adjacent), la galerie de membres est une section dédiée qui n'affiche que des photos sans aucun texte équivalent ailleurs sur la page — un lecteur d'écran ne perçoit aucun contenu à cet endroit. Les 4 photos d'articles illustrent chacune un événement distinct, donc portent une information propre à l'article.
- **Fix spec** :

```
/feature load Ajouter un alt descriptif aux images de contenu (galerie membres + articles evenements). src/pages/index.astro lignes 115-119 et 175/189/198/207, 9 balises img avec alt="" alors qu'elles portent un contenu propre (pas purement decoratif). Ajouter un alt court et descriptif par image (ex. "Membre de la communaute PossaCode au travail", "Illustration de l'evenement Comment utiliser tailwindcss dans un projet Astro"), verifié avec un scan DOM confirmant qu'aucune de ces 9 images n'a plus alt="".
```

---

**M3 — Images locales servies en `<img>` brut depuis `public/` plutôt qu'`astro:assets`**

- **Catégorie** : astro
- **Localisation** : `src/pages/index.astro`, ~25 balises `<img src="/assets/...">` (hero, galerie, événements, mosaïque "Qui sommes-nous")
- **Preuve mesurée** : sur les 25+ `<img>` locaux de la page, aucun n'a d'attribut `width`/`height` (`hasWidth: false, hasHeight: false` pour chacun, vérifié en DOM), ni `loading="lazy"` explicite — seul le logo partenaire Congo DevOps (déjà migré vers `<Image>` d'`astro:assets`, cf. historique du projet) a `width`/`height`/`loading="lazy"` corrects. Ces images étant servies depuis `public/assets/`, elles ne peuvent pas bénéficier d'`astro:assets` sans être déplacées vers `src/assets/` au préalable (limite déjà rencontrée sur ce projet pour d'autres migrations d'images).
- **Fix spec** :

```
/feature load Ajouter des dimensions explicites (garde-fou CLS) sur les images locales de la page d'accueil. src/pages/index.astro, ~25 balises img sans width/height (hasWidth:false, hasHeight:false mesures en DOM), risque de decalage de mise en page (CLS) au chargement. Ajouter width/height correspondant aux dimensions reelles de chaque image en attendant une migration complete vers astro:assets (deplacement de public/assets/ vers src/assets/, comme deja fait pour le logo Congo DevOps), verifié avec un scan DOM confirmant width/height presents sur les images du hero et de la galerie au minimum (above the fold).
```

---

**M4 — Provenance douteuse de 2 images déjà repérée sur ce projet, toujours utilisées ici**

- **Catégorie** : content
- **Localisation** : `src/pages/index.astro:189` (`maxresdefault - Copie.jpg`), `src/pages/index.astro:207` (`femmecode - Copie.jpg`)
- **Preuve** : le nom de fichier `maxresdefault` est la convention de nommage systématique des miniatures YouTube téléchargées — ce même risque de provenance (photo récupérée en ligne plutôt que photo réelle PossaCode) a déjà été identifié et évité pour d'autres sections de ce projet (voir
  historique `context/current-feature.md`, section "Notre histoire" — ces 2 fichiers y sont explicitement cités comme écartés pour ce motif), mais ils restent utilisés sur la page d'accueil elle-même.
- **Fix spec** :

```
/feature load Remplacer les 2 images a provenance douteuse de la section "Nos evenements". src/pages/index.astro lignes 189 et 207, utilisent maxresdefault - Copie.jpg et femmecode - Copie.jpg (noms de fichiers deja identifies comme miniature YouTube/origine non verifiee ailleurs sur ce projet, cf. context/current-feature.md). Remplacer par 2 photos reelles de la communaute PossaCode deja presentes dans public/assets/ et non filigranees, verifié par inspection visuelle des 2 nouvelles images.
```

---

**M5 — Date d'événement obsolète et bandeau d'annonce sans année**

- **Catégorie** : content
- **Localisation** : `src/pages/index.astro:176,191,200,209` (`"25 Mars 2026"`), `src/layouts/Layout.astro:29` (`"...prévue pour le samedi 16 Mai"`)
- **Preuve** : la date d'aujourd'hui dans cette session est le 2026-08-27 ; les 4 cartes "Nos événements" affichent toutes une date de 25 mars 2026, donc déjà passée de 5 mois — un événement annoncé comme à venir qui ne l'est plus. Le bandeau d'annonce du header ("samedi 16 Mai") n'indique aucune année, rendant impossible de vérifier s'il s'agit d'une date passée ou future.
- **Fix spec** :

```
/feature load Mettre a jour les dates d'evenements perimees et ambigues. src/pages/index.astro lignes 176/191/200/209 affichent "25 Mars 2026" (deja passee par rapport a la date actuelle) et src/layouts/Layout.astro ligne 29 affiche "16 Mai" sans annee. Mettre a jour vers une date reelle a venir et ajouter l'annee au bandeau du header (ex. "16 Mai 2027"), verifié par relecture visuelle des dates affichees.
```

---

### MINEUR

---

**m1 — Métadonnées SEO incomplètes : pas de canonical, pas de Twitter Card, pas d'og:type/og:url**

- **Catégorie** : seo
- **Localisation** : `src/layouts/Layout.astro:18-26`
- **Preuve** : `document.querySelector('link[rel="canonical"]')` → `null` ; `meta[name^="twitter:"]` → 0 résultat ; seuls `og:title`, `og:description`, `og:image` sont présents (`og:type`, `og:url`, `og:site_name` absents).
- **Fix spec** :

```
/feature load Completer les metadonnees SEO du head. src/layouts/Layout.astro lignes 18-26, canonical absent (querySelector renvoie null), aucune balise twitter:*, og:type/og:url absents. Ajouter <link rel="canonical"> avec l'URL de la page, og:type="website", og:url, et les balises twitter:card/twitter:title/twitter:description/twitter:image, verifié avec un scan DOM confirmant leur presence sur chaque route du site.
```

---

**m2 — Pas de `<link rel="icon">` explicite malgré des favicons présents**

- **Catégorie** : astro / seo
- **Localisation** : `src/layouts/Layout.astro:18-26`
- **Preuve** : `public/favicon.ico` et `public/favicon.svg` répondent tous les deux `200` en requête directe, mais `document.querySelector('link[rel~="icon"]')` renvoie `null` — le site compte uniquement sur la convention implicite `/favicon.ico` du navigateur plutôt que sur une déclaration explicite (qui garantit aussi le bon favicon sur mobile/PWA/onglets).
- **Fix spec** :

```
/feature load Declarer explicitement le favicon dans le head. src/layouts/Layout.astro lignes 18-26, document.querySelector('link[rel~="icon"]') renvoie null malgre /favicon.ico et /favicon.svg presents et servis en 200. Ajouter <link rel="icon" href="/favicon.svg" type="image/svg+xml"> et un fallback <link rel="icon" href="/favicon.ico" sizes="any">, verifié avec un scan DOM confirmant la presence du link rel=icon.
```

---

**m3 — Texte alternatif générique sur le logo du header**

- **Catégorie** : a11y
- **Localisation** : `src/components/header.astro:7`
- **Preuve** : `<img ... alt="Logo">` — ne nomme pas la marque, moins utile qu'un `alt="PossaCode"` pour un utilisateur de lecteur d'écran naviguant par liens.
- **Fix spec** :

```
/feature load Rendre l'alt du logo du header plus descriptif. src/components/header.astro ligne 7, alt="Logo" actuellement generique. Remplacer par alt="PossaCode" (nom de la marque, coherent avec le alt="PossaCode" deja utilise sur le meme logo dans src/components/Footer.astro ligne 42), verifié par lecture de l'attribut alt en DOM.
```

---

**m4 — Pas de lien "aller au contenu" (skip link)**

- **Catégorie** : a11y
- **Localisation** : `src/layouts/Layout.astro` / `src/components/header.astro`
- **Preuve** : recherche de `skip-to-content`/`skip-link`/`Aller au contenu` dans tout `src/` → 0 résultat. Confirmé en session réelle : le premier `Tab` depuis le haut de page amène directement sur le lien du logo (`<a href="/">`), sans option de sauter la nav pour atteindre `<main>` directement — un utilisateur clavier doit tabuler à travers tout le header à chaque page.
- **Fix spec** :

```
/feature load Ajouter un lien "Aller au contenu" avant le header. src/layouts/Layout.astro, aucun skip-link trouve (recherche src/ negative), premier Tab confirme atterrir sur le logo sans option de sauter la nav. Ajouter un <a href="#main-content" class="sr-only focus:not-sr-only ...">Aller au contenu</a> juste apres <body>, et un id="main-content" sur le <main>, verifié avec un test Tab confirmant que le premier focus est le skip-link et qu'il devient visible au focus clavier.
```

---

**m5 — Bouton hamburger mobile à 40×40px, sous la cible tactile préférée de 44px**

- **Catégorie** : responsive
- **Localisation** : `src/components/header.astro:22`
- **Preuve mesurée** : `getBoundingClientRect` à 375px → `{w: 40, h: 40}`. Au-dessus du minimum WCAG 2.2 de 24×24px (conforme), mais sous la cible préférée de 44×44px recommandée pour le tactile.
- **Fix spec** :

```
/feature load Agrandir legerement le bouton hamburger mobile vers la cible tactile preferee. src/components/header.astro ligne 22, #menu-toggle mesure 40x40px (getBoundingClientRect a 375px), sous les 44x44px preferes (deja conforme au minimum WCAG 2.2 de 24x24px). Augmenter le padding du bouton (p-2 -> p-3) pour atteindre ~44x44px, meme pattern deja applique aux boutons .boutton-standard sur ce projet, verifié avec getBoundingClientRect >= 44x44 a 375px.
```

---

## Specs prêtes à charger (ordre Critique → Mineur)

```
/feature load Rendre le bouton "Faire un don" du header réellement interactif. src/components/header.astro lignes 20 et 41, actuellement <div> sans href/role/tabindex, doit être un vrai lien. Remplacer les deux <div class="...">Faire un don</div> par <a href="/donate" class="...">Faire un don</a> (même route que le lien "Faire un don" déjà utilisé dans le footer), en conservant les classes visuelles existantes, verifié avec un test Tab (focus atteint l'élément) et getComputedStyle du role implicite "link".

/feature load Corriger le débordement horizontal à 1024px de la section "Qui sommes-nous ?". src/pages/index.astro ligne 87, <p class="w-120">, scrollWidth mesuré à 1268px contre innerWidth 1024px (244px au-dessus). Remplacer w-120 par max-w-120 (ou une largeur fluide type w-full lg:max-w-md) pour que le paragraphe puisse rétrécir dans sa colonne au lieu d'imposer 480px fixes, verifié avec document.documentElement.scrollWidth <= window.innerWidth a 1024px.

/feature load Corriger la hiérarchie de titres de la page d'accueil. src/pages/index.astro, 14 balises h1 mesurées (document.querySelectorAll('h1').length === 14), doit être exactement 1. Garder un seul <h1> pour le titre du hero (ligne 23) et convertir tous les autres titres de section (lignes 48, 71, 127, 139, 151, 167, 177, 192, 201, 210, 223, 254, 265) en <h2>, en conservant les classes visuelles (taille, font-Phudu, wave-line) inchangees, verifié avec document.querySelectorAll('h1').length === 1 et un audit axe heading-order.

/feature load Corriger les 3 liens morts href="" des CTA principaux. src/pages/index.astro lignes 36, 276 et 277, actuellement href="" (rechargement de la page courante). Pointer "Nous Rejoindre" vers /join et "Faire un don" vers /donate (memes routes deja utilisees dans le footer src/components/Footer.astro), verifié avec un scan DOM confirmant qu'aucun <a> n'a plus href="" sur la page.

/feature load Corriger le motif recurrent de contraste insuffisant texte-sur-orange-possacode. 14 nœuds axe color-contrast (impact serious) mesures entre 3.32:1 et 4.17:1 sur src/pages/index.astro (lignes 35,36,88,132,144,156,176,185,191,200,209,276) et src/components/header.astro:20, tous sous le seuil AA 4.5:1 texte normal. Ajouter dans src/styles/global.css un token de texte fonce dedie aux fonds orange-possacode (ex. --color-orange-possacode-ink assombri) et l'appliquer aux boutons/paragraphes concernes au lieu de text-white/text-orange-possacode sur fond clair, verifié avec axe.run() ne remontant plus de violation color-contrast sur ces 14 nœuds.

/feature load Agrandir les puces de pagination du carrousel de membres au minimum tactile WCAG 2.2. src/components/MemberCarousel.astro ligne 69, class="w-2.5 h-2.5" mesure 10x10px, sous le seuil de 24x24px. Garder le point visuel a w-2.5 h-2.5 mais l'envelopper dans une zone cliquable min-w-6 min-h-6 flex items-center justify-center (ou ajouter un padding invisible sur le bouton lui-meme), verifié avec un audit axe target-size ne remontant plus de violation sur [data-carousel-dot].

/feature load Remplacer le texte Lorem ipsum de l'extrait d'article evenement par un vrai resume. src/pages/index.astro lignes 181-184, contient actuellement du texte de remplissage latin visible en production. Ecrire 2-3 phrases reelles decrivant l'evenement "Comment utiliser tailwindcss dans un projet Astro ?" (ou masquer la section si aucun evenement reel n'est confirme, meme principe deja applique a la section "experts"), verifié par relecture visuelle du texte affiché.

/feature load Différencier les 4 cartes evenement dupliquees de la section "Nos evenements". src/pages/index.astro lignes 176-214, 4 cartes avec titre et date identiques ("Comment utiliser tailwindcss dans un projet Astro ?" / "25 Mars 2026"). Remplacer par 4 evenements reels distincts (ou reduire a 1 seul evenement reel si aucun autre n'est confirme, plutot que dupliquer un placeholder), verifié par relecture visuelle confirmant 4 titres/dates distincts.

/feature load Corriger la collision entre le logo et la nav a 768px. src/components/header.astro ligne 6, conteneur flex justify-between sans gap, mesure logo.x+width = nav.x = 179px (0px d'ecart), provoquant le retour a la ligne du lien "A-propos" (hauteur mesuree 45px au lieu de ~24px). Ajouter un gap-4 (ou plus) sur le conteneur flex principal et/ou passer les items de nav en whitespace-nowrap, verifié avec getBoundingClientRect confirmant un ecart >= 16px entre le logo et le premier lien de nav a 768px, et une hauteur de lien <= 30px (une seule ligne).

/feature load Remplacer les couleurs hex brutes par les tokens du theme existants. src/layouts/Layout.astro lignes 28-29, src/components/header.astro ligne 20, src/pages/index.astro lignes 21 et 68, contiennent bg-[#1A2251]/text-[#F14D0E]/bg-[#F14D0E]/bg-[#fff3ee] qui dupliquent orange-possacode/blue-possacode en hex brut. Remplacer #1A2251 par bg-blue-possacode, #F14D0E par bg-orange-possacode/text-orange-possacode, et ajouter un token --color-cream-possacode (#fff3ee) dans le @theme de src/styles/global.css pour remplacer les 2 occurrences de bg-[#fff3ee], verifié avec une recherche grep confirmant 0 occurrence de bg-\[#/text-\[# restante sur ces couleurs.

/feature load Ajouter un alt descriptif aux images de contenu (galerie membres + articles evenements). src/pages/index.astro lignes 115-119 et 175/189/198/207, 9 balises img avec alt="" alors qu'elles portent un contenu propre (pas purement decoratif). Ajouter un alt court et descriptif par image (ex. "Membre de la communaute PossaCode au travail", "Illustration de l'evenement Comment utiliser tailwindcss dans un projet Astro"), verifié avec un scan DOM confirmant qu'aucune de ces 9 images n'a plus alt="".

/feature load Ajouter des dimensions explicites (garde-fou CLS) sur les images locales de la page d'accueil. src/pages/index.astro, ~25 balises img sans width/height (hasWidth:false, hasHeight:false mesures en DOM), risque de decalage de mise en page (CLS) au chargement. Ajouter width/height correspondant aux dimensions reelles de chaque image en attendant une migration complete vers astro:assets (deplacement de public/assets/ vers src/assets/, comme deja fait pour le logo Congo DevOps), verifié avec un scan DOM confirmant width/height presents sur les images du hero et de la galerie au minimum (above the fold).

/feature load Remplacer les 2 images a provenance douteuse de la section "Nos evenements". src/pages/index.astro lignes 189 et 207, utilisent maxresdefault - Copie.jpg et femmecode - Copie.jpg (noms de fichiers deja identifies comme miniature YouTube/origine non verifiee ailleurs sur ce projet, cf. context/current-feature.md). Remplacer par 2 photos reelles de la communaute PossaCode deja presentes dans public/assets/ et non filigranees, verifié par inspection visuelle des 2 nouvelles images.

/feature load Mettre a jour les dates d'evenements perimees et ambigues. src/pages/index.astro lignes 176/191/200/209 affichent "25 Mars 2026" (deja passee par rapport a la date actuelle) et src/layouts/Layout.astro ligne 29 affiche "16 Mai" sans annee. Mettre a jour vers une date reelle a venir et ajouter l'annee au bandeau du header (ex. "16 Mai 2027"), verifié par relecture visuelle des dates affichees.

/feature load Completer les metadonnees SEO du head. src/layouts/Layout.astro lignes 18-26, canonical absent (querySelector renvoie null), aucune balise twitter:*, og:type/og:url absents. Ajouter <link rel="canonical"> avec l'URL de la page, og:type="website", og:url, et les balises twitter:card/twitter:title/twitter:description/twitter:image, verifié avec un scan DOM confirmant leur presence sur chaque route du site.

/feature load Declarer explicitement le favicon dans le head. src/layouts/Layout.astro lignes 18-26, document.querySelector('link[rel~="icon"]') renvoie null malgre /favicon.ico et /favicon.svg presents et servis en 200. Ajouter <link rel="icon" href="/favicon.svg" type="image/svg+xml"> et un fallback <link rel="icon" href="/favicon.ico" sizes="any">, verifié avec un scan DOM confirmant la presence du link rel=icon.

/feature load Rendre l'alt du logo du header plus descriptif. src/components/header.astro ligne 7, alt="Logo" actuellement generique. Remplacer par alt="PossaCode" (nom de la marque, coherent avec le alt="PossaCode" deja utilise sur le meme logo dans src/components/Footer.astro ligne 42), verifié par lecture de l'attribut alt en DOM.

/feature load Ajouter un lien "Aller au contenu" avant le header. src/layouts/Layout.astro, aucun skip-link trouve (recherche src/ negative), premier Tab confirme atterrir sur le logo sans option de sauter la nav. Ajouter un <a href="#main-content" class="sr-only focus:not-sr-only ...">Aller au contenu</a> juste apres <body>, et un id="main-content" sur le <main>, verifié avec un test Tab confirmant que le premier focus est le skip-link et qu'il devient visible au focus clavier.

/feature load Agrandir legerement le bouton hamburger mobile vers la cible tactile preferee. src/components/header.astro ligne 22, #menu-toggle mesure 40x40px (getBoundingClientRect a 375px), sous les 44x44px preferes (deja conforme au minimum WCAG 2.2 de 24x24px). Augmenter le padding du bouton (p-2 -> p-3) pour atteindre ~44x44px, meme pattern deja applique aux boutons .boutton-standard sur ce projet, verifié avec getBoundingClientRect >= 44x44 a 375px.
```
