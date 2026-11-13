// Chargement et recherche dans le catalogue de la banque d'images.
import { lien } from '../lien.js';

export const normaliser = (s) =>
  String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’']/g, ' ');

let promesse = null;
export function chargerCatalogue() {
  promesse ||= fetch(lien('catalogue.json'))
    .then((r) => { if (!r.ok) throw new Error(`catalogue : ${r.status}`); return r.json(); })
    .then((liste) => liste.map((x) => ({
      id: x.i, alt: x.a, description: x.d, motsCles: x.k, l: x.l, h: x.h,
      pays: x.i.slice(0, 3),
      cherche: ' ' + normaliser([x.i, x.a, x.d, x.k].join(' ')).replace(/[^a-z0-9&]+/g, ' ') + ' ',
    })));
  return promesse;
}

// « CHI0099 », « chi 99 », « Chi099 » → CHI0099
export function identifiant(q) {
  const m = normaliser(q).trim().match(/^([a-z]{3})\s*0*(\d{1,4})$/);
  return m ? m[1].toUpperCase() + m[2].padStart(4, '0') : null;
}

// Tous les mots doivent être présents, au début d'un mot :
// « lac » trouve « lac » et « lacs », pas « glacier ».
export function chercher(liste, q) {
  const texte = normaliser(q).replace(/[^a-z0-9&]+/g, ' ').trim();
  if (!texte) return liste;
  const id = identifiant(q);
  if (id) return liste.filter((c) => c.id === id);
  const mots = texte.split(' ');
  return liste.filter((c) => mots.every((m) => c.cherche.includes(' ' + m)));
}
