# Portfolio Readability — Dark Content Column

**Date:** 2026-07-03  
**Status:** Approved

## Problem

After clicking PLAY, the portfolio content (intro, experience, projects, blogs, contact sections) renders directly over the BalatroBackground WebGL canvas. The animated, colorful background bleeds through section titles, intro text, and gaps between panels, making text hard to read. The landing screen (before PLAY) is unaffected and untouched.

## Constraints

- Do not modify `BalatroBackground` or its props in any way.
- Do not add any overlay/dim layer on top of the background.
- Background must remain visible and animated in portfolio mode.
- Zero JSX changes — CSS only.

## Solution: Dark Content Column

Add a single `background` property to `.portfolioContent` using a horizontal linear-gradient. This creates a dark reading lane centered over the content column, fading to transparent at the left and right edges so the WebGL background glows around the sides.

```css
.portfolioContent {
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(6, 12, 18, 0.72) 14%,
    rgba(6, 12, 18, 0.72) 86%,
    transparent 100%
  );
}
```

**Why these values:**
- `rgba(6, 12, 18, 0.72)` — near-black with a cool blue tint matching the existing sticky nav bar color (`rgba(12, 20, 25, 0.82)`), at 72% opacity so the background remains visible.
- `14% / 86%` fade stops — covers the content column (sections max out at 780px wide) on typical viewports while leaving visible color bleed at edges. Tunable.

### Optional enhancement

```css
backdrop-filter: blur(3px);
-webkit-backdrop-filter: blur(3px);
```

Softens color bleed-through without modifying the background. Add to `.portfolioContent` alongside the gradient if the column still feels noisy after initial test.

## What this fixes

| Element | Before | After |
|---|---|---|
| `.introCard` text | Naked over animated bg | Sits inside dark lane |
| `.sectionTitle` | White text, text-shadow only | Dark lane underneath |
| `.sectionHint` | Very low contrast | Dark lane underneath |
| `.expPanel` / `.gridCard` / `.contactBox` | `rgba(0,0,0,0.55)` over bg | Same + column underneath — denser, adds depth |

## What does NOT change

- `BalatroBackground` component and all its props
- Landing mode (hero, profile badge, socials, nav island)
- Any JSX in `page.tsx`
- Any existing panel styles (`.expPanel`, `.gridCard`, etc.)

## Files to change

- `apps/personal-site/src/app/page.module.css` — add `background` (and optionally `backdrop-filter`) to `.portfolioContent`
