// Ajoute au site les photos posées dans le dossier a-ajouter/.
//
//   npm run photos -- islande        banque d'images (ou ISL, france, FRA, chili…)
//   npm run photos -- gomme          œuvres de la page Gomme bichromatée
//   npm run photos -- alternatif     œuvres de la page Tirages alternatifs
//   npm run photos -- accueil        panoramas du diaporama de l'accueil
//
// Banque d'images : pour chaque photo (JPEG, PNG, TIFF, WebP, AVIF, HEIC), dans l'ordre des noms :
//   - donne l'identifiant suivant du pays (ISL0443, ISL0444…) ;
//   - fait l'image du site (1 050 px de côté, WebP) et la vignette (400 px) ;
//   - ajoute sa fiche à src/data/catalogue.json, avec description, texte alt et
//     mots-clés vides, que Claude remplit ensuite en regardant la photo.
// Œuvres et accueil : ajoute chaque image à la fin de sa rubrique dans
// src/data/oeuvres.json (titre = nom du fichier, à corriger), en 1 600 px
// (2 400 px pour les panoramas de l'accueil).
// Dans tous les cas, l'original est rangé dans a-ajouter/deja-ajoutees/ (rien
// n'est effacé) et un aperçu JPEG est mis dans a-ajouter/apercus/.
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const RACINE = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DOSSIER = path.join(RACINE, 'a-ajouter');
const HD = 1050;
const MINI = 400; // vignettes de la banque d'images (les œuvres : 480 px)
const EXTENSIONS = /\.(jpe?g|png|tiff?|webp|avif|heic|heif)$/i;

const pays = JSON.parse(await fs.readFile(path.join(RACINE, 'src/data/pays.json'), 'utf8'));
const demande = (process.argv[2] || '').trim();
const normal = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const RUBRIQUES = { gomme: 1600, alternatif: 1600, accueil: 2400 };
const rubrique = Object.keys(RUBRIQUES).find((r) => normal(demande).startsWith(r));
const p = pays.find((x) => [x.code, x.nom, x.bouton, x.slug].some((v) => normal(v) === normal(demande)));
if (!p && !rubrique) {
  console.error(`Indiquez le pays des photos, par exemple : npm run photos -- islande
Pays connus : ${pays.map((x) => `${x.nom} (${x.code})`).join(', ')}.
Pour les œuvres : npm run photos -- gomme | alternatif | accueil
Pour un nouveau pays, ajoutez-le d'abord dans src/data/pays.json (code de 3 lettres).`);
  process.exit(1);
}

const fichiers = (await fs.readdir(DOSSIER, { withFileTypes: true }))
  .filter((f) => f.isFile() && EXTENSIONS.test(f.name))
  .map((f) => f.name)
  .sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));
if (!fichiers.length) {
  console.error('Aucune photo dans le dossier a-ajouter/ (formats acceptés : JPEG, PNG, TIFF, WebP, AVIF, HEIC).');
  process.exit(1);
}

// Les HEIC d'iPhone ne sont pas lus par sharp : on passe par sips (fourni avec macOS).
async function lire(fichier) {
  try {
    await sharp(fichier).resize(16).toBuffer(); // décode vraiment (un HEIC passe metadata() mais pas le décodage)
    return fichier;
  } catch (e) {
    if (process.platform !== 'darwin') throw e;
    const tmp = path.join(os.tmpdir(), `ajout-${Date.now()}.jpg`);
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '95', fichier, '--out', tmp], { stdio: 'ignore' });
    return tmp;
  }
}

await fs.mkdir(path.join(DOSSIER, 'deja-ajoutees'), { recursive: true });
await fs.mkdir(path.join(DOSSIER, 'apercus'), { recursive: true });
const ranger = (source, nom, cle) => fs.rename(source, path.join(DOSSIER, 'deja-ajoutees', `${cle} - ${nom}`));

if (rubrique) {
  const fichierOeuvres = path.join(RACINE, 'src/data/oeuvres.json');
  const oeuvres = JSON.parse(await fs.readFile(fichierOeuvres, 'utf8'));
  const dossier = path.join(RACINE, 'public', rubrique === 'accueil' ? 'accueil' : 'oeuvres');
  const pris = new Set(Object.values(oeuvres).flat().map((o) => o.image));
  const faites = [];
  for (const nom of fichiers) {
    const titre = nom.replace(/\.[^.]+$/, '');
    let image = titre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-|-$/g, '') || 'image';
    while (pris.has(image)) image += '-2';
    pris.add(image);
    try {
      const source = path.join(DOSSIER, nom);
      const hd = await sharp(await lire(source)).rotate().resize({ width: RUBRIQUES[rubrique], height: RUBRIQUES[rubrique], fit: 'inside', withoutEnlargement: true })
        .toColourspace('srgb').webp({ quality: 85 }).toBuffer();
      await fs.writeFile(path.join(dossier, `${image}.webp`), hd);
      if (rubrique !== 'accueil') {
        await sharp(hd).resize({ width: 480, height: 480, fit: 'inside' }).webp({ quality: 74 }).toFile(path.join(dossier, 'mini', `${image}.webp`));
      }
      await sharp(hd).resize({ width: 1600, height: 1600, fit: 'inside' }).jpeg({ quality: 82 }).toFile(path.join(DOSSIER, 'apercus', `${image}.jpg`));
      const { width: l, height: h } = await sharp(hd).metadata();
      oeuvres[rubrique].push({ image, titre, description: '', alt: '', l, h });
      await ranger(source, nom, image);
      faites.push(`${image}  ←  ${nom}  (${l} × ${h})`);
    } catch (e) {
      console.error(`ÉCHEC pour ${nom} : ${e.message}`);
    }
  }
  await fs.writeFile(fichierOeuvres, JSON.stringify(oeuvres, null, 2) + '\n');
  console.log(`${faites.length} image(s) ajoutée(s) à la rubrique « ${rubrique} » :\n${faites.join('\n')}`);
  if (faites.length) console.log(`\nÀ faire maintenant : corriger « titre », remplir « description » et « alt » dans src/data/oeuvres.json (rubrique ${rubrique}), puis npm run verifier.`);
  process.exit(0);
}

const fichierCatalogue = path.join(RACINE, 'src/data/catalogue.json');
const catalogue = JSON.parse(await fs.readFile(fichierCatalogue, 'utf8'));
let numero = Math.max(0, ...catalogue.filter((c) => c.pays === p.code).map((c) => Number(c.id.slice(3))));

const ajoutees = [];
for (const nom of fichiers) {
  const source = path.join(DOSSIER, nom);
  const id = `${p.code}${String(++numero).padStart(4, '0')}`;
  if (numero > 9999) throw new Error(`Plus de numéros libres pour ${p.code}.`);
  try {
    const entree = await lire(source);
    const hd = await sharp(entree).rotate().resize({ width: HD, height: HD, fit: 'inside', withoutEnlargement: true })
      .toColourspace('srgb').webp({ quality: 85 }).toBuffer();
    await fs.writeFile(path.join(RACINE, 'public/photos/hd', `${id}.webp`), hd);
    await sharp(hd).resize({ width: MINI, height: MINI, fit: 'inside' }).webp({ quality: 72 })
      .toFile(path.join(RACINE, 'public/photos/mini', `${id}.webp`));
    await sharp(hd).jpeg({ quality: 82 }).toFile(path.join(DOSSIER, 'apercus', `${id}.jpg`));
    const { width: l, height: h } = await sharp(hd).metadata();
    catalogue.push({ id, pays: p.code, alt: '', description: '', motsCles: [], l, h });
    await ranger(source, nom, id);
    ajoutees.push(`${id}  ←  ${nom}  (${l} × ${h})`);
  } catch (e) {
    numero--;
    console.error(`ÉCHEC pour ${nom} : ${e.message}`);
  }
}

catalogue.sort((a, b) => a.id.localeCompare(b.id));
await fs.writeFile(fichierCatalogue, JSON.stringify(catalogue, null, 1) + '\n');
console.log(`${ajoutees.length} photo(s) ajoutée(s) en ${p.nom} :\n${ajoutees.join('\n')}`);
if (ajoutees.length) {
  console.log(`\nÀ faire maintenant : remplir « alt », « description » et « motsCles » de ces fiches dans src/data/catalogue.json
(aperçus dans a-ajouter/apercus/), puis npm run verifier.`);
}
