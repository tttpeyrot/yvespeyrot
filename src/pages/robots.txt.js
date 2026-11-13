export function GET({ site }) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const plan = new URL(`${base}/sitemap-index.xml`, site).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${plan}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
