// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// Pas de domaine personnalisé acheté pour l'instant (site déployé sur Vercel
// uniquement) : dérive `site` de l'URL Vercel du build plutôt que de coder en
// dur un domaine non possédé. VERCEL_PROJECT_PRODUCTION_URL (domaine de prod
// stable du projet) est prioritaire sur VERCEL_URL (URL du déploiement en
// cours, y compris preview) ; se rabat sur localhost hors Vercel.
const site = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:4321";

// https://astro.build/config
export default defineConfig({
  site,
  vite: {
    plugins: [tailwindcss()],
  },
});
