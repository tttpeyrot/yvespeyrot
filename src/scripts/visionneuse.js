// Fenêtre photo : ← → pour changer, Échap pour fermer, glisser au doigt,
// espace ou ▶ pour le diaporama (une photo toutes les 4 s).
import { basculer, contient } from './selection.js';

const DUREE_DIAPO = 4000;

export function creerVisionneuse({ selection = false } = {}) {
  const el = document.getElementById('visionneuse');
  const img = el.querySelector('.vis-img');
  const q = (s) => el.querySelector(s);
  const btnSel = q('.vis-sel');
  const lienFiche = q('.vis-lien');
  let items = [];
  let i = 0;
  let minuterie = null;
  let avant = null; // élément qui avait le focus avant l'ouverture

  function afficher() {
    const it = items[i];
    if (!it) return;
    el.classList.add('charge');
    img.onload = () => el.classList.remove('charge');
    img.onerror = () => el.classList.remove('charge');
    img.src = it.src;
    img.alt = it.alt || it.titre || '';
    q('.vis-id').textContent = it.id || '';
    q('.vis-titre').textContent = it.titre || '';
    q('.vis-texte').textContent = it.texte || '';
    q('.vis-compteur').textContent = `${i + 1} / ${items.length}`;
    btnSel.hidden = !(selection && it.id);
    if (selection && it.id) majSelection();
    lienFiche.hidden = !it.lien;
    if (it.lien) lienFiche.href = it.lien;
    // Les voisines se chargent d'avance
    for (const d of [1, -1]) {
      const v = items[(i + d + items.length) % items.length];
      if (v) new Image().src = v.src;
    }
  }

  function majSelection() {
    const oui = contient(items[i].id);
    btnSel.setAttribute('aria-pressed', String(oui));
    btnSel.textContent = oui ? '✓ Dans ma sélection' : '+ Ajouter à ma sélection';
  }

  const aller = (d) => { i = (i + d + items.length) % items.length; afficher(); };

  function lecture(oui) {
    clearInterval(minuterie);
    minuterie = null;
    el.classList.toggle('diapo', oui);
    q('.vis-lecture').textContent = oui ? '❚❚' : '▶';
    q('.vis-lecture').setAttribute('aria-label', oui ? 'Mettre en pause (espace)' : 'Lancer le diaporama (espace)');
    if (oui) minuterie = setInterval(() => aller(1), DUREE_DIAPO);
  }

  function fermer() {
    lecture(false);
    el.hidden = true;
    img.removeAttribute('src');
    document.documentElement.style.overflow = '';
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    avant?.focus?.();
  }

  function ouvrir(liste, index = 0, { diaporama = false } = {}) {
    if (!liste.length) return;
    items = liste;
    i = Math.max(0, Math.min(index, liste.length - 1));
    avant = document.activeElement;
    el.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    afficher();
    q('.vis-fermer').focus();
    lecture(diaporama);
    if (diaporama) el.requestFullscreen?.().catch(() => {});
  }

  q('.vis-fermer').addEventListener('click', fermer);
  q('.vis-prec').addEventListener('click', () => { aller(-1); if (minuterie) lecture(true); });
  q('.vis-suiv').addEventListener('click', () => { aller(1); if (minuterie) lecture(true); });
  q('.vis-lecture').addEventListener('click', () => lecture(!minuterie));
  btnSel.addEventListener('click', () => { basculer(items[i].id); majSelection(); });
  document.addEventListener('selection', () => { if (!el.hidden && selection && items[i]?.id) majSelection(); });
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && minuterie && el.hidden) lecture(false); });

  document.addEventListener('keydown', (e) => {
    if (el.hidden) return;
    if (e.key === 'Escape') fermer();
    else if (e.key === 'ArrowLeft') aller(-1);
    else if (e.key === 'ArrowRight') aller(1);
    else if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); lecture(!minuterie); }
    else if (e.key === 'Tab') {
      // Le focus reste dans la fenêtre
      const f = [...el.querySelectorAll('button:not([hidden]), a:not([hidden])')];
      const k = f.indexOf(document.activeElement);
      if (e.shiftKey && k <= 0) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && k === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });

  // Glisser au doigt
  let x0 = null, y0 = null;
  const scene = q('.vis-scene');
  scene.addEventListener('pointerdown', (e) => { x0 = e.clientX; y0 = e.clientY; });
  scene.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0, dy = e.clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dy) < 80) aller(dx < 0 ? 1 : -1);
  });
  // Un clic sur le fond noir ferme
  scene.addEventListener('click', (e) => { if (e.target === scene) fermer(); });

  return { ouvrir, fermer };
}
