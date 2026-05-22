# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev servers
pnpm dev:site          # personal-site on http://localhost:3001
pnpm dev               # website demo on default port

# Build & test the @balatro/cards package
pnpm build             # tsup build → packages/balatro-cards/dist/
pnpm --filter @balatro/cards dev        # watch mode for package
pnpm test                               # vitest run (package tests only)
pnpm --filter @balatro/cards test:watch # vitest watch

# Single test file
pnpm --filter @balatro/cards exec vitest run src/core/deck.test.ts
```

`@balatro/cards` must be built (`pnpm build`) before apps can consume it. The dist is checked in, so a fresh clone works immediately, but rebuild after editing package source.

---

## Monorepo layout

```
balatro-web/
  apps/
    personal-site/    ← Varnit Sahu portfolio (Next.js 14, port 3001)
    website/          ← demo app — leave untouched
  packages/
    balatro-cards/    ← @balatro/cards — shared component library
```

`pnpm-workspace.yaml` links them. `apps/personal-site` consumes `@balatro/cards` as `workspace:*` via the pre-built `dist/`. `next.config.js` sets `transpilePackages: ['@balatro/cards']`.

---

## @balatro/cards package

Built with tsup. Source in `src/`, output in `dist/`. Tests use vitest + happy-dom.

**Public API** (`src/index.ts`):
- **Components**: `BalatroDeck` (context provider — pass `sounds` to enable audio), `Card`, `CardArea`, `CardBack`
- **Hooks**: `useDeck`, `useSound`
- **Types**: `BalatroCard`, `DeckConfig`, `CardTransform`, `Edition`, `Enhancement`, `Seal`, `Facing`, `LayoutType`, `SortBy`
- **Animation utils**: `getFanPositions`, `getRowPositions`, `getPilePosition`, `juiceUp`, spring configs

**Sprite atlases** (served from each app's `/public/textures/1x/`):
- `8BitDeck.png` — 13×4 card face sheet (suits: hearts/clubs/diamonds/spades rows, ranks 2–A cols)
- `Enhancers.png` — 7×5 sheet: enhancements rows 0–3, seals row 4
- `sprites.ts` maps rank+suit to CSS `backgroundPosition` percentages. Non-standard ranks/suits get no sprite — use `card.image` for custom faces.

**Sound system** (`useSound.ts`):
- Lazy `AudioContext` (avoids autoplay policy violations)
- Sounds fetched from `/sounds/<name>.ogg` in the consuming app's `public/`
- `playSound(name, { pitch, volume })` — `pitch` = `playbackRate` (0.85–1.5 typical)
- Call `preloadSounds(names)` upfront to avoid first-play latency

**Deck state** — Zustand store (`core/store.ts`). `useDeck(config)` initializes once on mount. Methods: `draw`, `discardCards`, `selectCard`, `sortHand`, `setEdition`, `setSeal`, `reset`, `shuffle`.

**Card component behavior**:
- Single-click: 180 ms debounce → `onClick` + juice bounce + `highlight1` sound
- Double-click: flip animation (`scaleX` 0→1) + `card1` sound + face toggle
- Hover: 3D tilt via `useMotionValue` (no re-renders); `highlight1` sound
- `ambient` prop: continuous circular tilt orbit matching Balatro's title screen (1.56 rad/s)
- Drag: horizontal drag tilt with `dragSnapToOrigin` by default; pass `onDragEnd` to disable snap

---

## personal-site architecture

`apps/personal-site/src/app/page.tsx` — single client component, no routing.

**Layer stack** (z-index order):
1. `BalatroBackground` (z=0) — OGL WebGL canvas with a custom GLSL fragment shader. Props: `color1/2/3`, `spinSpeed`, `contrast`, `lighting`, `spinAmount`, `pixelFilter`, `mouseInteraction`. Shader is self-contained in `BalatroBackground.tsx`.
2. `.vignette` div (z=1) — radial-gradient + bottom fade, `pointer-events: none`
3. Hero area (z=2) — centered logo image + ambient `Card` overlaid in the logo gap
4. Bottom chrome (z=10) — three islands: profile badge (left), nav buttons (center), socials + email (right)

**Nav button sizing** — outer buttons (PLAY, CONTACT) are full-size; middle buttons (EXPERIENCE, PROJECTS) use `.navBtnSmall` for shorter padding and smaller font, matching Balatro's OPTIONS/QUIT layout. Container uses `align-items: flex-end` so all buttons share a common bottom edge.

**Styling**: CSS Modules (`page.module.css`) + global reset/font (`globals.css`). No Tailwind. Button colors use CSS custom properties `--btn-bg` / `--btn-shadow` set inline per button.

**Font**: `m6x11plus` pixel font declared in `globals.css` via `@font-face`, sourced from `public/fonts/m6x11plus.ttf`. Used on all text — no other font.

**Assets** in `apps/personal-site/public/`:
- `Assets/VarnitSplashScreen.png` — hero logo image
- `sounds/` — `.ogg` files (copied from `packages/balatro-cards/public/sounds/`)
- `textures/1x/` — `8BitDeck.png`, `Enhancers.png` sprite atlases
- `fonts/m6x11plus.ttf`
