Create with Ailyn — Portfolio Website
An Awwwards-style portfolio rebuild for Ailyn, a digital marketer, graphic designer, video editor, and content creator. Rebuilt from her original Canva site into a fully custom, animation-driven experience.
Live site: https://ailyn-portfolio.vercel.app/
Overview
The original site was built in Canva and didn't reflect the quality of Ailyn's actual work. This rebuild focused on giving her portfolio the same level of polish as her content: a single pinned scroll timeline, real motion design, and a structure built around showcasing 90+ real work pieces (video, graphic design, social) rather than a static page.
Tech Stack
Framework: React + Next.js
Styling: Tailwind CSS + shadcn/ui
Animation: GSAP + ScrollTrigger (single master pinned timeline), Lenis smooth-scroll
Fonts: Synonym (headings), Amulya (body) — Fontshare
Deployment: Vercel
Key Features
One continuous pinned scroll experience across all 8 sections (Hero, Selected Work, Companies, Analytics, Services, About, Tools & Platforms, Contact) instead of independent per-section animations
Desktop-only smooth-scroll/pinned timeline, with a full native-scroll fallback on mobile and tablet — no forced pinning on small screens
Filterable work grid (All / Video / Graphic Design / Social) across 94 real pieces, with a masonry layout that correctly handles mixed aspect ratios (portrait 9:16 video alongside landscape stills)
Analytics/Results section rendered as real animated, scroll-triggered charts rather than static screenshots
Horizontal-scroll-pinned Services section on desktop, with a clean vertical fallback on mobile
Architecture Notes
The core of the site is a single master GSAP ScrollTrigger timeline (not separate triggers per section), inspired by high-end reference sites but built from scratch with free fonts and an original layout. Lenis is scoped to run only above 1280px with a fine pointer, so touch devices get native scroll behavior by default rather than an adapted version of the desktop experience.
Problems Solved Along the Way
Caught a silent failure where an AI coding agent reported the asset pipeline as complete but had never actually written the public/ assets folder to disk — fonts and media were missing despite a "successful" build.
Fixed a masonry grid bug where portrait (9:16) videos were being forced into a fixed landscape aspect ratio.
Migrated the site from screenshot-image based analytics to real chart components without losing the original reported figures.
Status
Actively maintained. Built in close collaboration with AI coding tools (ChatGPT and Claude), with all architecture, design, and content decisions directed and reviewed by me — scoping the work, catching failures, and making the calls on structure, motion, and visual direction.
Credits
Design direction and content: Ailyn
Development: Paquito John Espiritu
