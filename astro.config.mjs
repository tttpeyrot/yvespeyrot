// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Adresse du site et chemin de base : donnés par le workflow GitHub
// (actions/configure-pages). Ils changent tout seuls avec l'adresse :
// yvespeyrot.github.io/yvespeyrot-site/ aujourd'hui, yvespeyrot.github.io/ si le dépôt
// est renommé yvespeyrot.github.io, un vrai domaine demain.
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
