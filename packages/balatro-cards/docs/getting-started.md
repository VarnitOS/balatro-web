# Getting started

## 1. Install dependencies

The package requires React 18+, framer-motion, and zustand:

```bash
npm install framer-motion zustand
```

## 2. Copy static assets

The package fetches sounds, textures, and fonts from your app's static file root at runtime. Copy them from the package's `public/` folder into your app's `public/` folder:

```bash
# from the repo root
cp -r packages/balatro-cards/public/* apps/your-app/public/
```

After copying, your `public/` directory should contain:

```
public/
  sounds/        ← .ogg audio files
  textures/
    1x/          ← sprite PNGs at 1× resolution
    2x/          ← sprite PNGs at 2× resolution
  fonts/
    m6x11plus.ttf
```

**Next.js** — files in `public/` are served at `/`. No additional config needed.

**Vite** — same. Files in `public/` are served at `/`.

**Create React App** — same. Files in `public/` are served at `/`.

If your static root lives elsewhere, update the paths in `src/hooks/useSound.ts` and `src/core/sprites.ts` inside the package source.

## 3. Import styles

Add the stylesheet import once, near your app's entry point:

```ts
// Next.js: app/layout.tsx or pages/_app.tsx
// Vite / CRA: src/main.tsx or src/index.tsx
import '@balatro/cards/styles'
```

## 4. Wrap your app in BalatroDeck

`BalatroDeck` injects the Balatro CSS custom properties and the pixel font into the document. Wrap it around any component tree that will render cards:

```tsx
import { BalatroDeck } from '@balatro/cards'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BalatroDeck sounds>
          {children}
        </BalatroDeck>
      </body>
    </html>
  )
}
```

The `sounds` prop preloads the most commonly used card sounds on mount. Omit it to skip preloading (sounds will still load lazily on first play).

## 5. Next.js specifics

Components use `'use client'` internally, so they work in both the App Router and Pages Router without any extra configuration. You do not need to add your own `'use client'` directive unless your page file is a Server Component that directly renders card components.

If you use the App Router and want to render cards in a Server Component tree, wrap them in a client boundary:

```tsx
// components/CardSection.tsx
'use client'
import { CardArea } from '@balatro/cards'
// ...
```

## 6. Verify setup

Render a single card to confirm assets are loading:

```tsx
'use client'
import '@balatro/cards/styles'
import { BalatroDeck, Card } from '@balatro/cards'

export default function TestPage() {
  return (
    <BalatroDeck>
      <Card card={{ id: '1', rank: 'A', suit: 'spades', facing: 'front' }} />
    </BalatroDeck>
  )
}
```

You should see the Ace of Spades sprite. If you see a blank box:
- Check the browser Network tab — confirm `/textures/1x/balatro.png` returns 200.
- Confirm you ran the asset copy step above.
- Confirm `@balatro/cards/styles` is imported.
