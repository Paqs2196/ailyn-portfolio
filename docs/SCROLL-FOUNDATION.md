# Scroll architecture: Phase 7 — About and Contact complete

The desktop master track now owns eight migrated scenes:

- Hero
- Selected Work
- Analytics/Results
- Companies
- About Ailyn
- Services
- Tools & Platforms
- Contact

Services is a native child of the master track. Its local top is measured from
the same scene list as the other migrated sections, and it receives:

- `services:start` / `services:end` labels in the shared
  chapter registry;
- `data-scene-visible` publication from master progress;
- ResizeObserver coverage through the master track and scene list.

Unlike the standard migrated scenes, Services does not receive a clip-path
wipe. During its desktop timeline range, the master timeline scrubs the four
category cards from their initial position to the measured horizontal overflow
distance. This is the horizontal-scroll-within-pin treatment; it does not
create a second Lenis instance or an independent pin.

On tablet and mobile, the desktop media query does not initialize the master
timeline at all. Services therefore renders as a normal vertical card stack
with no horizontal transform and no pinning.

About Ailyn and Contact use the standard scene path. They are measured by local
top position, receive shared chapter labels, scene visibility state, wipe
reveal, parallax/ResizeObserver coverage, and live chapter ranges. About uses a
gentle image-only parallax reveal while its reading copy remains stable.
Contact closes the track with the verified Upwork destination and the existing
Create with Ailyn signature treatment.

## Analytics entrance animations

Analytics keeps its existing IntersectionObserver-based card animation. Browser
verification inside the transformed master track showed that the observer
continues to receive real bounding-rect intersections: the chart cards reach
full opacity, trend lines draw in, and metric counters settle on their final
formatted values. No conversion to a separate scene-driven trigger was needed.

## Existing migration behavior

Selected Work's earlier migration remains active: featured videos consume the
master scene signal, image parallax is master-owned on desktop, and filter or
load-more reflow rebuilds measurements before refreshing ScrollTrigger.

Companies and Tools retain their own surface tokens. Tools' existing
IntersectionObserver entrance stagger remains intact and was previously
verified under the transformed track.

## Resize preservation tradeoff

The master recalculates local scene positions and total travel after resize or
content reflow. ScrollTrigger preserves the current timeline progress
proportionally across all five scenes rather than using the older two-zone
pixel-offset algorithm. This is robust for changing content heights but can be
slightly imprecise at a scene boundary during a resize.

## Intentional coexistence boundary

All eight confirmed chapters are now inside `[data-master-stage]`. No native
boundary-reveal wrappers are needed for About, Services, or Contact; the master
timeline owns their desktop presentation.

## Verification

- `npm.cmd run typecheck`: passing.
- `npm.cmd run build`: passing.
- Desktop browser: Services is a descendant of the master stage and the page
  has one pin spacer. Its card lane translates horizontally while the master
  track remains pinned.
- Desktop browser: About and Contact are descendants of the master stage,
  receive clip-path wipes, and expose Chapter V and Chapter VIII ranges.
- Tablet/mobile browser: Services renders four stacked cards, with no pin
  spacer and no horizontal overflow.
- Tablet/mobile browser: About and Contact remain in native document flow with
  no desktop pinning or horizontal overflow.
- Full-site QA: desktop forward and reverse scroll reached progress `0.000`
  through `1.000`; Services translated while entering/re-entering its pinned
  range in both directions.
- Full-site QA: all eight chapter links reached their intended anchors. The
  chapter rail now also listens to master scene updates so Lenis-driven anchor
  navigation updates its active state after the animation settles.
- Full-site QA: reduced-motion emulation selected native mode, removed the pin
  spacer, disabled clip-path transitions and Services translation, and exposed
  the static Hero role list.
- Full-site QA: the Selected Work lightbox opened from a keyboard-focused
  thumbnail, supported ArrowRight navigation, closed with Escape, restored
  focus to the opener, and restored body scrolling.
- Safari and physical-device coverage were unavailable on the Windows test
  host; Chrome desktop and emulated 390px mobile were verified instead.
- Analytics browser verification: all six cards render, five numeric metrics
  and both weekly values settle to their final values, and card opacity reaches
  `1` under the transformed track.
- Phase diff count: non-zero (`about-ailyn.tsx`, `about-ailyn.module.css`,
  `contact.tsx`, `contact.module.css`, `scroll-foundation.tsx`, `app/page.tsx`,
  `scroll-chapters.tsx`, and docs).
- Tablet/mobile behavior remains native scroll with no Lenis pin.
