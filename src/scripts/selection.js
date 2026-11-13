// « Ma sélection » : liste d'identifiants (FRA0001…) gardée dans le navigateur
// du visiteur. Aucun serveur : on la partage par un lien (selection/?ids=…).
const CLE = 'yp-selection';
let memoire = null; // si le stockage est bloqué (navigation privée…), on garde en mémoire

export function lire() {
  if (memoire) return [...memoire];
  try {
    const v = JSON.parse(localStorage.getItem(CLE) || '[]');
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
  } catch { return []; }
}

function ecrire(liste) {
  const propre = [...new Set(liste)];
  try { localStorage.setItem(CLE, JSON.stringify(propre)); memoire = null; } catch { memoire = propre; }
  document.dispatchEvent(new CustomEvent('selection', { detail: propre }));
}

export const contient = (id) => lire().includes(id);
export const ajouter = (...ids) => ecrire([...lire(), ...ids]);
export const retirer = (id) => ecrire(lire().filter((x) => x !== id));
export const vider = () => ecrire([]);
export function basculer(id) {
  if (contient(id)) { retirer(id); return false; }
  ajouter(id); return true;
}

// Prévient la page quand la sélection change, y compris depuis un autre onglet.
export function suivre(f) {
  document.addEventListener('selection', (e) => f(e.detail));
  window.addEventListener('storage', (e) => { if (e.key === CLE) f(lire()); });
  f(lire());
}

// Lien de partage : identifiants séparés par des points.
export const versLien = (ids, base) => `${base}?ids=${ids.join('.')}`;
export const depuisLien = (txt) =>
  [...new Set(String(txt || '').toUpperCase().split(/[.,;\s]+/).filter((x) => /^[A-Z]{3}\d{4}$/.test(x)))];
