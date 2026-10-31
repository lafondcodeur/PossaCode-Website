import type { ImageMetadata } from 'astro';
import heriPhoto from '../assets/heri.jpg';
import a3Photo from '../assets/A3.jpg';
import engroupePhoto from '../assets/engroupe.jpg';
import groupePhoto from '../assets/groupe.jpg';

export type HistoryMilestone = {
    year: string;
    title: string;
    description: string;
    image: ImageMetadata;
    alt: string;
};

// Jalons tirés des événements réellement organisés par PossaCode (voir src/data/events.ts et les affiches dans src/assets/events/).
export const historyMilestones: HistoryMilestone[] = [
    {
        year: '2023',
        title: 'Première conférence PossaCode',
        description: "Le 1er juillet 2023, la toute première conférence PossaCode dresse l'état des lieux des développeurs au Congo-Brazzaville : les problèmes qu'ils rencontrent et les solutions pour avancer ensemble.",
        image: heriPhoto,
        alt: 'Membre de PossaCode animant une session de formation devant un poster de présentation',
    },
    {
        year: '2024',
        title: 'PossaCode DevDay, 2ème édition',
        description: 'Les 19 et 20 juillet 2024 à Brazzaville : un salon, 20 conférences, un hackathon de coding et plus de 20 exposants réunis pour le plus grand rendez-vous des développeurs du pays.',
        image: a3Photo,
        alt: "Membres de la communauté PossaCode collaborant ensemble autour d'une tablette",
    },
    {
        year: '2025',
        title: "Développeur à l'ère de l'IA",
        description: "Du 22 au 24 mai 2025, trois jours de mégaconférence en ligne pour aider les développeurs africains à s'adapter à l'arrivée de l'intelligence artificielle dans leur métier.",
        image: engroupePhoto,
        alt: "Membres de la communauté PossaCode réunis lors d'un événement",
    },
    {
        year: '2026',
        title: 'Lancement de PossaCode Dev Girls',
        description: "Première rencontre des PossaCode Dev Girls le 16 mai 2026, pour encourager et accompagner les femmes dans le développement, au sein d'une communauté de plus de 80 membres actifs.",
        image: groupePhoto,
        alt: 'Grand groupe de membres de la communauté PossaCode réunis',
    },
];
