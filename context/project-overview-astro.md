## PossaCode Website — Project Overview

🌍 **Site web officiel de PossaCode** — une communauté de développeurs impactante en Afrique.

---

## 📌 Objectif du Projet

PossaCode est une association qui forme et réunit les développeurs du Congo et d'Afrique à travers des meetups, des hackathons et des conférences techniques.

Ce site web a pour but de :

- Présenter la communauté PossaCode et ses valeurs
- Informer sur les événements à venir (meetups, hackathons, conférences)
- Mettre en avant les membres et experts de la communauté
- Permettre aux développeurs de rejoindre la communauté
- Recevoir des dons pour soutenir les activités

➡️ **Un site vitrine moderne, impactant et à l'image de la dynamique africaine de PossaCode.**

---

## 👥 Public Cible

| Persona                   | Besoin                                              |
| ------------------------- | --------------------------------------------------- |
| Développeur débutant      | Se former, rejoindre une communauté bienveillante   |
| Développeur expérimenté   | Partager ses connaissances, intervenir en tant qu'expert |
| Entreprise / Partenaire   | Collaborer, sponsoriser, soutenir l'écosystème tech africain |
| Grand public / Curieux    | Découvrir la communauté, faire un don               |

---

## 📄 Pages du Site

### 1. Page d'Accueil (`/`)

Sections à développer :

- **Bannière d'annonce** — événement à venir (ex : PossaCode Dev Girls)
- **Hero** — slogan, mots-clés (#Former, #Partager, #Inspirer, #Orienter, #Réseauter), CTA "Nous Rejoindre"
- **Ils nous font confiance** — logos des partenaires (CGDT, ACDN, GalsenDev, UnionLab, Congo DevOps, etc.)
- **Qui sommes-nous ?** — présentation, stats (80+ membres, 1000+ personnes impactées)
- **Galerie membres** — photos de la communauté en action
- **Notre Vision / Mission / Valeurs** — 3 colonnes sur fond orange
- **Nos événements** — événement principal + liste des 3 derniers
- **Ces experts qui impactent notre communauté** — grille de portraits circulaires
- **Section CTA finale** — à définir

### 2. Page À Propos (`/about`)

- Histoire de PossaCode
- Équipe fondatrice
- Chiffres clés
- *(En cours de développement)*

### 3. Page Événements (`/event`)

- Liste de tous les événements passés et à venir
- *(En cours de développement)*

### 4. Page Contact (`/contact`)

- Formulaire de contact
- *(En cours de développement)*

---

## 🧱 Stack Technique

| Catégorie       | Choix                              |
| --------------- | ---------------------------------- |
| Framework       | **Astro**                          |
| Langage         | HTML / JavaScript (Astro)          |
| CSS / UI        | **TailwindCSS v4** (via Vite)      |
| Polices         | Google Fonts (Phudu, Nunito Sans, Archivo Black, Elsie Swash Caps) |
| Assets          | Images locales dans `src/assets/`  |
| Déploiement     | *(À définir)*                      |

---

## 🎨 Design System

### Couleurs

| Nom                  | Valeur HEX | Usage                                      |
| -------------------- | ---------- | ------------------------------------------ |
| `orange-possacode`   | `#F14D0E`  | Accent principal, boutons, mots-clés       |
| `blue-possacode`     | `#1A2251`  | Fond sombre, titres, textes importants     |
| Blanc                | `#FFFFFF`  | Fond clair, cartes                         |
| Crème                | `#FFF3EE`  | Fond hero section                          |

### Typographie

| Variable CSS             | Police            | Usage                        |
| ------------------------ | ----------------- | ---------------------------- |
| `--font-Phudu`           | Phudu             | Titres principaux (h1, h2)   |
| `--font-nunito`          | Nunito Sans       | Corps de texte, paragraphes  |
| `--font-Archivo-Black`   | Archivo Black     | Accents, labels              |
| `--font-Elsie-Swash-Caps`| Elsie Swash Caps  | Décoratif                    |

### Classes Utilitaires Personnalisées

```css
.boutton-hero       /* Bouton outline bleu (tags #Former, #Partager...) */
.boutton-standard   /* Bouton plein orange (CTAs principaux) */
.wave-line          /* Animation SVG trait ondulé sous les titres */
.card               /* Carte avec bordure bleue */
.text-shadow        /* Ombre portée sur texte */
```

---

## 🗂️ Structure du Projet

```
src/
├── assets/              # Images membres, partenaires, photos événements
│   └── par/             # Logos partenaires
├── components/
│   ├── header.astro     # Navigation sticky + logo + bouton don
│   └── Welcome.astro    # Composant de bienvenue
├── layouts/
│   └── Layout.astro     # Layout principal (bannière + header + slot)
├── pages/
│   ├── index.astro      # Page d'accueil
│   ├── about.astro      # Page à propos
│   ├── event.astro      # Page événements
│   └── contact.astro    # Page contact
└── styles/
    └── global.css       # Imports fonts, thème Tailwind, classes custom
```

---

## 🧩 Composants

### `header.astro`
- Logo PossaCode (lien vers `/`)
- Navigation : A-propos, Événements, Communauté, Nos Membres
- Bouton **"Faire un don"** (orange)
- Sticky + effet hover dégradé blanc → orange clair

### `Layout.astro`
- Bannière top (fond bleu, texte annonce en blanc/orange)
- Inclusion du `<Header />`
- `<slot />` pour le contenu des pages

---

## 🤝 Partenaires Actuels

- CGDT
- ACDN (Association des Codeurs Du Nord)
- GalsenDev
- UnionLab
- Congo DevOps
- 10 000 Codeurs
- *(Logo webp non nommé)*

---

## 👨‍💻 Experts Mis en Avant

- Modeste ASSIONBON
- Gédéon
- Ezéchiel Amen AGBLA
- Nadet
- Adonai Nangui
- *(et autres)*

---

## 🎯 Animations & UX

- **Trait ondulé animé** sous les titres de section (SVG `wave-line`, animation 2.5s infinie)
- **Hover photos** : légère rotation (`hover:rotate-3`) sur les images hero
- **Galerie membres** : expansion au survol (`hover:w-70`)
- **Portraits experts** : grille circulaire avec disposition en quinconce (row-span)
- **Header sticky** avec effet de dégradé au hover

---

## 🧭 Roadmap

### Phase 1 — Mise en place (En cours)
- [x] Setup Astro + TailwindCSS v4
- [x] Layout principal (bannière + header)
- [x] Page d'accueil — Hero
- [x] Page d'accueil — Partenaires
- [x] Page d'accueil — Qui sommes-nous
- [x] Page d'accueil — Vision / Mission / Valeurs
- [x] Page d'accueil — Événements
- [x] Page d'accueil — Section Experts
- [ ] Page d'accueil — Section CTA finale complète

### Phase 2 — Pages secondaires
- [ ] Page À Propos (contenu complet)
- [ ] Page Événements (liste dynamique)
- [ ] Page Contact (formulaire fonctionnel)

### Phase 3 — Finalisation
- [ ] Responsive mobile / tablette
- [ ] Optimisation SEO (meta tags, Open Graph)
- [ ] Optimisation images (Astro Image)
- [ ] Déploiement en production

---

## 📌 Statut

- En développement actif
- Page d'accueil quasi complète — pages secondaires à construire

---

🏗️ **PossaCode — Former. Partager. Inspirer. Orienter. Réseauter.**
