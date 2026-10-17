/**
 * Vercel Edge Middleware — refuses command-line downloaders.
 *
 * curl / wget / python / node-fetch / axios / httrack and friends either send
 * no User-Agent at all or send their tool's own name, so they get a 403.
 * Real browsers (and search crawlers such as Googlebot, which must stay able to
 * index the site) pass through untouched.
 *
 * Honest limits: this stops casual `wget -r` / `curl` mirroring, not a
 * determined person — anything served to a browser can be saved from DevTools,
 * and a User-Agent can be spoofed. It is a speed bump, not a lock.
 *
 * Verify after deploying:
 *   curl -I https://chiliapp.vercel.app/app.html     -> 403 Forbidden
 *   browser opens it normally                         -> 200
 */
const DOWNLOADER = /\b(curl|wget|python[-_a-z0-9.]*|requests|urllib|aiohttp|httpx|axios|node[-_a-z0-9.]*|undici|httpie|go-http-client|okhttp|java\/|libwww|lwp-|httrack|webcopier|scrapy|aria2|sqlmap|nikto|nmap|masscan)\b/i;

export function middleware(request) {
  const ua = (request.headers.get('user-agent') || '').trim();

  // a browser always identifies itself; a bare socket often does not
  if (!ua || DOWNLOADER.test(ua)) {
    return new Response('Forbidden', {
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
        'x-robots-tag': 'noindex'
      }
    });
  }
  // otherwise let the request continue to the static files
}

export const config = {
  matcher: '/:path*'
};
