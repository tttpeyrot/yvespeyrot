// Vérifie le catalogue et les images avant la mise en ligne (lancé aussi par le workflow GitHub).
//   npm run verifier
// Erreur (bloque la mise en ligne) : fiche sans image, identifiant en double ou mal formé,
// pays inconnu, site trop lourd pour GitHub Pages. Avertissement : fiche sans description.
import fs from 'node:fs/promises';
import path from 'node:path';

const RACINE = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const LIMITE_MO = 950; // GitHub Pages refuse les sites de plus de 1 Go
const lireJson = async (f) => JSON.parse(await fs.readFile(path.join(RACINE, f), 'utf8'));
const catalogue = await lireJson('src/data/catalogue.json');
const oeuvres = await lireJson('src/data/oeuvres.json');
const codes = new Set((await lireJson('src/data/pays.json')).map((p) => p.code));
const erreurs = [];
const avertissements = [];
const existe = (f) => fs.stat(path.join(RACINE, f)).then(() => true, () => false);

const vus = new Set();
for (const c of catalogue) {
  if (!/^[A-Z]{3}\d{4}$/.test(c.id)) erreurs.push(`identifiant mal formé : ${c.id}`);
  if (vus.has(c.id)) erreurs.push(`identifiant en double : ${c.id}`);
  vus.add(c.id);
  if (c.pays !== c.id.slice(0, 3) || !codes.has(c.pays)) erreurs.push(`${c.id} : pays « ${c.pays} » absent de src/data/pays.json`);
  if (!Array.isArray(c.motsCles)) erreurs.push(`${c.id} : motsCles doit être une liste`);
  if (!(await existe(`public/photos/hd/${c.id}.webp`))) erreurs.push(`${c.id} : image manquante (public/photos/hd/${c.id}.webp)`);
  if (!(await existe(`public/photos/mini/${c.id}.webp`))) erreurs.push(`${c.id} : vignette manquante (public/photos/mini/${c.id}.webp)`);
  if (!c.alt && !c.description) avertissements.push(`${c.id} : ni description ni texte alt`);
}
for (const [rubrique, liste] of Object.entries(oeuvres)) {
  const dossier = rubrique === 'accueil' ? 'accueil' : 'oeuvres';
  for (const o of liste) {
    if (!(await existe(`public/${dossier}/${o.image}.webp`))) erreurs.push(`${rubrique} : image manquante public/${dossier}/${o.image}.webp`);
    if (dossier === 'oeuvres' && !(await existe(`public/oeuvres/mini/${o.image}.webp`))) erreurs.push(`${rubrique} : vignette manquante public/oeuvres/mini/${o.image}.webp`);
  }
}

async function taille(d) {
  let t = 0;
  for (const f of await fs.readdir(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    t += f.isDirectory() ? await taille(p) : (await fs.stat(p)).size;
  }
  return t;
}
const mo = (await taille(path.join(RACINE, 'public'))) / 1e6;
if (mo > LIMITE_MO) erreurs.push(`le site pèse ${Math.round(mo)} Mo : GitHub Pages accepte 1 Go au plus. Voir « Si le site devient trop lourd » dans CLAUDE.md.`);

console.log(`${catalogue.length} photos, ${Object.values(oeuvres).flat().length} œuvres, images : ${Math.round(mo)} Mo sur ${LIMITE_MO} Mo possibles.`);
if (avertissements.length) console.warn(`Avertissements (${avertissements.length}) :\n  ${avertissements.slice(0, 30).join('\n  ')}`);
if (erreurs.length) {
  console.error(`ERREURS (${erreurs.length}) :\n  ${erreurs.slice(0, 50).join('\n  ')}`);
  process.exit(1);
}
console.log('Tout est en ordre.');
