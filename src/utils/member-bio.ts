import type { MemberCategory } from '../data/members-directory';

// Bio générée à partir du profil du membre (rôle, catégorie, compétences), pas
// écrite individuellement : couvre les ~60 membres de l'annuaire (dont la
// majorité sont déjà des profils fictifs générés, voir members-directory.ts)
// sans avoir à rédiger une biographie par personne. Placeholder temporaire au
// même titre que le reste des données membres, à remplacer avant mise en
// production par de vraies biographies.
const categoryIntro: Record<MemberCategory, string> = {
    developpeur: "au développement logiciel",
    design: "au design produit et à l'expérience utilisateur",
    devops: "aux infrastructures et à la fiabilité des systèmes",
    data: "à l'analyse et à la valorisation des données",
    'chef-de-projet': "au pilotage et à la coordination de projets techniques",
};

export function buildMemberBio(member: { name: string; role: string; category: MemberCategory; skills: string[] }): string {
    const { name, role, category, skills } = member;
    const skillsList = skills.join(', ');
    const intro = categoryIntro[category];

    return `Membre de la communauté PossaCode, ${name} exerce en tant que ${role} et s'intéresse ${intro}. `
        + `Compétences clés : ${skillsList}. `
        + `${name} contribue à des projets collaboratifs au sein de la communauté et reste à l'écoute de nouvelles opportunités de collaboration, `
        + `que ce soit pour rejoindre une équipe, échanger sur des projets techniques ou partager des connaissances avec d'autres membres.`;
}
