## AI Interaction Guidelines — PossaCode Website

> Ce fichier définit les règles et le contexte à fournir à l'IA pour obtenir les meilleures réponses sur ce projet.

---

## 🤖 Contexte à toujours fournir à l'IA

1. **`context/project-overview-astro.md`** — pour connaître le projet, le stack, le design system
2. **`context/current-feature.md`** — pour savoir sur quelle feature tu travailles en ce moment
3. Le fichier `.astro` concerné par la tâche

---

## 📐 Règles de code à respecter

### Tailwind

- Utiliser uniquement les couleurs du thème : `orange-possacode`, `blue-possacode`
- Ne pas utiliser de couleurs Tailwind standards là où les couleurs PossaCode s'appliquent
- Respecter les classes utilitaires existantes : `.boutton-hero`, `.boutton-standard`, `.wave-line`

### Typographie

- Titres principaux : `font-Phudu font-bold`
- Corps de texte : `font-nunito`
- Ne pas introduire de nouvelles polices sans mise à jour de `global.css`

### Composants

- Toujours utiliser le `<Layout>` pour les nouvelles pages
- Le header est inclus dans `Layout.astro`, ne pas le réimporter dans les pages
- Importer `global.css` uniquement si la page n'utilise pas `<Layout>`

### Animations

- Le trait ondulé animé sous les titres utilise toujours le même pattern SVG + classe `.wave-line`
- Ne pas introduire d'autres librairies d'animation

---

## 🚫 À éviter

- Ne pas utiliser de framework JS (React, Vue, Svelte) — ce projet est Astro pur
- Ne pas ajouter de dépendances npm sans discussion préalable
- Ne pas modifier `global.css` sans mettre à jour `project-overview-astro.md`
- Ne pas casser la cohérence visuelle (couleurs, espacements, typographie)

---

## 💬 Prompts utiles

### Créer une nouvelle section

```
En te basant sur le design system de context/project-overview-astro.md,
crée une section [NOM] pour la page [PAGE].
La section doit utiliser les couleurs orange-possacode et blue-possacode,
la police Phudu pour les titres et Nunito pour le texte.
```

### Créer une nouvelle page

```
Crée la page [NOM] en Astro en utilisant le composant <Layout>.
Elle doit suivre le design system décrit dans context/project-overview-astro.md.
```

### Déboguer un style Tailwind

```
Ce projet utilise TailwindCSS v4 via Vite (pas de tailwind.config.js).
Le thème est défini dans src/styles/global.css via @theme {}.
```

---

## 📁 Fichiers de contexte

| Fichier                             | Rôle                                               |
| ----------------------------------- | -------------------------------------------------- |
| `context/project-overview-astro.md` | Vue d'ensemble complète du projet                  |
| `context/current-feature.md`        | Feature en cours de développement                  |
| `context/ai-interaction.md`         | Ce fichier — règles et prompts pour l'IA           |
| `src/styles/global.css`             | Thème Tailwind, polices, classes utilitaires       |
| `src/layouts/Layout.astro`          | Layout principal à réutiliser sur toutes les pages |
