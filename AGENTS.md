# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

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

`apps/personal-site/src/app/page.tsx` — single client component, no routing. Two modes driven by one boolean, `hasEnteredSite`:

- **Landing mode** (default): hero logo + ambient card, profile badge, socials, and the nav island all rendered via `AnimatePresence`/`motion.div` with their own enter/exit transitions.
- **Portfolio mode** (after clicking PLAY): hero/profile/socials exit; a scrolling page of `<section>`s (`intro`, `experience`, `projects`, `blogs`, `contact`) fades in inside `.portfolioContent`. An `IntersectionObserver` (threshold 0.25) tracks which section is in view and highlights the matching nav button.
- The nav buttons island itself never unmounts between modes — it uses a shared `layoutId="navIsland"` (framer-motion) so it physically animates from the bottom-center anchor (landing) to the sticky top bar (`.stickyNavBar`, portfolio), and PLAY relabels to MENU.

**Layer stack** (z-index order), landing mode:
1. `BalatroBackground` (z=0) — OGL WebGL canvas with a custom GLSL fragment shader. Props: `color1/2/3`, `spinSpeed`, `contrast`, `lighting`, `spinAmount`, `pixelFilter`, `mouseInteraction`. Shader is self-contained in `BalatroBackground.tsx`.
2. `.vignette` div (z=1) — radial-gradient + bottom fade, `pointer-events: none`
3. Hero area (z=2) — centered logo image + ambient `Card` overlaid in the logo gap
4. Bottom chrome (z=10) — three islands: profile badge (left), nav buttons (center), socials + email (right)

**Nav button sizing** — outer buttons (PLAY, CONTACT) are full-size; middle buttons (EXPERIENCE, PROJECTS, BLOGS) use `.navBtnSmall` for shorter padding and smaller font, matching Balatro's OPTIONS/QUIT layout. Container uses `align-items: flex-end` so all buttons share a common bottom edge.

**`CardFan`** (`src/components/CardFan.tsx`) — personal-site-local component, not part of `@balatro/cards`. Wraps the package's `Card` + `getFanPositions` to animate a hand of cards into a fanned arc with staggered spring entrances; used to display EXPERIENCE/PROJECTS/BLOGS as card hands. Takes `items: FanItem[]` (`{ card, label, onClick }`) plus `cardWidth`/`cardHeight`/`fanAngle`.

**Content data** — `EXPERIENCE`, `PROJECTS`, `BLOGS` arrays at the top of `page.tsx` are hardcoded placeholders (company/role/description text is explicitly stub copy). Each entry pairs portfolio content with a playing-card rank+suit for its `CardFan` slot. There's no CMS or data file — edit these arrays directly.

**Styling**: CSS Modules (`page.module.css`) + global reset/font (`globals.css`). No Tailwind. Button colors use CSS custom properties `--btn-bg` / `--btn-shadow` set inline per button.

**Font**: `m6x11plus` pixel font declared in `globals.css` via `@font-face`, sourced from `public/fonts/m6x11plus.ttf`. Used on all text — no other font.

**Assets** in `apps/personal-site/public/`:
- `Assets/VarnitSplashScreen.png` — hero logo image
- `sounds/` — `.ogg` files (copied from `packages/balatro-cards/public/sounds/`)
- `textures/1x/`, `textures/2x/` — full Balatro texture dump (Jokers, Tarots, Vouchers, collabs, etc.); only `8BitDeck.png` and `Enhancers.png` are actually wired up via `sprites.ts` in the package — the rest are unused
- `fonts/m6x11plus.ttf`
