# @balatro/cards

Balatro-style playing card components for React. Includes animated card interactions, a deck state manager, sprite-based card faces, edition/seal/enhancement effects, and the full Balatro sound library.

## Requirements

- React ≥ 18
- framer-motion ≥ 11
- zustand ≥ 4.5

## Installation

This package is currently local to the monorepo. Reference it via your workspace or copy it:

```jsonc
// package.json
{
  "dependencies": {
    "@balatro/cards": "workspace:*"
  }
}
```

If publishing externally, use the package name `@balatro/cards` with your registry.

## Static assets — required step

The package loads sounds, textures, and fonts from absolute URL paths at runtime. You must copy the contents of `packages/balatro-cards/public/` into your app's static-file root before the components will work correctly.

| Framework | Copy to |
|-----------|---------|
| Next.js   | `public/` |
| Vite / CRA | `public/` |
| Remix     | `public/` |

```bash
cp -r packages/balatro-cards/public/* apps/your-app/public/
```

The paths the package fetches:
- `/sounds/*.ogg` — card interaction sounds
- `/textures/1x/*.png` and `/textures/2x/*.png` — sprite atlases for card faces, backs, enhancements, seals
- `/fonts/m6x11plus.ttf` — Balatro pixel font

## Import styles

Import the package CSS alongside your own styles:

```ts
import '@balatro/cards/styles'
```

In Next.js, put this in `app/layout.tsx` or `pages/_app.tsx`.

## Quick start

```tsx
import '@balatro/cards/styles'
import { BalatroDeck, CardArea, useDeck } from '@balatro/cards'

export default function App() {
  const { hand, deck, selected, draw, selectCard, discardCards } = useDeck()

  // Draw 5 cards on mount
  useEffect(() => { draw(5) }, [])

  return (
    <BalatroDeck sounds>
      <CardArea
        cards={hand}
        layout="fan"
        selected={selected}
        onSelect={selectCard}
        draggable
      />
      <button onClick={() => discardCards()}>Discard selected</button>
    </BalatroDeck>
  )
}
```

## Docs

- [Getting started](./docs/getting-started.md) — setup walkthrough for Next.js and Vite
- [API reference](./docs/api-reference.md) — all components, hooks, and types
- [Examples](./docs/examples.md) — full patterns for common use cases
