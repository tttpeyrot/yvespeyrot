// Catalogue léger, lu par la banque d'images et par la page « Ma sélection ».
import catalogue from '../data/catalogue.json';

export function GET() {
  const leger = catalogue.map((c) => ({ i: c.id, a: c.alt, d: c.description, k: c.motsCles.join(', '), l: c.l, h: c.h }));
  return new Response(JSON.stringify(leger), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
