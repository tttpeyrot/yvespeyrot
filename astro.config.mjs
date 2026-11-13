// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Adresse du site et chemin de base : donnés par le workflow GitHub
// (actions/configure-pages). Ils changent tout seuls avec l'adresse :
// tttpeyrot.github.io/yvespeyrot/ → yvespeyrot.github.io/ → vrai domaine.
const site = process.env.SITE || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !/\/(selection|404)\/?$/.test(page) })],
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
