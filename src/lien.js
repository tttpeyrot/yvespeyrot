// Toutes les adresses internes passent par ici, pour que le site marche
// aussi bien à la racine d'un domaine que dans un sous-dossier (/yvespeyrot/).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const lien = (chemin = '') => `${BASE}/${String(chemin).replace(/^\//, '')}`;
export const photoHd = (id) => lien(`photos/hd/${id}.webp`);
export const photoMini = (id) => lien(`photos/mini/${id}.webp`);
export const pagePhoto = (id) => lien(`photo/${id.toLowerCase()}/`);
