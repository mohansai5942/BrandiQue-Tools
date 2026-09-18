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
