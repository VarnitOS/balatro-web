# Balatro Personal Website — Build Instructions

## Permissions & context

You have full write access to everything inside `/Users/varriza/Desktop/balatro-web`. If it's cleaner or easier to modify an existing file (config, shared component, monorepo root `package.json`, etc.) rather than working around it, do it — don't be shy about touching the existing apps or packages when it makes the flow smoother.

Before writing any code, read these for context:

- `graphify-out/GRAPH_REPORT.md` — knowledge graph of the codebase: god nodes, community structure, surprising connections. Tells you what the core abstractions are and how they connect.
- `graphify-out/graph.json` — raw graph data if you need to query specific node relationships.
- `packages/balatro-cards/README.md` — public API docs for `@balatro/cards`.
- `packages/balatro-cards/docs/` — any deeper docs on components, hooks, and effects.

Use these to understand what already exists before scaffolding anything new.

---

## Goal

Build a personal portfolio website for Varnit Sahu (vsahu@uwaterloo.ca) inside this monorepo as `apps/personal-site`. It must look and feel like Balatro — same green felt, same audio clicks, same VHS scanlines, same pixel font. Start with a **minimal deployable MVP**: one page, three cards (About / Projects / Contact), working sounds, working background.

The `@balatro/cards` package at `packages/balatro-cards` is already built and exported. Use it — do not reimplement anything it already provides.

---

## Monorepo structure

```
balatro-web/
  apps/
    website/          — existing Next.js demo (leave untouched)
    personal-site/    — NEW — build this
  packages/
    balatro-cards/    — @balatro/cards — already built
  package.json        — pnpm workspace root
  pnpm-workspace.yaml
```

Add the new app by creating `apps/personal-site/` as a Next.js 14 app with `pnpm create next-app` or by scaffolding manually. Add a `dev` script for it to the root `package.json`:

```json
"dev:site": "pnpm --filter personal-site dev"
```

---

## @balatro/cards — what's available

Import from `@balatro/cards`:

```ts
// Components
import { BalatroDeck, Card, CardArea, CardBack } from '@balatro/cards'
// Hooks
import { useDeck, useSound } from '@balatro/cards'
// Types
import type { BalatroCard, DeckConfig, Edition, Enhancement, Seal } from '@balatro/cards'
// Styles — import once in layout.tsx
import '@balatro/cards/styles'
```

**BalatroDeck** — context provider. Wrap the whole page. Pass `sounds` prop to enable audio.

**useSound** — returns `{ playSound }`. Sound names: `'button'`, `'cancel'`, `'highlight1'`, `'card1'`, `'cardSlide1'`, `'chips1'`, `'coin1'` etc. All `.ogg` files live in `packages/balatro-cards/public/sounds/`. Copy them into `apps/personal-site/public/sounds/` or symlink.

**CardArea** — layouts: `"fan"` | `"row"` | `"pile"`. Use `layout="fan"` for the hand of portfolio cards displayed at the bottom. Accepts `selected`, `onSelect`, `draggable`, `maxAngle`.

**Card** — 3D tilt on hover, click bounce, double-click flip, drag. Props: `card`, `selected`, `draggable`, `onClick`, `onHover`, `onDragEnd`. The `card` object shape:

```ts
{
  id: string
  rank: string       // use for card label, e.g. 'A' / '2' / 'K'
  suit: string       // 'spades' | 'hearts' | 'clubs' | 'diamonds'
  facing: 'front' | 'back'
  image?: string     // custom face image URL — overrides sprite atlas
  edition?: 'foil' | 'holo' | 'polychrome' | 'negative'
  enhancement?: 'bonus' | 'mult' | 'wild' | 'glass' | 'steel' | 'stone' | 'gold' | 'lucky'
  seal?: 'gold' | 'red' | 'blue' | 'purple'
}
```

**useDeck** — full deck state: `{ deck, hand, discard, selected, draw, discardCards, selectCard, sortHand, reset, shuffle }`.

**CSS effects** — already in `@balatro/cards/styles`. Apply via className: `bc-foil`, `bc-holo`, `bc-polychrome`, `bc-negative`, `bc-selected`, `bc-hovered`.

**Assets to copy** — when setting up the new app, copy or symlink from `packages/balatro-cards/public/`:
- `sounds/` → `apps/personal-site/public/sounds/`
- `textures/` → `apps/personal-site/public/textures/`
- `fonts/` → `apps/personal-site/public/fonts/` (m6x11plus pixel font)

---

## MVP page layout

One full-screen page. No routing. Three sections:

```
┌─────────────────────────────────────────────────────────┐
│  [Balatro animated background fills entire viewport]    │
│  [VHS overlay on top of everything]                     │
│                                                         │
│         ┌──────────────────────────────┐                │
│         │   VARNIT SAHU                │  ← name plate  │
│         │   CS @ Waterloo · open to work│               │
│         └──────────────────────────────┘                │
│                                                         │
│    ┌─────────┐  ┌─────────┐  ┌─────────┐               │
│    │  ABOUT  │  │PROJECTS │  │CONTACT  │  ← play area  │
│    │  (face) │  │ (face)  │  │ (face)  │               │
│    └─────────┘  └─────────┘  └─────────┘               │
│                                                         │
│  ════════════════════ hand area ═════════════════════   │
│  [fan of 3 portfolio cards, selectable, hoverable]      │
└─────────────────────────────────────────────────────────┘
```

**Interaction model:**
- Cards start face-down in the fan at the bottom.
- Clicking a card flips it face-up and "plays" it to the center play area.
- The played card's face shows the section content (About / Projects / Contact).
- Only one card can be in the play area at once. Playing a new card returns the previous one face-down.
- All interactions use the existing sound system: `highlight1` on hover, `card1` on flip, `button` on any UI button click.

---

## Required visual effects

### 1. Balatro background (reactbits)

Use the Balatro background component from reactbits.dev. Install it:

```bash
pnpm add --filter personal-site canvas-confetti  # if needed
```

Fetch the component source from reactbits: https://www.reactbits.dev/backgrounds/balatro

It renders an animated canvas with the characteristic green diamond/dot pattern. Place it as `position: fixed; inset: 0; z-index: 0` behind everything. The rest of the UI sits on `z-index: 1+`.

If reactbits requires their install command, follow their docs. The component is a client component — add `'use client'` at the top.

### 2. VHS / CRT overlay

Create `components/VHSOverlay.tsx`. Render it as a fixed full-screen overlay with `z-index: 9999; pointer-events: none`. It stacks three CSS pseudo-elements / divs:

**Scanlines:**
```css
background: repeating-linear-gradient(
  0deg,
  transparent,
  transparent 2px,
  rgba(0, 0, 0, 0.08) 2px,
  rgba(0, 0, 0, 0.08) 4px
);
```

**Chromatic aberration** (RGB pixel shift) — use a CSS `mix-blend-mode: screen` div with a subtle `box-shadow: -2px 0 0 rgba(255,0,0,0.12), 2px 0 0 rgba(0,0,255,0.12)` applied to text elements, OR apply it to the entire overlay as a filter:
```css
filter: url('#vhs-aberration')  /* inline SVG filter */
```

Alternatively, apply `text-shadow: -1px 0 rgba(255,0,80,0.3), 1px 0 rgba(0,200,255,0.3)` to all text elements for a simpler RGB shift.

**Vignette:**
```css
background: radial-gradient(
  ellipse at center,
  transparent 60%,
  rgba(0,0,0,0.55) 100%
);
```

**Optional noise** — animate a subtle grain using a CSS animation that shifts a `background-position` on a repeating noise pattern (use SVG `feTurbulence` or a base64 noise PNG).

Put all three layers in one `VHSOverlay` component:

```tsx
export function VHSOverlay() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}>
      <div className="vhs-scanlines" />
      <div className="vhs-vignette" />
    </div>
  )
}
```

### 3. Pixel font

The `m6x11plus` font is already in `packages/balatro-cards/public/fonts/`. Copy it to `apps/personal-site/public/fonts/` and declare it in `layout.tsx`:

```css
@font-face {
  font-family: 'm6x11plus';
  src: url('/fonts/m6x11plus.ttf') format('truetype');
}
```

Use `font-family: 'm6x11plus', monospace` on all text. No other font.

---

## Card content (face images or HTML overlay)

For the MVP, use custom HTML faces rendered on top of cards (not sprite atlas). Each portfolio card gets a `image` prop pointing to a rendered PNG, or — simpler — render content as an absolute-positioned div overlaid on the card's bounding box.

The simplest approach: give each card a custom `image` prop that's a `/card-faces/about.png` etc. Or just overlay a `<div>` with `position: absolute` as a sibling inside `BalatroDeck`.

Alternatively, create three custom cards with `image` set to transparent and render content via `Card`'s children slot — but the current `Card` API doesn't support children. Instead, wrap `Card` in a `position: relative` container and overlay content.

**Card content:**

- **About card** (Ace of Spades, `edition: 'holo'`): "Varnit Sahu · CS @ Waterloo · co-op @ [role] · building [thing]"
- **Projects card** (King of Hearts): 3 project lines with names and one-line descriptions
- **Contact card** (Joker, `edition: 'foil'`): email link, GitHub link, LinkedIn link — each line plays `coin1` sound on click

---

## Tech stack

- **Framework:** Next.js 14 (App Router), same as `apps/website`
- **Animation:** Framer Motion (already in `@balatro/cards` deps — don't re-add)
- **Styling:** CSS Modules + inline styles — no Tailwind, no CSS-in-JS library
- **Sound:** `useSound` from `@balatro/cards` — do not install howler or tone.js

---

## package.json for personal-site

```json
{
  "name": "personal-site",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start --port 3001"
  },
  "dependencies": {
    "@balatro/cards": "workspace:*",
    "next": "14.2.0",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5"
  }
}
```

---

## File structure to create

```
apps/personal-site/
  src/
    app/
      layout.tsx          — metadata, font, @balatro/cards/styles import
      page.tsx            — main page (client component)
      globals.css         — VHS CSS classes, font-face
    components/
      VHSOverlay.tsx      — scanlines + vignette overlay
      BalatroBackground.tsx — reactbits canvas background
      PortfolioCard.tsx   — Card wrapper with content overlay
  public/
    sounds/               — copy from packages/balatro-cards/public/sounds/
    textures/             — copy from packages/balatro-cards/public/textures/
    fonts/                — copy m6x11plus.ttf
  next.config.js
  tsconfig.json
  package.json
```

---

## MVP acceptance criteria

1. `pnpm dev:site` starts the site on port 3001 with no errors.
2. Balatro animated background fills the viewport.
3. VHS scanlines and vignette are visible over the background.
4. Three cards are displayed in a fan at the bottom.
5. Hovering a card plays `highlight1` sound and lifts the card.
6. Clicking a card flips it, plays `card1`, and "plays" it to the center.
7. Playing a second card returns the first face-down.
8. All text uses `m6x11plus` font.
9. The page works on mobile (cards stack vertically, fan collapses).
10. `pnpm build` succeeds with no TypeScript errors.

Do not add routing, animations beyond what `@balatro/cards` provides, a blog, dark mode toggle, or any feature not listed above. This is an MVP.

---

## After MVP is verified

The user will deploy this MVP. The main site (with more sections, joker card easter eggs, full game loop, etc.) will be built in a separate branch. Do not scope-creep the MVP.
