# API reference

## Components

### `BalatroDeck`

Root wrapper. Injects CSS custom properties and the Balatro pixel font. Must be an ancestor of all card components.

```tsx
<BalatroDeck sounds className="my-class">
  {children}
</BalatroDeck>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sounds` | `boolean` | `false` | Preload commonly used card sounds on mount |
| `className` | `string` | `''` | CSS class on the wrapper div |
| `children` | `ReactNode` | — | Required |

CSS variables injected into `:root`:

| Variable | Value |
|----------|-------|
| `--balatro-bg` | `#1a1a2e` |
| `--balatro-surface` | `#252545` |
| `--balatro-text` | `#e8e8f0` |
| `--balatro-red` | `#cc3333` |
| `--balatro-yellow` | `#f4d03f` |
| `--balatro-purple` | `#8b5cf6` |
| `--balatro-glow` | `rgba(244,208,63,0.5)` |
| `--card-w` | `71px` |
| `--card-h` | `95px` |
| `--card-radius` | `5px` |

---

### `Card`

An individual interactive card. Handles hover tilt, click juice, double-click flip, drag, and all sound effects internally.

```tsx
<Card
  card={card}
  selected={false}
  draggable
  onClick={handleClick}
  onHover={handleHover}
  onDragEnd={handleDragEnd}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `card` | `BalatroCard` | — | Required. The card data |
| `selected` | `boolean` | `false` | Lifts the card and scales it up |
| `draggable` | `boolean` | `false` | Enables drag with framer-motion |
| `layoutId` | `string` | — | framer-motion shared layout ID for cross-area transitions |
| `style` | `CSSProperties` | — | Forwarded to the root motion element |
| `onClick` | `(card: BalatroCard) => void` | — | Fired after the click juice animation |
| `onHover` | `(card: BalatroCard, hovering: boolean) => void` | — | Fired on hover start/end |
| `onDragEnd` | `(card: BalatroCard, info: { point: { x, y } }) => void` | — | Fired when a drag ends |

**Built-in interactions** (no props required):
- Hover: 3D tilt + wobble punch + lift animation + sound
- Click: squeeze-and-release juice animation + sound
- Double-click: flip between front and back with a scaleX animation + sound
- Drag: tilt in drag direction, snaps back unless `onDragEnd` is provided

---

### `CardArea`

Renders a group of cards in a layout. Manages `AnimatePresence` for enter/exit animations.

```tsx
<CardArea
  cards={hand}
  layout="fan"
  selected={selected}
  onSelect={selectCard}
  draggable
  maxAngle={24}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cards` | `BalatroCard[]` | — | Required |
| `layout` | `'fan' \| 'pile' \| 'row'` | `'fan'` | Arrangement of cards |
| `type` | `string` | — | Set to `'deck'` to make pile layout clickable for draw |
| `selected` | `BalatroCard[]` | `[]` | Cards to render in selected state |
| `draggable` | `boolean` | `false` | Makes all cards in the area draggable |
| `maxAngle` | `number` | `30` | Fan spread in degrees (fan layout only) |
| `onSelect` | `(card: BalatroCard) => void` | — | Called when a card is clicked |
| `onDraw` | `() => void` | — | Called when pile is clicked (when `type="deck"`) |
| `onCardDragEnd` | `(card: BalatroCard, info) => void` | — | Drag end handler forwarded to each Card |
| `className` | `string` | `''` | Added to the area wrapper div |

**Layout modes:**
- `fan` — cards arc in a parabolic fan. Spread controlled by `maxAngle`.
- `row` — cards in a straight horizontal row.
- `pile` — stacked deck view. Only the top card (and 2 behind it) render. Click triggers `onDraw` when `type="deck"`.

---

### `CardBack`

Renders a card back face. Used internally by `Card` but available standalone.

```tsx
<CardBack customSrc="/my-card-back.png" className="my-class" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `customSrc` | `string` | — | Override the default Balatro back with any image URL |
| `className` | `string` | — | CSS class on the wrapper div |

---

## Hooks

### `useDeck(config?)`

Initializes and manages a full deck of cards. Backed by a Zustand store — state is shared across all components that call `useDeck()` in the same React tree.

```ts
const {
  deck, hand, discard, selected, config,
  shuffle, draw, discardCards, selectCard, sortHand,
  setEdition, setSeal, reset,
} = useDeck({ jokers: true })
```

**Config** (`DeckConfig`):

| Field | Type | Description |
|-------|------|-------------|
| `ranks` | `string[]` | Custom rank labels. Defaults to `['2','3','4','5','6','7','8','9','10','J','Q','K','A']` |
| `suits` | `string[]` | Custom suit labels. Defaults to `['spades','hearts','clubs','diamonds']` |
| `cards` | `BalatroCard[]` | Fully custom card list — overrides `ranks`/`suits` |
| `jokers` | `boolean` | Add joker cards to the deck |

**Returned state:**

| Field | Type | Description |
|-------|------|-------------|
| `deck` | `BalatroCard[]` | Remaining undrawn cards |
| `hand` | `BalatroCard[]` | Cards currently in hand |
| `discard` | `BalatroCard[]` | Discarded cards |
| `selected` | `BalatroCard[]` | Cards the user has selected in hand |
| `config` | `DeckConfig` | The config passed at initialization |

**Returned actions:**

| Action | Signature | Description |
|--------|-----------|-------------|
| `shuffle` | `() => void` | Shuffles the remaining deck |
| `draw` | `(n: number) => void` | Moves `n` cards from deck to hand, flipping them face-up |
| `discardCards` | `(cards?: BalatroCard[]) => void` | Discards specified cards, or `selected` if omitted |
| `selectCard` | `(card: BalatroCard) => void` | Toggles a card's selection in hand |
| `sortHand` | `(by: 'rank' \| 'suit') => void` | Sorts the hand |
| `setEdition` | `(card: BalatroCard, edition: Edition \| undefined) => void` | Applies or removes a visual edition |
| `setSeal` | `(card: BalatroCard, seal: Seal \| undefined) => void` | Applies or removes a seal |
| `reset` | `() => void` | Rebuilds and reshuffles the deck, clears hand/discard/selected |

---

### `useSound(muted?)`

Plays sounds from the built-in Balatro sound library.

```ts
const { playSound } = useSound()
playSound('chips1', { pitch: 0.9 + Math.random() * 0.2, volume: 0.8 })

// Muted variant
const { playSound } = useSound(isMuted)
```

`playSound(name, options?)`:

| Param | Type | Description |
|-------|------|-------------|
| `name` | `SoundName` | Sound file to play (see list below) |
| `options.pitch` | `number` | `playbackRate` multiplier. Default `1.0`. Balatro uses `0.85–1.5` for randomness. |
| `options.volume` | `number` | `0.0–1.0`. Default `1.0` |

Available `SoundName` values:
`card1`, `card3`, `cardFan2`, `cardSlide1`, `cardSlide2`, `chips1`, `chips2`, `coin1`–`coin7`, `crumple1`–`crumple5`, `crumpleLong1`, `crumpleLong2`, `explosion1`, `explosion_buildup1`, `explosion_release1`, `foil1`, `foil2`, `glass1`–`glass6`, `gold_seal`, `gong`, `highlight1`, `highlight2`, `holo1`, `magic_crumple`, `magic_crumple2`, `magic_crumple3`, `multhit1`, `multhit2`, `music1`–`music5`, `negative`, `other1`, `paper1`, `polychrome1`, `slice1`, `splash_buildup`, `tarot1`, `tarot2`, `timpani`, `voice1`–`voice11`, `whoosh`, `whoosh1`, `whoosh2`, `whoosh_long`, `win`, `button`, `cancel`, `generic1`, `ambientFire1`–`ambientFire3`, `ambientOrgan1`, `introPad1`

---

## Types

```ts
type Edition     = 'foil' | 'holo' | 'polychrome' | 'negative'
type Enhancement = 'bonus' | 'mult' | 'wild' | 'glass' | 'steel' | 'stone' | 'gold' | 'lucky'
type Seal        = 'gold' | 'red' | 'blue' | 'purple'
type Facing      = 'front' | 'back'
type LayoutType  = 'fan' | 'pile' | 'row'
type SortBy      = 'rank' | 'suit'

interface BalatroCard {
  id: string
  rank: string          // '2'–'A' or any custom string
  suit: string          // 'spades'|'hearts'|'clubs'|'diamonds' or custom
  facing: Facing
  image?: string        // custom face image URL — overrides sprite lookup
  back?: string         // custom back image URL
  edition?: Edition
  enhancement?: Enhancement
  seal?: Seal
  debuffed?: boolean
}

interface DeckConfig {
  ranks?: string[]
  suits?: string[]
  cards?: BalatroCard[] // fully custom — overrides ranks/suits
  jokers?: boolean
}

interface CardTransform {
  x: number
  y: number
  rotate: number
  scale: number
  zIndex: number
}
```

---

## Animation utilities

These are exported for advanced usage — `CardArea` uses them internally.

```ts
import { getFanPositions, getRowPositions, getPilePosition } from '@balatro/cards'
import { juiceUp } from '@balatro/cards'
import { cardSpring, hoverSpring, juiceSpring, layoutSpring } from '@balatro/cards'
```

### `getFanPositions(n, options?)`

Returns `CardTransform[]` for a fan layout of `n` cards.

| Option | Type | Default |
|--------|------|---------|
| `maxAngle` | `number` | `30` — total fan arc in degrees |
| `xSpread` | `number` | `40` — horizontal spacing multiplier |
| `yParabola` | `number` | `15` — max y-drop at the fan edges |

### `getRowPositions(n, spacing?)`

Returns `CardTransform[]` for a straight row. `spacing` defaults to `80px`.

### Spring configs

Pre-tuned framer-motion spring configs used internally:

| Export | Usage |
|--------|-------|
| `cardSpring` | Default card animation |
| `hoverSpring` | Hover lift/scale |
| `juiceSpring` | Click squeeze-release |
| `layoutSpring` | Card reorder transitions |
