# Audit UI — Page A-propos (`/about`)

**Scope** : route unique `/about` (`src/pages/about.astro`, via `src/layouts/Layout.astro`, `src/components/header.astro`, `src/components/Footer.astro`)
**Date** : 2026-08-30
**URL cible** : http://localhost:4321/about
**Serveur** : dev server relancé pour cette session (`npm run dev`, Astro, port 4321 — aucun serveur n'était déjà lancé au début de cette session). Note technique : sur cette machine, le serveur de dev Astro n'écoute qu'en IPv6 loopback (`::1`) — `http://localhost:4321` et `http://127.0.0.1:4321` échouent depuis Playwright/Edge headless (`ERR_CONNECTION_REFUSED` sur `127.0.0.1`, timeout sur `localhost`), alors que `curl` résout `localhost` en IPv6 et fonctionne. Toute navigation Playwright sur ce projet doit cibler `http://[::1]:4321/...` explicitement.
**Méthode** : session Playwright réelle (`playwright-core` + `axe-core` 4.x, installés temporairement en local avec `--no-save`, désinstallés après l'audit), pilotée via Microsoft Edge headless installé sur la machine (`--no-sandbox --disable-gpu`, requis pour que la navigation aboutisse dans cet environnement — MCP Playwright indisponible, `CONNECT_TIMEOUT` au démarrage de la session). axe-core exécuté avec `runOnly: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']` (+ passe ciblée `target-size`). Captures d'écran (contexte neuf par largeur, `reducedMotion: 'reduce'`) et mesures `getBoundingClientRect`/`getComputedStyle` réelles à 375/768/1024/1440px. Contraste recalculé manuellement (luminance relative WCAG) en plus des résultats axe. Trace réseau complète capturée (poids des images, codes de statut). Aucun fichier applicatif modifié — seul ce rapport a été écrit (scripts et captures temporaires supprimés après l'audit).

**Artefact d'outillage identifié et écarté** : sur les captures 768/1024/1440px, une pastille noire arrondie flottante apparaît superposée au chiffre "1000+" du bandeau de statistiques. Vérifié via `document.querySelector('astro-dev-toolbar')` → élément bien présent (`<astro-dev-toolbar>`, la barre d'outils intégrée au serveur de dev Astro, en `position: fixed`). N'existe qu'en mode dev, absente d'un build de production (`npm run build && npm run preview`) — **pas un défaut du site**, non compté dans les findings ci-dessous, mentionné uniquement pour que le prochain audit ne perde pas de temps dessus.

---

## Résumé

| Route          | Critique | Sérieux | Modéré | Mineur | Statut   |
| -------------- | -------- | ------- | ------ | ------ | -------- |
| `/about`       | 0        | 4       | 4      | 2      | **FAIL** |

Vérifications qui **passent** (à ne pas re-tester inutilement lors du prochain audit) : un seul `<h1>` sur la page, aucun saut de niveau de titre (H1→H2 uniquement), landmarks `header`/`nav`/`main`/`footer` tous présents, `html lang="fr"` correct, aucun overflow horizontal aux 4 largeurs (375/768/1024/1440px, `scrollWidth === innerWidth` partout), aucune image cassée (0 `naturalWidth === 0` sur 23 nœuds `<img>`, 0 réponse réseau ≥ 400 sur 64 requêtes), aucun lien mort (`href=""`/`"#"`/absent` — 0 sur 27 liens scannés), tous les liens réseau externes/`mailto:` bien formés, tous les logos partenaires ont un `alt` descriptif propre à chaque marque (contrairement à la homepage où certains sont `alt=""`), l'ordre de tabulation clavier est logique (logo → nav → don → CTA hero → accordéon, aucun piège), aucune balise `client:*` inutile/manquante (page 100% Astro + JS vanilla, cohérent avec les contraintes du projet), la règle axe `target-size` ne remonte 0 violation sur 29 cibles interactives, les CTA du hero (`Nous contacter`/`Nos événements`) mesurent 48×152px / 48×179px (desktop) et 44px de hauteur (mobile) — au-dessus du seuil préféré de 44px.

---

## Findings — route `/about`

### SÉRIEUX

---

**S1 — Contraste insuffisant du CTA hero "Nous contacter" (bug déjà connu, toujours présent)**

- **Catégorie** : a11y
- **Localisation** : `src/pages/about.astro:75`, `<a href="/contact" class="boutton-standard text-white ...">`
- **Preuve mesurée** : axe `color-contrast` (impact `serious`). Contraste mesuré 3.61:1 (`color: rgb(255,255,255)`, `background-color: rgb(241,77,14)`, `font-size: 16px`, `font-weight: 700`), sous le seuil AA 4.5:1 texte normal (16px gras ne franchit pas le seuil de 18.66px requis pour le seuil "grand texte" à 3:1). Recalcul manuel indépendant (luminance relative WCAG) confirme 3.62:1. Ce défaut est déjà documenté dans `context/current-feature.md` (feature "Fix contraste texte-sur-orange-possacode", 2026-08-28) comme volontairement laissé hors scope à cette date — confirmé ici toujours présent dans le rendu réel.
- **Fix spec** :

```
/feature load Corriger le contraste du CTA hero "Nous contacter". src/pages/about.astro ligne 75, text-white sur bg-orange-possacode (.boutton-standard), contraste mesure 3.61:1, sous le seuil AA 4.5:1 texte normal (16px gras). Remplacer text-white par text-orange-possacode-ink (token deja defini dans src/styles/global.css, meme motif deja applique sur d'autres boutons du site), verifié avec axe color-contrast (0 violation sur ce nœud) a 375/768/1024/1440px.
```

---

**S2 — Contraste insuffisant du panneau "Notre mission" (mosaïque Vision/Mission/Valeurs)**

- **Catégorie** : a11y
- **Localisation** : `src/pages/about.astro:219-223`, `<div ... bg-orange-possacode ...>` → titre `<p class="... text-white ...">Notre mission</p>` (ligne 220) et sous-texte `<span>Former & connecter</span>` dans `<p class="... text-white/90 ...">` (ligne 222-223)
- **Preuve mesurée** : axe `color-contrast` (impact `serious`) sur le titre — 3.61:1 (`color: rgb(255,255,255)`, `background-color: rgb(241,77,14)`, `font-size: 18px`, `font-weight: 700`), sous 4.5:1 (18px gras reste sous le seuil de 18.66px pour le seuil "grand texte"). Le sous-texte partage le même fond `bg-orange-possacode` et une opacité 90% quasi-identique en contraste (mesuré 3.62:1 par recalcul manuel une fois le panneau rendu visible via clic sur l'accordéon "Notre mission" — `grid-rows-[0fr]`→`[1fr]`, hauteur mesurée 0px à l'état replié donc invisible pour axe par défaut, mais bien affiché et lisible par un utilisateur qui clique). Ce nœud n'était pas dans le périmètre de la feature "Fix contraste" du 2026-08-28 (qui n'a touché que `index.astro` et `header.astro`) — nouveau constat sur cette page.
- **Fix spec** :

```
/feature load Corriger le contraste du panneau "Notre mission" de la mosaïque Vision/Mission/Valeurs. src/pages/about.astro lignes 220 et 222-223, text-white/text-white/90 sur bg-orange-possacode, contraste mesure 3.61-3.62:1, sous le seuil AA 4.5:1 (titre 18px gras, sous-texte 14px). Remplacer text-white par text-orange-possacode-ink sur le titre et text-white/90 par text-orange-possacode-ink/90 sur le sous-texte (meme token deja utilise ailleurs pour ce motif fond-orange), verifié avec axe color-contrast apres avoir cliqué sur le déclencheur d'accordéon "Notre mission" (pour rendre le sous-texte visible) a 375/768/1440px.
```

---

**S3 — Contraste insuffisant des années de la timeline "Notre histoire" (4 nœuds)**

- **Catégorie** : a11y
- **Localisation** : `src/pages/about.astro:268`, `<span class="... text-orange-possacode text-base md:text-lg">{milestone.year}</span>` (généré 4× par la boucle `.map`, années 2023/2024/2025/2026)
- **Preuve mesurée** : axe `color-contrast` (impact `serious`) sur les 4 nœuds — 3.61:1 chacun (`color: rgb(241,77,14)`, `background-color: rgb(255,255,255)`, `font-size: 18px`, `font-weight: 700`), sous 4.5:1 (18px gras, sous le seuil de 18.66px requis pour bénéficier du seuil "grand texte" 3:1). Mesure directe confirmée (`getBoundingClientRect` : 48×28px par span, `getComputedStyle` : `18px`/`700`/`rgb(241, 77, 14)`).
- **Fix spec** :

```
/feature load Corriger le contraste des années de la timeline "Notre histoire". src/pages/about.astro ligne 268, span text-orange-possacode sur fond blanc (4 nœuds, années 2023-2026), contraste mesure 3.61:1 sur chacun, sous le seuil AA 4.5:1 (18px gras). Remplacer text-orange-possacode par text-orange-possacode-ink sur ce span (le token est deja concu pour remplacer text-orange-possacode sur fond clair, cf. commentaire dans src/styles/global.css), verifié avec axe color-contrast (0 violation sur les 4 nœuds) a 375/768/1024/1440px.
```

---

**S4 — Contraste insuffisant du bandeau d'annonce "PossaCode Dev Girls" (déjà connu, hors scope précédent)**

- **Catégorie** : a11y
- **Localisation** : `src/layouts/Layout.astro:29`, `<span class="text-[#F14D0E]">PossaCode Dev Girsl</span>` — composant partagé, visible sur `/about` comme sur toutes les routes
- **Preuve mesurée** : axe `color-contrast` (impact `serious`) — 4.17:1 (`color: rgb(241,77,14)`, `background-color: rgb(26,34,81)`, `font-size: 14px`, `font-weight: 300`), sous 4.5:1. Déjà identifié et documenté dans `context/current-feature.md` (2026-08-28) comme le seul nœud de la feature de contraste précédente resté non corrigé — motif inverse des autres findings de cette page (nécessite un orange plus **clair**, pas le token `-ink` qui assombrit). Listé ici car visible et mesuré sur `/about`, pas un nouveau défaut.
- **Fix spec** :

```
/feature load Corriger le contraste du span "PossaCode Dev Girls" du bandeau d'annonce. src/layouts/Layout.astro ligne 29, text-[#F14D0E] sur bg-[#1A2251] (bandeau partagé, visible sur toutes les routes dont /about), contraste mesure 4.17:1, sous le seuil AA 4.5:1. Ajouter un token de texte plus clair (ex. --color-orange-possacode-light dans src/styles/global.css @theme, sens inverse de --color-orange-possacode-ink deja existant) suffisamment clair pour >=4.5:1 sur bg-blue-possacode, l'appliquer a ce span, verifié avec axe color-contrast sur /about et au moins une autre route utilisant Layout.astro.
```

---

### MODÉRÉ

---

**M1 — Poids d'images non optimisées très élevé (16 Mo d'images / 40,4 Mo de transfert total sur une seule page)**

- **Catégorie** : astro / performance
- **Localisation** : `src/pages/about.astro`, balises `<img>` brutes pour `/assets/A3.jpg` (hero, ligne 54), `/assets/coworking.webp` (bandeau communauté, ligne 114), `/assets/NOUS.jpg` et `/assets/engroupe.jpg` (mosaïque, lignes 205/209), `/assets/heri.jpg`/`A3.jpg`/`engroupe.jpg`/`groupe.jpg` (timeline, lignes 254/278, réutilisant les mêmes fichiers)
- **Preuve mesurée** : trace réseau réelle (`page.on('response')`) sur un chargement complet de `/about` — 64 requêtes, **40 389 559 octets** de transfert total dont **16 009 318 octets** rien qu'en images, 0 échec réseau. Détail des 5 plus lourdes : `engroupe.jpg` 4,15 Mo (6000×4000, affiché dans une case mosaïque ~280×180px), `groupe.jpg` 3,25 Mo (6000×4000), `heri.jpg` 2,77 Mo (4000×6000), `NOUS.jpg` 2,55 Mo (6000×3700, case mosaïque), `A3.jpg` 2,38 Mo (5775×3595, utilisée en fond de hero ET en photo de timeline). Aucune de ces images n'utilise `astro:assets` (`<Image>`/`<Picture>`), aucune n'a d'attribut `width`/`height` (risque CLS confirmé : `width`/`height` DOM = `null` sur les 18 balises `<img>` concernées), aucune n'a `loading="lazy"` — seul le logo `Congo DevOps.jpg` (déjà migré vers `<Image>` lors d'une feature précédente) a `width="140" height="140" loading="lazy"` et pèse quelques Ko en `webp`.
- **Fix spec** :

```
/feature load Optimiser les photos locales non compressées de la page A-propos. src/pages/about.astro (sections hero/bandeau communaute/mosaïque/timeline), images /assets/A3.jpg (2,38 Mo, 5775x3595), /assets/NOUS.jpg (2,55 Mo, 6000x3700), /assets/engroupe.jpg (4,15 Mo, 6000x4000), /assets/heri.jpg (2,77 Mo, 4000x6000), /assets/groupe.jpg (3,25 Mo, 6000x4000), mesure totale 16,0 Mo d'images / 40,4 Mo de transfert pour un seul chargement de page, aucune n'a width/height ni astro:assets. Migrer chacune vers <Image>/<Picture> de astro:assets avec width/height explicites et format="webp", ajouter loading="lazy" sur toutes les instances en dessous de la ligne de flottaison (mosaïque, timeline), verifié en remesurant le poids total des images transferees (cible nettement sous la moitie des 16,0 Mo actuels) et en confirmant width/height presents en DOM.
```

---

**M2 — Métadonnées `<head>` incomplètes (canonical, Twitter Card, og:type/og:url, favicon)**

- **Catégorie** : seo
- **Localisation** : `src/layouts/Layout.astro:18-26` — composant partagé, affecte `/about` comme toutes les routes
- **Preuve mesurée** : scan DOM réel sur `/about` — `document.querySelector('link[rel="canonical"]')` → `null`, `document.querySelectorAll('meta[name^="twitter:"]')` → 0 nœud, `document.querySelectorAll('meta[property^="og:"]')` → seulement `og:title`/`og:description`/`og:image` (pas de `og:type` ni `og:url`), `document.querySelector('link[rel~="icon"]')` → `null` (confirmé aussi par la trace réseau : aucune requête vers un favicon n'a été observée). `<title>` et `<meta name="description">` sont en revanche corrects et propres à la page (`"A propos — PossaCode"`, description distincte de la homepage) — seuls ces 3 éléments manquent.
- **Fix spec** :

```
/feature load Completer les metadonnees SEO du head partage. src/layouts/Layout.astro lignes 18-26, canonical absent (querySelector renvoie null sur /about), og:type/og:url absents, 0 balise twitter:*, aucun favicon declare. Ajouter <link rel="canonical"> construit depuis Astro.url, og:type="website", og:url, les balises twitter:card/twitter:title/twitter:description/twitter:image, et un <link rel="icon"> vers /assets/possacodebb.jpg ou une favicon dediee, verifié avec un scan DOM confirmant leur presence et leur caractere propre a la page sur /about et au moins une autre route.
```

---

**M3 — Absence de lien "aller au contenu" (skip link)**

- **Catégorie** : a11y
- **Localisation** : `src/layouts/Layout.astro` — composant partagé, aucun skip link nulle part dans `src/` (confirmé par grep sur tout le dossier)
- **Preuve mesurée** : test clavier réel sur `/about` — premier appui sur `Tab` depuis le haut de page amène le focus directement sur le lien logo du header (`<a href="/">`), aucun élément intermédiaire de type "aller au contenu"/"skip" trouvé. Un utilisateur clavier doit traverser toute la nav (5 liens) + le bouton "Faire un don" avant d'atteindre le contenu de la page — SC 2.4.1 (Bypass Blocks, niveau A). Défaut déjà identifié comme site-wide lors de l'audit homepage (2026-08-27), confirmé ici toujours présent.
- **Fix spec** :

```
/feature load Ajouter un lien "aller au contenu" (skip link). Aucun lien avec texte "aller au contenu"/"skip" trouve dans src/ (grep), confirme par un test Tab reel sur /about ou le premier focus atteint le logo du header au lieu de shunter la navigation. Ajouter <a href="#main-content">Aller au contenu principal</a> comme premier element focusable de src/layouts/Layout.astro (visible uniquement au focus clavier), et id="main-content" sur le <main>, verifié en appuyant une fois sur Tab au chargement de la page et en confirmant que le skip link recoit le focus et devient visible.
```

---

**M4 — Couleur hexadécimale brute au lieu du token sur le bouton "Faire un don" du header**

- **Catégorie** : visual (tokens)
- **Localisation** : `src/components/header.astro:20`, `<a href="/donate" class="hidden md:flex ... bg-[#F14D0E] text-orange-possacode-ink ...">` — composant partagé, visible sur `/about`
- **Preuve mesurée** : `getComputedStyle` confirme `background-color: rgb(241, 77, 14)` — exactement la valeur du token `--color-orange-possacode` (`#f14d0e`) déjà défini dans `src/styles/global.css`, mais appliquée ici via une classe Tailwind arbitraire `bg-[#F14D0E]` plutôt que `bg-orange-possacode`. Aucun bug visuel (couleur identique), mais viole la règle du projet ("Utiliser uniquement les couleurs du thème : `orange-possacode`, `blue-possacode`") et duplique la valeur en dur — un futur changement de teinte du token ne mettrait pas à jour cet élément.
- **Fix spec** :

```
/feature load Remplacer la couleur hex brute du bouton "Faire un don" du header par le token du theme. src/components/header.astro ligne 20, bg-[#F14D0E] (valeur identique a --color-orange-possacode #f14d0e deja definie dans src/styles/global.css) au lieu du token. Remplacer bg-[#F14D0E] par bg-orange-possacode, verifié visuellement (aucun changement de couleur attendu) et avec un grep confirmant 0 occurrence de bg-\[#F14D0E\]/bg-\[#f14d0e\] restante dans header.astro.
```

---

### MINEUR

---

**m1 — Cibles tactiles de l'accordéon Vision/Mission/Valeurs sous la taille préférée**

- **Catégorie** : responsive
- **Localisation** : `src/pages/about.astro:165,177,189`, `[data-accordion-trigger]` (3 boutons "Notre vision"/"Notre mission"/"Nos valeurs")
- **Preuve mesurée** : `getBoundingClientRect` à 1440px — 648×32px pour les 3 boutons. Au-dessus du minimum WCAG 2.2 requis (24×24px, confirmé aussi par 0 violation axe `target-size`), mais sous la taille préférée de 44×44px recommandée par le même critère.
- **Fix spec** :

```
/feature load Agrandir les cibles tactiles des declencheurs d'accordeon Vision/Mission/Valeurs. src/pages/about.astro lignes 165, 177 et 189, [data-accordion-trigger] mesure 648x32px (getBoundingClientRect a 1440px), au-dessus du minimum WCAG 2.2 (24x24px) mais sous la taille preferee de 44x44px. Augmenter le padding vertical du conteneur parent (py-5 -> py-6) ou ajouter min-h-11 sur le bouton, verifié avec getBoundingClientRect >= 44px de hauteur a 375/1440px sans regression visuelle.
```

---

**m2 — Données de la timeline "Notre histoire" toujours fictives (déjà tracké, pour mémoire)**

- **Catégorie** : content
- **Localisation** : `src/pages/about.astro:7-37`, tableau `historyMilestones`
- **Preuve mesurée** : commentaire explicite en ligne 7 ("Jalons temporaires (fictifs) — à remplacer par les vraies dates et événements de PossaCode avant mise en production"), déjà documenté comme décision assumée dans `context/current-feature.md` (2026-08-26/27). Aucun texte Lorem Ipsum ni "TODO" brut trouvé (contrairement à un défaut similaire déjà corrigé sur la homepage) — seulement des dates/jalons plausibles mais non réels. Listé ici pour complétude du contrôle "contenu" de cet audit, pas un nouveau défaut découvert.
- **Fix spec** :

```
/feature load Remplacer les jalons fictifs de "Notre histoire" par les vraies dates avant mise en production. src/pages/about.astro lignes 8-37, tableau historyMilestones explicitement commente comme temporaire/fictif (4 jalons 2023-2026). Remplacer chaque entree (year/title/description/image/alt) par les vrais evenements et dates de PossaCode, deja tracke dans context/current-feature.md, verifié par relecture du contenu affiche (plus aucune mention "temporaire"/"fictif" necessaire dans le commentaire du code).
```

---

## Specs prêtes à charger (ordre Critique → Mineur)

```
/feature load Corriger le contraste du CTA hero "Nous contacter". src/pages/about.astro ligne 75, text-white sur bg-orange-possacode (.boutton-standard), contraste mesure 3.61:1, sous le seuil AA 4.5:1 texte normal (16px gras). Remplacer text-white par text-orange-possacode-ink (token deja defini dans src/styles/global.css, meme motif deja applique sur d'autres boutons du site), verifié avec axe color-contrast (0 violation sur ce nœud) a 375/768/1024/1440px.

/feature load Corriger le contraste du panneau "Notre mission" de la mosaïque Vision/Mission/Valeurs. src/pages/about.astro lignes 220 et 222-223, text-white/text-white/90 sur bg-orange-possacode, contraste mesure 3.61-3.62:1, sous le seuil AA 4.5:1 (titre 18px gras, sous-texte 14px). Remplacer text-white par text-orange-possacode-ink sur le titre et text-white/90 par text-orange-possacode-ink/90 sur le sous-texte (meme token deja utilise ailleurs pour ce motif fond-orange), verifié avec axe color-contrast apres avoir cliqué sur le déclencheur d'accordéon "Notre mission" (pour rendre le sous-texte visible) a 375/768/1440px.

/feature load Corriger le contraste des années de la timeline "Notre histoire". src/pages/about.astro ligne 268, span text-orange-possacode sur fond blanc (4 nœuds, années 2023-2026), contraste mesure 3.61:1 sur chacun, sous le seuil AA 4.5:1 (18px gras). Remplacer text-orange-possacode par text-orange-possacode-ink sur ce span (le token est deja concu pour remplacer text-orange-possacode sur fond clair, cf. commentaire dans src/styles/global.css), verifié avec axe color-contrast (0 violation sur les 4 nœuds) a 375/768/1024/1440px.

/feature load Corriger le contraste du span "PossaCode Dev Girls" du bandeau d'annonce. src/layouts/Layout.astro ligne 29, text-[#F14D0E] sur bg-[#1A2251] (bandeau partagé, visible sur toutes les routes dont /about), contraste mesure 4.17:1, sous le seuil AA 4.5:1. Ajouter un token de texte plus clair (ex. --color-orange-possacode-light dans src/styles/global.css @theme, sens inverse de --color-orange-possacode-ink deja existant) suffisamment clair pour >=4.5:1 sur bg-blue-possacode, l'appliquer a ce span, verifié avec axe color-contrast sur /about et au moins une autre route utilisant Layout.astro.

/feature load Optimiser les photos locales non compressées de la page A-propos. src/pages/about.astro (sections hero/bandeau communaute/mosaïque/timeline), images /assets/A3.jpg (2,38 Mo, 5775x3595), /assets/NOUS.jpg (2,55 Mo, 6000x3700), /assets/engroupe.jpg (4,15 Mo, 6000x4000), /assets/heri.jpg (2,77 Mo, 4000x6000), /assets/groupe.jpg (3,25 Mo, 6000x4000), mesure totale 16,0 Mo d'images / 40,4 Mo de transfert pour un seul chargement de page, aucune n'a width/height ni astro:assets. Migrer chacune vers <Image>/<Picture> de astro:assets avec width/height explicites et format="webp", ajouter loading="lazy" sur toutes les instances en dessous de la ligne de flottaison (mosaïque, timeline), verifié en remesurant le poids total des images transferees (cible nettement sous la moitie des 16,0 Mo actuels) et en confirmant width/height presents en DOM.

/feature load Completer les metadonnees SEO du head partage. src/layouts/Layout.astro lignes 18-26, canonical absent (querySelector renvoie null sur /about), og:type/og:url absents, 0 balise twitter:*, aucun favicon declare. Ajouter <link rel="canonical"> construit depuis Astro.url, og:type="website", og:url, les balises twitter:card/twitter:title/twitter:description/twitter:image, et un <link rel="icon"> vers /assets/possacodebb.jpg ou une favicon dediee, verifié avec un scan DOM confirmant leur presence et leur caractere propre a la page sur /about et au moins une autre route.

/feature load Ajouter un lien "aller au contenu" (skip link). Aucun lien avec texte "aller au contenu"/"skip" trouve dans src/ (grep), confirme par un test Tab reel sur /about ou le premier focus atteint le logo du header au lieu de shunter la navigation. Ajouter <a href="#main-content">Aller au contenu principal</a> comme premier element focusable de src/layouts/Layout.astro (visible uniquement au focus clavier), et id="main-content" sur le <main>, verifié en appuyant une fois sur Tab au chargement de la page et en confirmant que le skip link recoit le focus et devient visible.

/feature load Remplacer la couleur hex brute du bouton "Faire un don" du header par le token du theme. src/components/header.astro ligne 20, bg-[#F14D0E] (valeur identique a --color-orange-possacode #f14d0e deja definie dans src/styles/global.css) au lieu du token. Remplacer bg-[#F14D0E] par bg-orange-possacode, verifié visuellement (aucun changement de couleur attendu) et avec un grep confirmant 0 occurrence de bg-\[#F14D0E\]/bg-\[#f14d0e\] restante dans header.astro.

/feature load Agrandir les cibles tactiles des declencheurs d'accordeon Vision/Mission/Valeurs. src/pages/about.astro lignes 165, 177 et 189, [data-accordion-trigger] mesure 648x32px (getBoundingClientRect a 1440px), au-dessus du minimum WCAG 2.2 (24x24px) mais sous la taille preferee de 44x44px. Augmenter le padding vertical du conteneur parent (py-5 -> py-6) ou ajouter min-h-11 sur le bouton, verifié avec getBoundingClientRect >= 44px de hauteur a 375/1440px sans regression visuelle.

/feature load Remplacer les jalons fictifs de "Notre histoire" par les vraies dates avant mise en production. src/pages/about.astro lignes 8-37, tableau historyMilestones explicitement commente comme temporaire/fictif (4 jalons 2023-2026). Remplacer chaque entree (year/title/description/image/alt) par les vrais evenements et dates de PossaCode, deja tracke dans context/current-feature.md, verifié par relecture du contenu affiche (plus aucune mention "temporaire"/"fictif" necessaire dans le commentaire du code).
```
