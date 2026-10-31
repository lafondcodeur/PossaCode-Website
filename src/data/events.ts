import type { ImageMetadata } from 'astro';
import webinairePrixPoster from '../assets/events/webinaire-prix-2026.jpg';
import developpeurIaPoster from '../assets/events/developpeur-ere-ia-2025.jpeg';
import birthdayPoster from '../assets/events/possacode-birthday-2024.jpeg';
import devDayPoster from '../assets/events/devday-2024.png';
import etatDeveloppeursPoster from '../assets/events/etat-developpeurs-congo-2023.jpeg';

export type EventSpeaker = {
    name: string;
    role: string;
};

export type EventFigure = {
    value: string;
    label: string;
};

// Les champs optionnels alimentent la page détail (/event/{slug}) : chaque section n'y est
// affichée que si la donnée existe. Ne les renseigner qu'à partir d'informations réelles
// (affiche, annonce officielle) — rien d'inventé.
export type Event = {
    /** Identifiant d'URL : /event/{slug} */
    slug: string;
    /** Type d'événement tel qu'annoncé sur l'affiche */
    kind: string;
    title: string;
    /** Date affichée telle quelle sur le site */
    date: string;
    /** Dernier jour de l'événement (AAAA-MM-JJ) — sert à trier et à séparer "à venir" / "passés" au build */
    endDate: string;
    format?: string;
    /** Adresse ou plateforme de l'événement */
    location?: string;
    free?: boolean;
    image: ImageMetadata;
    alt: string;
    excerpt: string;
    programme?: string[];
    audience?: string[];
    speakers?: EventSpeaker[];
    figures?: EventFigure[];
    /** Lien d'inscription, affiché tant que l'événement est à venir */
    registrationUrl?: string;
    /** Lien du replay, affiché une fois l'événement passé */
    replayUrl?: string;
};

// Du plus récent au plus ancien.
export const events: Event[] = [
    {
        slug: 'webinaire-prix-site-web-2026',
        kind: 'Live webinaire',
        title: "Live Webinaire : fixer le bon prix pour un site web ou une application",
        date: 'Samedi 11 Juillet 2026 à 20h00 (heure de Brazzaville)',
        endDate: '2026-07-11',
        format: 'En ligne',
        image: webinairePrixPoster,
        alt: "Affiche du live webinaire PossaCode : fixer le bon prix pour un site web ou une application",
        excerpt:
            "Un live webinaire pour apprendre à fixer le juste prix d'un site web ou d'une application : structuration des devis, valorisation du temps et de l'expertise, négociation avec le client — des sujets rarement abordés en formation. Animé par un panel de professionnels du numérique (CEO, développeurs, technology strategy manager, ingénieure produit), en ligne et ouvert à tous.",
        speakers: [
            { name: 'Happy Tidjani', role: 'CEO Brillio, mentor et coach en développement web' },
            { name: 'Steve', role: 'Développeur web fullstack' },
            { name: 'Jaures Beinjamin', role: 'Technology Strategy Manager' },
            { name: 'Loïc Nguegang', role: 'SaaS Builder (JavaScript/TypeScript)' },
            { name: 'Laetitia Christelle', role: 'Product-Minded Software Engineer' },
        ],
    },
    {
        slug: 'developpeur-ere-ia-2025',
        kind: 'Mégaconférence',
        title: "Développeur à l'ère de l'IA : s'adapter ou disparaître ?",
        date: '22 au 24 Mai 2025',
        endDate: '2025-05-24',
        format: 'En ligne',
        location: 'Google Meet',
        image: developpeurIaPoster,
        alt: "Affiche de la mégaconférence en ligne PossaCode : Développeur à l'ère de l'IA, s'adapter ou disparaître ?",
        excerpt:
            "Trois jours de mégaconférence en ligne pour comprendre comment l'intelligence artificielle transforme le métier de développeur, et comment s'y préparer plutôt que de le subir.",
        programme: ['Panels de discussion', 'Networking', 'Success stories', 'Ateliers pratiques'],
    },
    {
        slug: 'possacode-birthday-2024',
        kind: 'Mégaconférence',
        title: 'PossaCode Birthday : comment accompagner les développeurs juniors en Afrique ?',
        date: '07 Septembre 2024',
        endDate: '2024-09-07',
        format: 'En ligne',
        location: 'Google Meet',
        free: true,
        image: birthdayPoster,
        alt: 'Affiche de la mégaconférence en ligne PossaCode Birthday',
        excerpt:
            "Une mégaconférence en ligne pour fêter l'anniversaire de PossaCode autour d'une question au cœur de notre mission : comment mieux accompagner les développeurs juniors en Afrique ?",
        programme: ['Panels de discussion', 'Networking', 'Success stories', 'Ateliers pratiques'],
        audience: ['Développeurs juniors', 'Développeurs seniors', 'Freelances'],
    },
    {
        slug: 'devday-2024',
        kind: 'DevDay',
        title: 'PossaCode DevDay — 2ème édition',
        date: '19 au 20 Juillet 2024',
        endDate: '2024-07-20',
        format: 'Brazzaville',
        image: devDayPoster,
        alt: "Affiche du PossaCode DevDay 2ème édition, 19 et 20 juillet 2024 : 1 salon, 20 conférences, 1 hackathon coding",
        excerpt:
            "Le plus grand rendez-vous des développeurs pour les développeurs au Congo-Brazzaville : un salon, 20 conférences, un hackathon de coding et plus de 20 exposants, pendant deux jours.",
        figures: [
            { value: '1', label: 'salon' },
            { value: '20', label: 'conférences' },
            { value: '1', label: 'hackathon de coding' },
            { value: '20+', label: 'exposants' },
        ],
    },
    {
        slug: 'etat-developpeurs-congo-2023',
        kind: 'Conférence',
        title: "L'état actuel des développeurs au Congo-Brazzaville (problèmes et solutions)",
        date: '01 Juillet 2023 à partir de 12h00',
        endDate: '2023-07-01',
        format: 'Brazzaville',
        location: '12 rue Matoumbou, arrêt Station Nzoko-Kisoundi, Brazzaville',
        free: true,
        image: etatDeveloppeursPoster,
        alt: "Affiche de la 1ère édition de la conférence PossaCode : L'état actuel des développeurs au Congo-Brazzaville (problèmes et solutions)",
        excerpt:
            "Première édition de la conférence PossaCode : un état des lieux des difficultés rencontrées par les développeurs au Congo-Brazzaville et des pistes de solutions pour les surmonter.",
        programme: ['Rencontres', "Partage d'expérience", 'Discussions', 'Opportunités', 'Découvertes'],
    },
];

// Calculé au moment du build : un événement reste "à venir" jusqu'à la fin de son dernier jour.
const today = new Date().toISOString().slice(0, 10);

export const isUpcoming = (event: Event) => event.endDate >= today;

export const upcomingEvents = events.filter(isUpcoming).reverse();
export const pastEvents = events.filter((event) => !isUpcoming(event));
