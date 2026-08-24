import { slugify } from '../utils/slug';
import { membersDirectory } from './members-directory';

export type MemberPreview = {
    name: string;
    role: string;
    image: string;
    link: string;
    /** Identifiant utilisé pour la page de profil `/members/[slug]`. */
    slug: string;
};

// Données fictives temporaires (demande explicite de l'utilisateur, voir
// context/current-feature.md) : nom, rôle et lien de profil sont des
// placeholders à remplacer par les vraies informations des membres avant
// mise en production. Les photos elles-mêmes (public/assets/*.png) sont des
// visuels génériques déjà utilisés ailleurs sur le site, pas des portraits
// de personnes identifiées. N'alimente que le bandeau du héro de la page
// Nos Membres — voir `members-directory.ts` pour la section annuaire
// filtrable, qui reprend ces 6 mêmes personnes en tête de liste (même
// fonction `slugify`, donc mêmes slugs et donc mêmes pages de profil).
const membersPreviewSeed: Omit<MemberPreview, 'slug'>[] = [
    { name: 'Yannick Mavoungou', role: 'Développeur Full-Stack', image: '/assets/homme2.png', link: 'https://linkedin.com/in/yannick-mavoungou' },
    { name: 'Chloé Bakala', role: 'UI/UX Designer', image: '/assets/femme1.png', link: 'https://linkedin.com/in/chloe-bakala' },
    { name: 'Steve Loemba', role: 'Ingénieur DevOps', image: '/assets/homme1.png', link: 'https://linkedin.com/in/steve-loemba' },
    { name: 'Aïcha Moukala', role: 'Data Analyst', image: '/assets/femme2.png', link: 'https://linkedin.com/in/aicha-moukala' },
    { name: 'Brice Ondongo', role: 'Développeur Mobile', image: '/assets/homme3.png', link: 'https://linkedin.com/in/brice-ondongo' },
    { name: 'Grace Nsimba', role: 'Cheffe de projet technique', image: '/assets/femme3.png', link: 'https://linkedin.com/in/grace-nsimba' },
];

export const membersPreview: MemberPreview[] = membersPreviewSeed.map((member) => ({
    ...member,
    slug: slugify(member.name),
}));

// Le carrousel a besoin de plus de 6 cartes pour qu'il y ait réellement quelque chose à faire
// défiler une fois les cartes remises à leur taille d'origine (voir MemberCarousel.astro). Complété
// avec des membres déjà générés dans members-directory.ts (avatar DiceBear, pas une photo réelle —
// même limite déjà documentée) plutôt que des photos trouvées sur internet : ni faisable avec les
// outils disponibles (pas de récupération de fichier binaire), ni souhaitable (attribuerait le
// visage d'une vraie personne à une identité fictive). Ces membres ont déjà une page de profil
// valide via `getStaticPaths()` dans members/[slug].astro (généré depuis membersDirectory).
const featuredNames = new Set(membersPreviewSeed.map((member) => member.name));
const carouselFillerMembers: MemberPreview[] = membersDirectory
    .filter((member) => !featuredNames.has(member.name))
    .slice(0, 6)
    .map((member) => ({
        name: member.name,
        role: member.role,
        image: member.image,
        link: member.link,
        slug: member.slug,
    }));

export const membersCarousel: MemberPreview[] = [...membersPreview, ...carouselFillerMembers];
