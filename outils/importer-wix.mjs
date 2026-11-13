// Import unique du site Wix d'Yves (https://ysoweb.wixstudio.com/photographie).
// Lit le catalogue de la banque d'images (collection CMS « MaSelection ») et les
// galeries des pages Accueil, Gomme et Alternatif, puis télécharge les images.
// Relançable : les images déjà présentes sont sautées.
//
//   node outils/importer-wix.mjs            tout
//   node outils/importer-wix.mjs --donnees  seulement les fiches (pas d'images)
//
// Ne sert plus une fois le site quitté : gardé pour mémoire.

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RACINE = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const B = 'https://ysoweb.wixstudio.com/photographie';
const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh) import-site-yves' };
const APP_DONNEES = '675bbcef-18d8-41f5-800e-131ec9e08762';
const APP_GALERIE = '14271d6f-ba62-d045-549b-ab972ae1f70e';
const PAGES = {
  accueil: '',
  gomme: '/gomme-bichromatee-yvespeyrot',
  alternatif: '/tiragesphotographiquesalternatifs-yvespeyrot',
};
const MINI = 400; // côté le plus long des vignettes, en px (les œuvres importées le 2026-11-13 sont en 480)
const seulementDonnees = process.argv.includes('--donnees');

const pays = JSON.parse(await fs.readFile(path.join(RACINE, 'src/data/pays.json'), 'utf8'));
const codes = new Set(pays.map((p) => p.code));

async function avecReprise(f, essais = 4) {
  for (let i = 1; ; i++) {
    try { return await f(); } catch (e) {
      if (i >= essais) throw e;
      await new Promise((r) => setTimeout(r, 1000 * i * i));
    }
  }
}
const texte = (u, o = {}) => avecReprise(async () => {
  const r = await fetch(u, { ...o, headers: { ...UA, ...(o.headers || {}) } });
  if (!r.ok) throw new Error(`${r.status} ${u}`);
  return r.text();
});
const json = async (u, o) => JSON.parse(await texte(u, o));
const octets = (u) => avecReprise(async () => {
  const r = await fetch(u, { headers: UA });
  if (!r.ok) throw new Error(`${r.status} ${u}`);
  return Buffer.from(await r.arrayBuffer());
});

// --- Catalogue -----------------------------------------------------------
const modele = await json(`${B}/_api/v2/dynamicmodel`);
const instDonnees = modele.apps[APP_DONNEES].instance;
const instGalerie = modele.apps[APP_GALERIE].instance;

const brut = [];
for (let offset = 0; ; offset += 1000) {
  const d = await json(`${B}/_api/cloud-data/v2/items/query`, {
    method: 'POST',
    headers: { Authorization: instDonnees, 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataCollectionId: 'MaSelection', query: { paging: { limit: 1000, offset } }, returnTotalCount: true }),
  });
  brut.push(...d.dataItems.map((x) => x.data));
  if (brut.length >= d.pagingMetadata.total || !d.dataItems.length) break;
}

const propre = (s) => (s || '').replace(/\s+/g, ' ').trim();
const vus = new Set();
const catalogue = [];
const sources = {};
for (const x of brut) {
  const id = propre(x.identifiant).toUpperCase();
  if (!/^[A-Z]{3}\d{4}$/.test(id)) { console.warn('identifiant ignoré :', x.identifiant); continue; }
  if (vus.has(id)) { console.warn('doublon ignoré :', id); continue; }
  vus.add(id);
  const prefixe = id.slice(0, 3);
  if (!codes.has(prefixe)) console.warn('préfixe sans pays dans pays.json :', id);
  const motsCles = [...new Set(propre(x.motsClefs).split(',').map((m) => m.trim()).filter(Boolean))];
  catalogue.push({ id, pays: prefixe, alt: propre(x.alt), description: propre(x.description), motsCles });
  sources[id] = x.url_hdef || x.url_vignette;
  if (!x.url_hdef) console.warn('pas de HD, vignette prise :', id);
}
catalogue.sort((a, b) => a.id.localeCompare(b.id));

// --- Galeries (Pro Gallery) ---------------------------------------------
const oeuvres = {};
const sourcesOeuvres = {};
for (const [nom, p] of Object.entries(PAGES)) {
  const html = await texte(B + p);
  const ids = [...new Set([...html.matchAll(/"galleryId":"([0-9a-f-]{36})"/g)].map((m) => m[1]))];
  const items = [];
  for (const g of ids) {
    const d = await json(`https://ysoweb.wixstudio.com/pro-gallery-webapp/v1/galleries/${g}?galleryId=${g}&offset=0&limit=200&state=PUBLISHED`, { headers: { Authorization: instGalerie } });
    for (const it of d.gallery?.items || []) if (!items.some((y) => y.mediaUrl === it.mediaUrl)) items.push(it);
  }
  const slugs = new Set();
  oeuvres[nom] = items.map((it, i) => {
    let slug = (it.name || `${nom}-${i + 1}`).replace(/\.[a-z0-9]+$/i, '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-|-$/g, '') || `${nom}-${i + 1}`;
    while (slugs.has(slug)) slug += '-b';
    slugs.add(slug);
    sourcesOeuvres[`${nom}/${slug}`] = it.mediaUrl.startsWith('http') ? it.mediaUrl : `https://static.wixstatic.com/media/${it.mediaUrl}`;
    return { image: slug, titre: propre(it.title), description: propre(it.description), alt: propre(it.alt) || propre(it.title) };
  });
  console.log(`${nom} : ${oeuvres[nom].length} œuvres (${ids.length} galerie(s))`);
}

// --- Images ---------------------------------------------------------------
async function enregistrer(buf, fichierHd, fichierMini, { largeurMax } = {}) {
  let img = sharp(buf);
  const meta = await img.metadata();
  let hd = buf;
  if (meta.format !== 'webp' || (largeurMax && meta.width > largeurMax)) {
    img = sharp(buf).rotate();
    if (largeurMax) img = img.resize({ width: largeurMax, withoutEnlargement: true });
    hd = await img.webp({ quality: 85 }).toBuffer();
  }
  await fs.writeFile(fichierHd, hd);
  const m2 = await sharp(hd).metadata();
  if (fichierMini) {
    await sharp(hd).resize({ width: MINI, height: MINI, fit: 'inside', withoutEnlargement: true }).webp({ quality: 74 }).toFile(fichierMini);
  }
  return { l: m2.width, h: m2.height };
}

async function parLots(liste, n, f) {
  let i = 0, faits = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < liste.length) {
      const x = liste[i++];
      await f(x);
      if (++faits % 100 === 0) console.log(`  ${faits}/${liste.length}`);
    }
  }));
}

const dims = JSON.parse(await fs.readFile(path.join(RACINE, 'outils/.dimensions.json'), 'utf8').catch(() => '{}'));
if (!seulementDonnees) {
  console.log('Images de la banque…');
  const echecs = [];
  await parLots(catalogue, 6, async (c) => {
    const hd = path.join(RACINE, 'public/photos/hd', `${c.id}.webp`);
    const mini = path.join(RACINE, 'public/photos/mini', `${c.id}.webp`);
    try {
      if (dims[c.id] && await fs.stat(hd).catch(() => null) && await fs.stat(mini).catch(() => null)) return;
      dims[c.id] = await enregistrer(await octets(sources[c.id]), hd, mini);
    } catch (e) { echecs.push(`${c.id} : ${e.message}`); }
  });
  await fs.writeFile(path.join(RACINE, 'outils/.dimensions.json'), JSON.stringify(dims));
  if (echecs.length) { console.error('ÉCHECS (relancer le script) :\n' + echecs.join('\n')); process.exitCode = 1; }

  console.log('Images des pages…');
  for (const [nom, liste] of Object.entries(oeuvres)) {
    const dossier = path.join(RACINE, 'public', nom === 'accueil' ? 'accueil' : 'oeuvres');
    await fs.mkdir(path.join(dossier, 'mini'), { recursive: true });
    for (const o of liste) {
      const hd = path.join(dossier, `${o.image}.webp`);
      const mini = nom === 'accueil' ? null : path.join(dossier, 'mini', `${o.image}.webp`);
      const cle = `${nom}/${o.image}`;
      if (!dims[cle] || !(await fs.stat(hd).catch(() => null))) {
        dims[cle] = await enregistrer(await octets(sourcesOeuvres[cle]), hd, mini, { largeurMax: nom === 'accueil' ? 2400 : 1600 });
      }
      Object.assign(o, dims[cle]);
    }
  }
  await fs.writeFile(path.join(RACINE, 'outils/.dimensions.json'), JSON.stringify(dims));
}

for (const c of catalogue) if (dims[c.id]) Object.assign(c, dims[c.id]);
await fs.writeFile(path.join(RACINE, 'src/data/catalogue.json'), JSON.stringify(catalogue, null, 1) + '\n');
await fs.writeFile(path.join(RACINE, 'src/data/oeuvres.json'), JSON.stringify(oeuvres, null, 2) + '\n');

const parPays = {};
for (const c of catalogue) parPays[c.pays] = (parPays[c.pays] || 0) + 1;
console.log(`Catalogue : ${catalogue.length} photos`, parPays);
console.log(`Sans dimensions : ${catalogue.filter((c) => !c.l).length}`);
