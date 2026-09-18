# Production SEO: tools.brandique.in

Repository: mohansai5942/BrandiQue-Tools. Production default: https://tools.brandique.in.
The existing Google Search Console verification token is preserved. Bing verification remains optional. No placeholder verification codes are used.

## Deployment

Build command: npm run build. Static output: dist. Set SITE_URL=https://tools.brandique.in in the live hosting build environment if a previous value exists. The default also uses this domain. Run npm run check before publication.

## Search Console

In the verified https://tools.brandique.in/ property, open Sitemaps and submit sitemap.xml. The full URL is https://tools.brandique.in/sitemap.xml. The sitemap lists 52 canonical URLs: 37 tools, eight category hubs, the homepage, directory, human sitemap and four company/policy pages. Human sitemap: https://tools.brandique.in/sitemap/.

Use URL Inspection to check the homepage, a category page and representative tools. Search Console submission remains an account-side action; building a sitemap does not submit it. Monitor indexing, queries, selected canonicals and Core Web Vitals after real traffic is available. No keyword stuffing, fake ratings or guaranteed rankings are included.

The old Workers origin remains only in migration configuration. Redirect requests on the OLD hosting to the same path on tools.brandique.in, retaining legacy tool redirects. A redirect in this new repository cannot control the old hosting/account. Keep old-origin redirects for at least a year. Do not blindly replace previousOrigin with the new host; that can introduce loops.

SEO builds include descriptive tool titles, descriptions, WebSite/Organization/WebPage/WebApplication/BreadcrumbList data, category ItemLists, social cards, canonical links, sitemap.xml, robots.txt and old-path redirects. Category content is static and crawlable. The Node preview server returns 404 for unknown pages instead of a false-success homepage.
