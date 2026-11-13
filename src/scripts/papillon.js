// Vol du papillon de l'accueil : il entre en grand par la gauche, traverse la page
// en rapetissant, fait une boucle et se pose sur « ICI ».
// Trajectoires reprises telles quelles du code Velo qu'Yves avait écrit pour son
// site Wix (page d'accueil, wix-animations), avec ses trois versions :
// ordinateur (plus de 1 200 px de large), tablette (751 à 1 200 px), téléphone.
//
// Chaque point : x, y = décalage en pixels par rapport à la place finale (sur ICI),
// scale = taille (1 = taille posée), duration = durée en ms pour y aller,
// easing = « easeLinear » (vitesse constante) ou, par défaut, « easeInOutSine »
// (départ et arrivée en douceur). Le papillon se tourne tout seul dans le sens
// où il vole ; angleFinal force son angle (385° = un tour complet + 25°).

const ORDINATEUR = {
  depart: { x: -600, y: -100 },
  tailleDepart: 3,
  points: [
    { x: -550, y: -85, scale: 2.8, duration: 450 },
    { x: -500, y: -65, scale: 2.6, duration: 450 },
    { x: -450, y: -50, scale: 2.4, duration: 450 },
    { x: -400, y: -45, scale: 2.2, duration: 450 },
    { x: -350, y: -55, scale: 2, duration: 450 },
    { x: -300, y: -75, scale: 1.85, duration: 450 },
    { x: -250, y: -90, scale: 1.7, duration: 450 },
    { x: -200, y: -85, scale: 1.55, duration: 450 },
    { x: -150, y: -65, scale: 1.4, duration: 450 },
    { x: -100, y: -50, scale: 1.3, duration: 450 },
    { x: -50, y: -40, scale: 1.2, duration: 450 },
    { x: 0, y: -30, scale: 1.15, duration: 450 },
    { x: 100, y: -45, scale: 1.1, duration: 400 },
    { x: 200, y: -85, scale: 1.05, duration: 400 },
    { x: 300, y: -130, scale: 1, duration: 500 },
    { x: 330, y: -115, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: 365, y: -140, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: 405, y: -140, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: 445, y: -130, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: 480, y: -100, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: 505, y: -65, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: 515, y: -50, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: 510, y: 10, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: 490, y: 70, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: 455, y: 280, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: 405, y: 345, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: 345, y: 395, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: 275, y: 420, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: 180, y: 415, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: 80, y: 385, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: -20, y: 335, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: -110, y: 270, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: -180, y: 190, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: -210, y: 110, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: -170, y: 55, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: -90, y: 20, scale: 1, duration: 250, easing: 'easeLinear' },
    { x: 0, y: 0, scale: 1, duration: 700, easing: 'easeLinear', angleFinal: 385 },
  ],
};

// Tablette : la boucle d'Yves pour tablette, réduite à 59 % en largeur et 58 % en hauteur.
const BOUCLE_TABLETTE = [
  { x: -550, y: -85, scale: 1.95, duration: 450 },
  { x: -500, y: -65, scale: 1.85, duration: 450 },
  { x: -450, y: -50, scale: 1.75, duration: 450 },
  { x: -400, y: -45, scale: 1.65, duration: 450 },
  { x: -350, y: -55, scale: 1.55, duration: 450 },
  { x: -300, y: -75, scale: 1.45, duration: 450 },
  { x: -250, y: -90, scale: 1.35, duration: 450 },
  { x: -200, y: -85, scale: 1.25, duration: 450 },
  { x: -150, y: -65, scale: 1.2, duration: 450 },
  { x: -100, y: -50, scale: 1.18, duration: 450 },
  { x: -50, y: -40, scale: 1.16, duration: 450 },
  { x: 0, y: -30, scale: 1.15, duration: 450 },
  { x: 100, y: -45, scale: 1, duration: 400 },
  { x: 200, y: -85, scale: 1, duration: 400 },
  { x: 300, y: -130, scale: 1, duration: 500 },
  { x: 330, y: -115, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 365, y: -140, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 405, y: -140, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 445, y: -130, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 480, y: -100, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 505, y: -65, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 515, y: -50, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 510, y: 10, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 490, y: 70, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 455, y: 120, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 405, y: 155, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 345, y: 180, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 275, y: 190, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 205, y: 180, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 140, y: 155, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 85, y: 115, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 45, y: 70, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 20, y: 30, scale: 1, duration: 250, easing: 'easeLinear' },
  { x: 0, y: 0, scale: 1, duration: 700, easing: 'easeLinear', angleFinal: 385 },
];
const TABLETTE = {
  depart: { x: -354, y: -58 },
  tailleDepart: 2,
  points: BOUCLE_TABLETTE.map((p) => ({ ...p, x: 0.59 * p.x, y: 0.58 * p.y })),
};

const TELEPHONE = {
  depart: { x: -175, y: -55 },
  tailleDepart: 3,
  points: [
    { x: -165, y: -40, scale: 1.5, duration: 525, easing: 'easeLinear' },
    { x: -120, y: -35, scale: 1.5, duration: 675, easing: 'easeLinear' },
    { x: -20, y: -20, scale: 1.5, duration: 525, easing: 'easeLinear' },
    { x: 40, y: 0, scale: 1.5, duration: 600, easing: 'easeLinear' },
    { x: 95, y: 5, scale: 1.5, duration: 600, easing: 'easeLinear' },
    { x: 122, y: 10, scale: 1.5, duration: 525, easing: 'easeLinear' },
    { x: 130, y: 43, scale: 1.5, duration: 450, easing: 'easeLinear' },
    { x: 112, y: 85, scale: 1.5, duration: 525, easing: 'easeLinear' },
    { x: 75, y: 110, scale: 1.5, duration: 600, easing: 'easeLinear' },
    { x: 30, y: 125, scale: 1.5, duration: 675, easing: 'easeLinear' },
    { x: -20, y: 120, scale: 1.5, duration: 675, easing: 'easeLinear' },
    { x: -65, y: 90, scale: 1.5, duration: 600, easing: 'easeLinear' },
    { x: -91, y: 50, scale: 1.5, duration: 525, easing: 'easeLinear' },
    { x: -62.5, y: 15, scale: 1.5, duration: 525, easing: 'easeLinear' },
    { x: -32.5, y: 5, scale: 1, duration: 525, easing: 'easeLinear' },
    { x: -15, y: 0, scale: 1, duration: 525, easing: 'easeInOutSine' },
    { x: 0, y: 0, scale: 1, duration: 1050, easing: 'easeInOutSine', angleFinal: 385 },
  ],
};

const COURBES = { easeLinear: 'linear', easeInOutSine: 'cubic-bezier(0.37, 0, 0.63, 1)' };

function trajet() {
  const l = window.innerWidth, h = window.innerHeight;
  const telephoneCouche = l > h && h < 600;
  if (l > 1200) return ORDINATEUR;
  if (l > 750 && !telephoneCouche) return TABLETTE;
  return TELEPHONE;
}

// Même calcul que le code d'Yves : l'angle suit la direction du vol, sans faire
// de tour inutile (on garde l'angle le plus proche du précédent).
function imagesCles({ depart, tailleDepart, points }) {
  const total = points.reduce((t, p) => t + p.duration, 0);
  const etape = (x, y, angle, taille) => `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${taille})`;
  const cles = [{ offset: 0, transform: etape(depart.x, depart.y, 0, tailleDepart) }];
  let avant = depart, angle = 0, temps = 0;
  for (const p of points) {
    const dx = p.x - avant.x, dy = p.y - avant.y;
    let a = angle;
    if (dx !== 0 || dy !== 0) {
      a = (Math.atan2(dx, -dy) * 180) / Math.PI;
      a += 360 * Math.round((angle - a) / 360);
    }
    if (p.angleFinal !== undefined) a = p.angleFinal;
    // La courbe d'un point s'applique au trajet qui y mène : elle se met sur l'image clé d'avant.
    cles[cles.length - 1].easing = COURBES[p.easing || 'easeInOutSine'];
    temps += p.duration;
    cles.push({ offset: temps / total, transform: etape(p.x, p.y, a, p.scale) });
    avant = p; angle = a;
  }
  return { cles, total };
}

export function faireVoler(papillon) {
  const pose = () => papillon.classList.add('pose');
  if (!papillon.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return pose();
  const { cles, total } = imagesCles(trajet());
  const decoller = async () => {
    await papillon.querySelector('img')?.decode?.().catch(() => {});
    papillon.classList.add('vole');
    const vol = papillon.animate(cles, { duration: total, fill: 'both' });
    vol.onfinish = () => { pose(); papillon.classList.remove('vole'); vol.cancel(); };
  };
  // Il ne décolle que quand la page est vraiment à l'écran (pas dans un onglet en arrière-plan).
  if (document.visibilityState === 'visible') setTimeout(decoller, 500);
  else document.addEventListener('visibilitychange', function attendre() {
    if (document.visibilityState !== 'visible') return;
    document.removeEventListener('visibilitychange', attendre);
    setTimeout(decoller, 500);
  });
}
