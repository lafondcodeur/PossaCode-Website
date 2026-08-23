export type MemberPreview = {
    name: string;
    role: string;
    image: string;
    link: string;
};

// Données fictives temporaires (demande explicite de l'utilisateur, voir
// context/current-feature.md) : nom, rôle et lien de profil sont des
// placeholders à remplacer par les vraies informations des membres avant
// mise en production. Les photos elles-mêmes (public/assets/*.png) sont des
// visuels génériques déjà utilisés ailleurs sur le site, pas des portraits
// de personnes identifiées. N'alimente que le bandeau du héro de la page
// Nos Membres — voir `members-directory.ts` pour la section annuaire
// filtrable, qui reprend ces 6 mêmes personnes en tête de liste.
export const membersPreview: MemberPreview[] = [
    { name: 'Yannick Mavoungou', role: 'Développeur Full-Stack', image: '/assets/homme2.png', link: 'https://linkedin.com/in/yannick-mavoungou' },
    { name: 'Chloé Bakala', role: 'UI/UX Designer', image: '/assets/femme1.png', link: 'https://linkedin.com/in/chloe-bakala' },
    { name: 'Steve Loemba', role: 'Ingénieur DevOps', image: '/assets/homme1.png', link: 'https://linkedin.com/in/steve-loemba' },
    { name: 'Aïcha Moukala', role: 'Data Analyst', image: '/assets/femme2.png', link: 'https://linkedin.com/in/aicha-moukala' },
    { name: 'Brice Ondongo', role: 'Développeur Mobile', image: '/assets/homme3.png', link: 'https://linkedin.com/in/brice-ondongo' },
    { name: 'Grace Nsimba', role: 'Cheffe de projet technique', image: '/assets/femme3.png', link: 'https://linkedin.com/in/grace-nsimba' },
];
