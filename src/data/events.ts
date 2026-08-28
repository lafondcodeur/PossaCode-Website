export type Event = {
    title: string;
    date: string;
    image: string;
    excerpt: string;
};

// Donnée fictive temporaire (demande explicite) : date et résumé sont des
// placeholders à remplacer par les vraies infos de l'événement avant mise
// en production (voir context/current-feature.md). Le titre et l'image sont
// repris tels quels de la carte existante, non modifiés par cette feature.
export const featuredEvent: Event = {
    title: 'Comment utiliser tailwindcss dans un projet Astro ?',
    date: '25 Mars 2026',
    image: '/assets/NOUS.jpg',
    excerpt:
        "Un atelier pratique pour apprendre à intégrer TailwindCSS dans un projet Astro : configuration du thème, organisation des classes utilitaires et bonnes pratiques pour un design responsive. Ouvert à tous les niveaux, un simple ordinateur portable suffit pour suivre l'atelier en direct.",
};
