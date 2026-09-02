export type HistoryMilestone = {
    year: string;
    title: string;
    description: string;
    image: string;
    alt: string;
};

// Jalons temporaires (fictifs) — à remplacer par les vraies dates et événements de PossaCode avant mise en production.
export const historyMilestones: HistoryMilestone[] = [
    {
        year: '2023',
        title: 'Naissance de PossaCode',
        description: "Un noyau de développeurs passionnés se réunit pour donner vie à une communauté tech pensée pour et par la jeunesse africaine.",
        image: '/assets/heri.jpg',
        alt: 'Membre de PossaCode animant une session de formation devant un poster de présentation',
    },
    {
        year: '2024',
        title: 'Premier hackathon communautaire',
        description: 'PossaCode organise son tout premier hackathon, réunissant développeurs et porteurs de projets autour de défis techniques.',
        image: '/assets/A3.jpg',
        alt: 'Membres de la communauté PossaCode collaborant ensemble autour d\'une tablette',
    },
    {
        year: '2025',
        title: '1000 personnes impactées',
        description: 'Le cap symbolique des 1000 personnes accompagnées est franchi grâce aux formations et événements organisés.',
        image: '/assets/engroupe.jpg',
        alt: "Membres de la communauté PossaCode réunis lors d'un événement",
    },
    {
        year: '2026',
        title: "PossaCode aujourd'hui",
        description: "Plus de 80 membres actifs et une communauté toujours grandissante, portée par une vision claire pour l'avenir.",
        image: '/assets/groupe.jpg',
        alt: 'Grand groupe de membres de la communauté PossaCode réunis',
    },
];
