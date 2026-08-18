export type Expert = {
    name: string;
    role: string;
    image: string;
    link: string;
};

// Données fictives temporaires (demande explicite) : nom, rôle et lien
// LinkedIn/portfolio sont des placeholders à remplacer par les vraies infos
// des experts avant mise en production (voir context/current-feature.md).
export const experts: Expert[] = [
    { name: 'Modeste Assiongbon', role: 'Ingénieur Backend', image: '/assets/ModesteASSIONGBON.jpg', link: 'https://linkedin.com/in/modeste-assiongbon' },
    { name: 'Gédéon Koffi', role: 'Développeur Mobile', image: '/assets/gedeon.jpg', link: 'https://linkedin.com/in/gedeon-koffi' },
    { name: 'Ezéchiel Amen Agbla', role: 'Architecte Cloud', image: '/assets/EzechielAmenAGBLA.png', link: 'https://linkedin.com/in/ezechiel-amen-agbla' },
    { name: 'Nadège Traoré', role: 'Formatrice Frontend', image: '/assets/nadet.png', link: 'https://linkedin.com/in/nadege-traore' },
    { name: 'Sarah Diop', role: 'Data Scientist', image: '/assets/_DSC0979.jpg', link: 'https://linkedin.com/in/sarah-diop' },
    { name: 'Adonaï Nangui', role: 'DevOps Engineer', image: '/assets/AdonaiNangui.jpeg', link: 'https://linkedin.com/in/adonai-nangui' },
];
