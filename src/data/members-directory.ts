import { slugify } from '../utils/slug';

export type MemberCategory = 'developpeur' | 'design' | 'devops' | 'data' | 'chef-de-projet';

export type DirectoryMember = {
    name: string;
    role: string;
    image: string;
    link: string;
    /** URL GitHub fictive (voir context/current-feature.md), même limite que `link`. */
    github: string;
    /** Identifiant unique utilisé pour la page de profil `/members/[slug]`. */
    slug: string;
    category: MemberCategory;
    rating: number;
    reviewCount: number;
    skills: string[];
    featured?: boolean;
};

export const memberCategories: { id: MemberCategory; label: string }[] = [
    { id: 'developpeur', label: 'Développeur' },
    { id: 'design', label: 'Design' },
    { id: 'devops', label: 'DevOps' },
    { id: 'data', label: 'Data' },
    { id: 'chef-de-projet', label: 'Chef de projet' },
];

// Nombre de cartes affichées par catégorie dans la section "Découvrez nos
// talents" de la page Nos Membres (demande explicite de l'utilisateur).
const MEMBERS_PER_CATEGORY = 12;

// Avatar généré (pas une photo réelle) : dégradé aux couleurs PossaCode +
// initiales, rendu en SVG à la volée par l'API publique DiceBear
// (https://www.dicebear.com/), seed = nom complet donc stable/déterministe
// d'un build à l'autre. Utilisé uniquement pour les membres fictifs générés
// ci-dessous — les 6 membres "réels" du bandeau héro gardent leurs photos.
const generatedAvatar = (seed: string) =>
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear&backgroundColor=1a2251,f14d0e&fontFamily=Verdana&fontSize=42`;

// Données fictives temporaires (voir context/current-feature.md) : à
// remplacer par les vraies informations des membres avant mise en
// production, même limite déjà documentée pour members-preview.ts et
// experts.ts.
const firstNames = [
    'Merveil', 'Divin', 'Christian', 'Ghislain', 'Patrick', 'Rodrigue', 'Fabrice', 'Landry',
    'Junior', 'Prince', 'Exaucé', 'Dady', 'Fiacre', 'Aristide', 'Rock', 'Blaise',
    'Prisca', 'Belvie', 'Rosette', 'Nadège', 'Carelle', 'Bethy', 'Reine', 'Fortunée',
    'Josiane', 'Christelle', 'Bénédicte', 'Grâcia', 'Merveille', 'Odette',
];

const lastNames = [
    'Malonga', 'Bemba', 'Kimbembe', 'Ngouabi', 'Okemba', 'Batantou', 'Mabiala', 'Miakassissa',
    'Tsiba', 'Ngoma', 'Massamba', 'Poaty', 'Mouko', 'Bantsimba', 'Ossieno', 'Kouka',
    'Mampouya', 'Ngakosso', 'Obambi', 'Loubaki',
];

const roleSkillsByCategory: Record<MemberCategory, { roles: string[]; skills: string[] }> = {
    developpeur: {
        roles: ['Développeur Backend', 'Développeur Frontend', 'Développeur Full-Stack', 'Développeur Mobile', 'Ingénieur Logiciel', 'Développeur WordPress', 'Développeur Java', 'Développeur Python', 'Intégrateur Web', 'Développeur API'],
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Vue.js', 'Django', 'Express', 'MongoDB', 'Next.js', 'GraphQL', 'Docker', 'PHP'],
    },
    design: {
        roles: ['UI Designer', 'UX Designer', 'UI/UX Designer', 'Product Designer', 'Designer Graphique', 'Motion Designer', "Designer d'Interaction", 'Brand Designer', 'Designer Web', 'Designer Produit', 'Illustrateur Digital'],
        skills: ['Figma', 'Webflow', 'Illustrator', 'Photoshop', 'Sketch', 'Adobe XD', 'Framer', 'InVision', 'Canva', 'After Effects', 'Prototypage', 'Design System'],
    },
    devops: {
        roles: ['Ingénieur DevOps', 'SRE', 'Ingénieur Cloud', 'Administrateur Systèmes', 'Ingénieur Infrastructure', 'Ingénieur Plateforme', 'DevOps Engineer', 'Ingénieur Fiabilité', 'Ingénieur Réseaux', 'Ingénieur Sécurité Cloud', 'Ingénieur CI/CD'],
        skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Jenkins', 'Ansible', 'Azure', 'GCP', 'Linux', 'Prometheus', 'Grafana'],
    },
    data: {
        roles: ['Data Analyst', 'Data Scientist', 'Data Engineer', 'Analyste BI', 'Ingénieur Données', 'Analyste Décisionnel', 'Data Analyst Marketing', 'Statisticien', 'Consultant Data', 'Data Engineer Junior', 'Analyste Data Produit'],
        skills: ['Python', 'SQL', 'Power BI', 'Excel', 'Tableau', 'R', 'Machine Learning', 'ETL', 'Pandas', 'Spark', 'BigQuery', 'Looker'],
    },
    'chef-de-projet': {
        roles: ['Chef de Projet Technique', 'Product Owner', 'Scrum Master', 'Chef de Projet Digital', 'Coordinateur de Projet', 'Chef de Projet IT', 'Program Manager', 'Chef de Projet Agile', 'Responsable Livraison', 'Chef de Projet Junior', 'Product Manager'],
        skills: ['Jira', 'Scrum', 'Notion', 'Trello', 'Agile', 'Kanban', 'Confluence', 'Asana', 'Roadmapping', 'Reporting', 'Budgeting'],
    },
};

type MemberSeed = Omit<DirectoryMember, 'slug' | 'github'>;

// Les 6 membres "réels" du bandeau héro (voir members-preview.ts), repris ici
// en tête de chaque catégorie avec note/compétences en plus. Le reste de
// chaque catégorie est complété par des profils générés (avatar aléatoire,
// pas de photo) jusqu'à MEMBERS_PER_CATEGORY.
const featuredMemberSeeds: MemberSeed[] = [
    { name: 'Yannick Mavoungou', role: 'Développeur Full-Stack', image: '/assets/homme2.png', link: 'https://linkedin.com/in/yannick-mavoungou', category: 'developpeur', rating: 4.8, reviewCount: 6, skills: ['React', 'Node.js', 'PostgreSQL'] },
    { name: 'Chloé Bakala', role: 'UI/UX Designer', image: '/assets/femme1.png', link: 'https://linkedin.com/in/chloe-bakala', category: 'design', rating: 4.9, reviewCount: 8, skills: ['Figma', 'Webflow', 'Illustrator'], featured: true },
    { name: 'Steve Loemba', role: 'Ingénieur DevOps', image: '/assets/homme1.png', link: 'https://linkedin.com/in/steve-loemba', category: 'devops', rating: 4.7, reviewCount: 5, skills: ['Docker', 'Kubernetes', 'AWS'] },
    { name: 'Aïcha Moukala', role: 'Data Analyst', image: '/assets/femme2.png', link: 'https://linkedin.com/in/aicha-moukala', category: 'data', rating: 4.8, reviewCount: 7, skills: ['Python', 'SQL', 'Power BI'] },
    { name: 'Brice Ondongo', role: 'Développeur Mobile', image: '/assets/homme3.png', link: 'https://linkedin.com/in/brice-ondongo', category: 'developpeur', rating: 4.6, reviewCount: 4, skills: ['Flutter', 'Kotlin', 'Firebase'] },
    { name: 'Grace Nsimba', role: 'Cheffe de projet technique', image: '/assets/femme3.png', link: 'https://linkedin.com/in/grace-nsimba', category: 'chef-de-projet', rating: 4.9, reviewCount: 9, skills: ['Jira', 'Scrum', 'Notion'] },
];

function buildGeneratedMemberSeeds(): MemberSeed[] {
    const generated: MemberSeed[] = [];
    let globalIndex = 0;

    for (const { id: category } of memberCategories) {
        const alreadyPresent = featuredMemberSeeds.filter((m) => m.category === category).length;
        const toGenerate = MEMBERS_PER_CATEGORY - alreadyPresent;
        const { roles, skills } = roleSkillsByCategory[category];

        for (let i = 0; i < toGenerate; i++) {
            const firstName = firstNames[globalIndex % firstNames.length];
            const lastName = lastNames[(globalIndex * 7 + 3) % lastNames.length];
            const name = `${firstName} ${lastName}`;
            const role = roles[i % roles.length];
            const memberSkills = [
                skills[i % skills.length],
                skills[(i + 4) % skills.length],
                skills[(i + 8) % skills.length],
            ];
            const rating = Number((4.5 + (i % 6) * 0.1).toFixed(1));
            const reviewCount = 3 + ((i * 5 + globalIndex) % 20);

            generated.push({
                name,
                role,
                image: generatedAvatar(name),
                link: `https://linkedin.com/in/${slugify(name)}`,
                category,
                rating,
                reviewCount,
                skills: memberSkills,
            });

            globalIndex++;
        }
    }

    return generated;
}

// `slug` (route de la page de profil) et `github` (URL fictive, même limite
// que `link`) sont dérivés du nom plutôt que saisis à la main, pour éviter
// tout risque de désynchronisation entre les deux. Suffixe numérique ajouté
// en cas de collision de slug (peu probable mais possible vu le volume de
// noms générés par combinaison prénom/nom).
function withSlugAndGithub(seeds: MemberSeed[]): DirectoryMember[] {
    const seenSlugs = new Map<string, number>();

    return seeds.map((seed) => {
        const baseSlug = slugify(seed.name);
        const occurrence = seenSlugs.get(baseSlug) ?? 0;
        seenSlugs.set(baseSlug, occurrence + 1);
        const slug = occurrence === 0 ? baseSlug : `${baseSlug}-${occurrence + 1}`;

        return { ...seed, slug, github: `https://github.com/${slug}` };
    });
}

export const membersDirectory: DirectoryMember[] = withSlugAndGithub([
    ...featuredMemberSeeds,
    ...buildGeneratedMemberSeeds(),
]);
