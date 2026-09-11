# Scroll interaction pass

Applied across all built sections: I Hero, II Selected Work, III Analytics/Results, IV Companies, V About Ailyn, VI Services, VII Tools & Platforms, VIII Contact.

- Fixed left rail reuses the existing Create with Ailyn signature styling. The active chapter follows scroll position and links navigate to all eight built sections.
- Chapter labels added above existing content. Existing copy and asset files were not changed.
- Alternating surfaces across the complete sequence: hero/contact orange-to-black gradients, paper work/about, dark companies/services/tools, and paper analytics. Chapter labels use the confirmed eight-chapter order.
- Three reversible horizontal boundary wipes use GSAP ScrollTrigger, from the bottom of the viewport to 65% viewport height. The hero retains its existing entrance motion and gradient.
- Reduced motion disables wipe scrubbing; chapter tracking and anchor navigation remain. Plain content and anchors remain usable without JavaScript.
- ResizeObserver refreshes trigger measurements when the work filter or Show more work changes document height. Observers and GSAP contexts are cleaned up on unmount.

## Section-specific treatment

V About Ailyn and VIII Contact are inside the master stage with standard
clip-path wipes. About keeps its reading copy stable and gives only the
portrait a gentle parallax reveal.
VI Services uses its approved four categories (Creative & Content, Marketing &
Growth, Social & Customer Relationships, Web & Ecommerce), desktop-only
horizontal scrubbing with measured travel distance, and a normal vertical stack
on mobile/tablet or reduced motion. Services does not join the standard wipe
sequence.

## Verification

Production build and TypeScript passed. Browser checks verified desktop master
mode with one pin spacer, mobile native mode with zero pin spacers, all eight
section labels, the verified Upwork CTA, and no horizontal overflow at 390px.
Reduced-motion emulation selected native mode, removed the pin spacer,
disabled clip-path transitions and Services translation, and exposed the
static Hero role list. Full-site QA also verified forward/reverse master
progress, chapter-anchor navigation, Services re-entry, and lightbox
Escape/focus restoration. Safari and physical-device testing were unavailable
on the Windows host.

Reference pattern: https://khanhnguyen.design/ (chapter progression and navigation structure; no copied content, typography or assets).
