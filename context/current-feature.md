## Current Feature — PossaCode Website

> Ce fichier décrit la fonctionnalité ou la section en cours de développement.  
> Mettre à jour à chaque changement de focus.

---

## 🔧 Feature en cours

**Section : Page d'accueil — Section CTA finale**

La dernière section de la page d'accueil (`index.astro`) est encore un placeholder (`bg-blue-possacode h-200`). Elle doit être conçue et implémentée.

---

## 🎯 Objectif

Créer une section de clôture de la homepage qui incite l'utilisateur à passer à l'action : rejoindre la communauté, assister à un événement, ou faire un don.

---

## ✅ Critères d'acceptation

- [ ] La section a un fond visuellement distinct (ex : bleu possacode ou dégradé)
- [ ] Elle contient un titre accrocheur
- [ ] Elle contient au moins un CTA principal ("Nous Rejoindre" ou "Faire un don")
- [ ] Elle est cohérente avec le design system (couleurs, typographie, boutons)
- [ ] Elle s'intègre visuellement avec la section "Experts" qui la précède

---

## 📍 Fichier concerné

- `src/pages/index.astro` — dernière `<section>` (ligne ~259)

---

## 🗒️ Notes

- Voir `project-overview-astro.md` pour le design system complet
- Les classes de boutons disponibles : `.boutton-standard`, `.boutton-hero`
- Couleurs : `bg-blue-possacode` (#1A2251), `text-orange-possacode` (#F14D0E)
