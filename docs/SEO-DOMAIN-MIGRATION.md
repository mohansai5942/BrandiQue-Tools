# BrandiQue SEO and custom-domain activation

The build defaults to the currently working Workers domain. Do not point canonical links at an unavailable domain.

## Connect tools.brandique.in

1. In the existing Cloudflare Worker, add tools.brandique.in as a custom domain. Complete DNS setup and wait for HTTPS to work. Keep the same project and routes.
2. Set the Cloudflare **build environment variable** SITE_URL to https://tools.brandique.in and redeploy. Alternatively change the default in src/site.mjs. This changes every canonical, Open Graph URL, structured-data URL, robots sitemap reference and sitemap entry together.
3. The build generates a permanent old-host redirect preserving the path. Verify the old Workers URL and a deep tool URL return 301 to the new domain. If the deployment does not honor cross-host _redirects, configure the same host-specific redirect in the Worker/Cloudflare; do not redirect the new host to itself.
4. Verify both origins in Google Search Console. Supply the real HTML verification token through GOOGLE_SITE_VERIFICATION if using URL-prefix properties, or verify the domain through DNS. BING_SITE_VERIFICATION supports Bing's real token. No verification token or ownership claim is fabricated.
5. Submit https://tools.brandique.in/sitemap.xml in Search Console and Bing Webmaster Tools. Inspect the homepage and several tools with URL Inspection; request indexing where needed. Use Search Console's Change of Address tool if available for the verified move.
6. Keep the old-host redirects for at least a year. Monitor indexing, selected canonical URLs, crawl errors and search queries. Rankings can fluctuate during a move.

## Verification

Run npm run check for the active build. Run SITE_URL=https://tools.brandique.in npm run build followed by SITE_URL=https://tools.brandique.in npm run qa to validate the future-domain variant before activation. Restore the normal build before deploying on the old domain.

## What is implemented

- Unique descriptive titles and descriptions across all 37 tools and six site pages.
- Static canonical links and readable page content; WebSite, Organization, WebPage, BreadcrumbList and WebApplication JSON-LD. No fake reviews, ratings or ranking claims.
- Directory ItemList, existing related-tool links and crawlable tool cards.
- Open Graph/Twitter cards with a local 1200×630 social image.
- Sitemap containing only canonical pages, crawlable robots.txt and permanent redirects for old HTML/renamed tool URLs.
- Automated checks for duplicate/missing metadata, schema validity, mixed origins, social image files and migration redirects.

Search Console submission and ownership verification require account access and have not been performed by the code build. Search rankings, AI recommendations and rich results cannot be guaranteed. Useful original content, reliable tools, legitimate links and continued improvements remain necessary.

References:
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
