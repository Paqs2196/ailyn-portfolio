## Current confirmed content decisions

- Final hero tagline added: "Elevating your brand by design, from strategy to screen." Existing supporting copy retained.
- All client logos cleared for public display without restrictions.
- Low-resolution and silent videos approved as-is. Previous replacement requests are closed.
- All six held p07 screenshots now appear in Analytics/Results, separate from Selected Work. Sixth screenshot is weekly insights, not year-in-review.
- Chapter order: I Hero; II Selected Work; III Analytics/Results; IV Companies; V About Ailyn; VI Services; VII Tools & Platforms; VIII Contact.
- About and Contact are now built as Chapters V and VIII inside the desktop master timeline. Services remains Chapter VI with a desktop horizontal card lane and mobile/tablet vertical stack.
- Production build passed; browser verified six loaded screenshots, correct order/active chapter and a single-column mobile grid without horizontal overflow.
# Create with Ailyn

## Approved scope
Personal portfolio for Ailyn: Digital Marketer, Graphic Designer, Video Editor, Content Creator. No AI positioning or inferred AI attribution.
Order: Hero → Selected Work → Companies → About Ailyn → Services → Tools & Platforms → Contact.
Build one section at a time. Phase 3 currently includes only the hero and necessary Next.js scaffolding. Do not replace Paquito's sibling portfolio-site app.

## Approved system
Burnt-orange-to-black 115-degree gradient; ivory type; peach accents. Clash Display 600 headlines, General Sans 400 body. Local fonts. Tailwind v4 CSS-first tokens are in app/globals.css. Hero CSS is isolated in components/hero.module.css. GSAP handles entrance and role transitions; CSS handles links. ScrollTrigger is reserved for later sections.
Motion: 3-second role hold, 600ms overlap transition; pause, hidden-tab/offscreen suspension, live reduced-motion preference and cleanup. Static full role description for assistive technology. No scroll hijacking.

## Sources and temporary destinations
Original site: https://createwithailyn.my.canva.site/portfolio
Portrait: original hero asset, portfolio/_assets/media/7b89aae39e01c5753df7a84292ba7b31.jpg. Copied unmodified to public/images/ailyn-portrait.jpg.
Contact verified from original site: https://www.upwork.com/freelancers/~0181b668887ab39954
View selected work now links to the local #selected-work section. No speculative email or social links.
The signature wording is preserved as typography; no separate logo artwork was provided.

## License verification — 2026-09-09
GSAP Standard No Charge license: https://gsap.com/community/standard-license/ (effective 2025-04-30, last modified 2025-05-30). Commercial websites and plugins including ScrollTrigger are covered without payment. This is a proprietary license, not unrestricted open source; restrictions cover competing visual animation builders and removal of proprietary notices.
Clash Display and General Sans: https://www.fontshare.com/fonts/clash-display and https://www.fontshare.com/fonts/general-sans
ITF Free Font License v2.0 (2026-08-17), verified on the live page: https://www.fontshare.com/licenses/itf-ffl . Commercial web use and self-hosting are explicitly permitted. No modification, subsetting, format conversion, sale, or third-party redistribution of font software. Do not publish the font files in a public source repository. Retain unmodified official WOFF2 files for this website. The client must obtain their own copy directly from Fontshare before handoff/deployment. A license copy is retained in public/fonts/ITF-FFL.txt.

## Next phase
Hero approved. Phase 3.5 extraction completed 2026-09-10: 100 portfolio assets (18 videos, 82 images) self-hosted in public/work; one decorative flower SVG excluded from counts. All videos passed full decode verification. See MEDIA-INVENTORY.md and media-manifest.json for exact files, source pages, categories, and quality/audio issues.

Proposed primary categories awaiting confirmation: Video 18, Graphic Design 19, Social 63 (57 graphics plus 6 analytics screenshots). Social graphics additionally have a Graphic Design tag; source galleries are largely unlabeled, so categorization is a proposal based on visible formats. Confirm whether analytics belongs in Selected Work and obtain requested originals before final selection. Selected Work has now been implemented; see the implementation checkpoint below.

Tagline provenance: “A little strategy. A lot of creativity.” is assistant-written draft copy, not copied from Ailyn’s Canva content. The user requested provenance confirmation; do not treat the tagline as approved source copy.

Remaining section treatments and service categories follow the approved conversation specification. Do not build additional sections without confirmation.

## Selected Work implementation
Categories approved. Six analytics screenshots (p07-01 through p07-06) remain preserved as held-results assets and are excluded from lib/work-data.json and all portfolio filters. Selected Work has 94 pieces: Video 18, Graphic Design 19, Social 57.
The assistant-written hero tagline has been removed. The hero CTA targets #selected-work. Three featured pieces (p06-02, p10-01, p14-04), primary-category filters, twelve-at-a-time grid, and keyboard-accessible native modal viewer are implemented. Working descriptions identify visible artwork; they are not new client claims. Low-resolution and silent originals remain in use with user approval pending replacements.
Optimized local WebP thumbnails are in public/work/thumbnails. The featured video uses a 720px viewing derivative in public/work/previews; the viewer uses the preserved full-size extraction. No original media was overwritten.

Companies section complete: 30 distinct self-hosted logos from 33 Canva assets. See docs/COMPANY-LOGOS.md and docs/company-logos.json for provenance, duplicate variants, and quality flags. Static light surface, responsive 6/4/2-column layout, CSS grayscale hover, focus-visible equivalent for future verified links. No company URLs supplied by source; all current logos are unlinked. Production build passed; browser verified 30 loaded images and no desktop/mobile horizontal overflow. Other sections unchanged in this phase.

Tools & Platforms complete: 37 identified source tools in four purpose groups; 3 unlabeled icons held pending identification (34 yellow arrow, 36 blue lighthouse, 42 lime looping mark). See docs/TOOLS-INVENTORY.md and docs/tool-assets.json. Self-hosted icons; no proficiency claims; reduced-motion-aware stagger on individual group entrance. Desktop and 390px browser checks: 37 images loaded, no horizontal overflow.

Scroll interaction pass complete across all built chapters. Fixed signature rail, current-chapter navigation, labels, alternating surfaces and GSAP boundary wipes are documented in docs/SCROLL-INTERACTIONS.md. This supersedes earlier light Companies/dark Tools surface notes. Content and assets preserved.

Typography update (2026-09-10): Synonym Semibold 600 for former Clash Display references; Amulya Regular 400 for former General Sans references, including inherited body/footer/labels. Original font sizes, line heights, letter spacing and weights unchanged. New official WOFF2 files are self-hosted through next/font/local with display swap. Fontshare family pages both identify Closed Source / ITF Free Font License. Live ITF FFL v2.0 dated 17 Aug 2026 rechecked: commercial web use and self-hosting allowed; font modification/subsetting/conversion and third-party redistribution restricted. Existing public/fonts/ITF-FFL.txt applies to both. Production build and browser family checks passed; no horizontal overflow at desktop or 390px. Shared tokens use the new pair.

Services Phase 6: four grouped service cards are implemented as Chapter VI. On eligible desktop viewports the existing master timeline scrubs the card lane horizontally during the Services scene; no second pin or Lenis instance is introduced. Tablet/mobile render the same content as a vertical stack.

About and Contact Phase 7: About Ailyn is a warm paper section using the approved portrait, existing positioning language, stable reading copy, and a gentle image reveal. Contact returns to the approved orange-to-black gradient, includes the Create with Ailyn signature, and links only to the verified Upwork profile. Both are native children of the master timeline and register Chapters V and VIII. All eight confirmed sections are now built; Phase 8 is the full-site QA pass.

Phase 8 full-site QA: TypeScript and production build pass. Desktop Chrome forward/reverse scroll, all eight chapter links, Services re-entry, reduced-motion emulation, emulated 390px mobile behavior, and lightbox keyboard/focus restoration were verified. A chapter-sync listener was added for Lenis scene updates, and Escape handling was made explicit for reliable dialog closure. Safari and physical-device testing were unavailable on the Windows host and remain the only external QA gaps.

Architecture Phase 1: Lenis 1.3.26 and empty desktop master pin shell implemented. Desktop query min1280 + fine hover + no reduced motion; native tablet/mobile branch verified.

Architecture Phase 2/3: Hero and Selected Work migrated into the master pinned timeline (masterState `hero-work`) — clip-path reveal, parallax, chapter registration, and video scene-visibility handoff implemented. TypeScript clean; full build + browser verification of Selected Work's migration specifically is still outstanding pending public/ assets.

Architecture Phase 4: scroll-foundation.tsx generalized from two hardcoded scenes to a scene list; Companies and Tools & Platforms migrated into the same master pinned timeline alongside Hero and Selected Work. Later phases added Analytics/Results, Services, About Ailyn, and Contact. See docs/SCROLL-FOUNDATION.md for the complete eight-scene implementation and responsive branching.
