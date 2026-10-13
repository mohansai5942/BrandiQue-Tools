# AdSense integration

Publisher: ca-pub-9587188804206049. The loader appears once per page. Slots:
- Display 1781948278: tool banners, large-desktop recommendation sidebar, other page banners.
- In-feed 2366860495, layout -ef+6k-30-ac+ty: after eight cards in the tools directory.
- In-article 9328856681: editorial information sections where those sections exist.
- Multiplex 2426738115: homepage and tool-page endings.

The largest tool layout has four slots, with the sidebar hidden on narrower screens and never initialized at zero width. Ads are labeled Advertisements and separated from uploads, downloads and interactive controls. Below-the-fold slots initialize near the viewport. No auto-refresh, click encouragement, fake ads or overlay placements are implemented. Auto ads are controlled in AdSense; if enabled, review their preview/exclusions to avoid duplicating manual placements near tool controls.

## Account-side actions

Confirm the site is approved/ready in AdSense. Publish Google's certified consent message in Privacy & messaging for relevant regions; the repository does not create or publish an account-side CMP. Existing Google consent controls are not bypassed. The privacy page now describes advertising requests/cookies and links to Google's controls.

The build generates https://tools.brandique.in/ads.txt with the publisher line. For subdomain inventory, check the ads.txt location shown in AdSense. The root domain brandique.in may also need the publisher line and/or a subdomain declaration pointing to tools.brandique.in. This repository cannot edit the separate root-domain website. Copy the publisher line into the root ads.txt if AdSense requests it; retain other authorized sellers.

Validate the live page source and ads.txt after deployment. Inventory code does not guarantee that Google fills an ad: approval, consent, demand and ad blockers affect serving. Do not click your own live ads to test them.

Sources:
https://support.google.com/adsense/answer/1346295
https://support.google.com/adsense/answer/13554116
https://support.google.com/adsense/answer/12171612

## September 2026 layout refinement
Tool pages place the first horizontal unit after the complete workspace. Two 160px vertical units use the outer gutters only at viewport widths of at least 1600px; they never shrink the tool itself. In-article and multiplex units remain below the workspace. Google-reported `unfilled` units collapse via CSS; unfill-optimized units remain untouched. Observed live requests returned `unfilled`, so increasing inventory cannot guarantee creatives. Check site approval, coverage, policy notices and consent in the publisher account. If Auto ads are enabled, exclude the workspace and top-of-page areas in the AdSense preview to retain this manual placement layout.

## October 2026: ads must never break a tool (QA report #2)

QA found Auto ads covering tool workspaces: ad-intent annotations over the Screenshot Editor canvas, a full-screen vignette on Image to PDF whose Close continued to another page (losing the user's work), and an overlay over the PDF Merger Download button. None of these come from the manual units in this repository — they are **Auto ads overlay / intent formats**, which are switched on in the AdSense account.

### What the code now does (automatic on every build)

- Manual units stay outside the tool: banner after the workspace (`ad-after-tool`, 48 px gap, reserved `min-height` to avoid layout shift), editorial/multiplex below, side rails only in the outer gutters at ≥1600 px. `scripts/ads-qa.mjs` fails the build if an ad appears above or inside a tool.
- Every link on `/tools/*` pages carries `data-google-vignette="false"` (Google's documented per-link vignette opt-out), so navigating away from a tool cannot trigger a vignette. Download links created by tools carry it too.
- The AdSense loader on tool pages has `data-overlays="bottom"`, so anchor ads can only appear at the bottom edge, never over the header or upload area. Tool pages also reserve ~110 px of bottom padding so the last controls can always be scrolled above a bottom anchor.
- The tool workspace wrapper has `google-anno-skip` (documented exclusion for ad-intent links/chips), plus `google-auto-ads-ignore` and `data-ad-exclude="true"` markers for the Excluded-areas tool.
- A `beforeunload` warning appears if the user tries to leave a tool page after loading a file (any cause: ad click, back button, link).
- The 404 page has no ads.

### What Mohan must change in the AdSense console (code cannot do this)

Overlay formats (vignette, anchor, side rail) are account settings. To stop them on tools.brandique.in:

1. Sign in at https://adsense.google.com → **Ads** → **By site**.
2. Click the **Edit** (pencil) icon next to **tools.brandique.in**.
3. Recommended — exclude the tool pages from Auto ads completely:
   **Page exclusions → Manage → Add exclusion** → URL `tools.brandique.in/tools` → choose **All pages under this section** → **Add**.
   (Manual ad units on those pages keep working; only Auto ads stop.)
4. Alternatively, keep Auto ads but turn off the disruptive formats for the whole site:
   **Overlay formats** → turn **off** *Vignette ads*, *Anchor ads* and *Side rail ads*. Optionally under **Intent-driven formats** turn off ad intents.
5. Optional: under **In-page formats → Excluded areas**, open the preview of a tool page and exclude the tool workspace area.
6. Click **Apply to site** and save. Changes take up to an hour.
7. Verify on a phone and a desktop in a private window: open Image to PDF, add images, click "All tools" — no full-screen ad should appear, and the browser should ask before leaving.

Sources: https://support.google.com/adsense/answer/9262311 (page exclusions), https://support.google.com/adsense/answer/9305577 (Auto ads settings: anchor, vignette, side rail), https://support.google.com/adsense/answer/17016693 (`data-google-vignette="false"`), https://support.google.com/adsense/answer/7478225 (`data-overlays="bottom"`), https://support.google.com/adsense/answer/15111968 (`google-anno-skip`).

## October 2026 retest: scroll-triggered vignettes

The full-screen ad that appeared **on scroll** comes from AdSense's *additional vignette triggers* (enabled by default since 9 Mar 2026). It is not triggered by links, so `data-google-vignette="false"` cannot stop it; only the account can. Code now also stamps the opt-out on links created after load (search results, download buttons) and revokes blob URLs of replaced results. In AdSense → Ads → Edit tools.brandique.in: add page exclusion `tools.brandique.in/tools` (all pages under it), **or** Overlay formats → turn off Vignette + Anchor (and Side rail), and Overlay formats → Advanced settings → untick *Allow additional triggers for vignette ads*. Apply to site. Source: https://support.google.com/adsense/answer/16531962
