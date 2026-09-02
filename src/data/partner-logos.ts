export type PartnerLogo = {
    src: string;
    alt: string;
    class: string;
};

export const partnerLogos: PartnerLogo[] = [
    { src: '/assets/par/cgdt.jpg', alt: 'Logo partenaire CGDT', class: 'w-24 md:w-35 h-14 md:h-20 object-cover' },
    { src: "/assets/par/Logo de l'ACDN.png", alt: 'Logo partenaire ACDN', class: 'w-40 md:w-65 h-14 md:h-20 object-contain' },
    { src: '/assets/par/galsendev.jpg', alt: 'Logo partenaire GalsenDev', class: 'w-24 md:w-35 h-14 md:h-20 object-contain' },
    { src: '/assets/par/unionlab.jpg', alt: 'Logo partenaire UnionLab', class: 'w-24 md:w-35 h-16 md:h-25 object-cover' },
    { src: '/assets/par/logo.webp', alt: 'Logo partenaire Miabé Hackathon', class: 'w-36 md:w-55 h-14 md:h-20 object-contain' },
    { src: '/assets/par/logo-asso-10000codeurs.png', alt: 'Logo partenaire 10000 Codeurs', class: 'w-24 md:w-35 h-14 md:h-20 object-contain' },
];
