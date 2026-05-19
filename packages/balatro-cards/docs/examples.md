# Examples

## Minimal — single card

```tsx
'use client'
import '@balatro/cards/styles'
import { BalatroDeck, Card } from '@balatro/cards'

const myCard = { id: '1', rank: 'K', suit: 'hearts', facing: 'front' as const }

export default function Demo() {
  return (
    <BalatroDeck>
      <Card card={myCard} onClick={(c) => console.log('clicked', c)} />
    </BalatroDeck>
  )
}
```

---

## Standard game loop

Draw cards, select them, play or discard. This is the canonical usage pattern.

```tsx
'use client'
import { useEffect } from 'react'
import '@balatro/cards/styles'
import { BalatroDeck, CardArea, useDeck } from '@balatro/cards'

export default function Game() {
  const { deck, hand, discard, selected, draw, discardCards, selectCard, sortHand, reset, shuffle } =
    useDeck()

  useEffect(() => { draw(8) }, [])

  return (
    <BalatroDeck sounds>
      {/* Play area — last 8 discarded cards in a row */}
      <CardArea cards={discard.slice(-8)} layout="row" />

      {/* Hand — fan layout, selectable, draggable */}
      <CardArea
        cards={hand}
        layout="fan"
        selected={selected}
        onSelect={selectCard}
        draggable
        maxAngle={24}
      />

      {/* Deck pile — click to draw 1 */}
      <CardArea cards={deck} layout="pile" type="deck" onDraw={() => draw(1)} />

      <div>
        <button onClick={() => draw(8)} disabled={deck.length === 0}>
          Draw ({deck.length})
        </button>
        <button onClick={() => discardCards()} disabled={selected.length === 0}>
          Discard selected
        </button>
        <button onClick={() => sortHand('rank')}>Sort rank</button>
        <button onClick={() => sortHand('suit')}>Sort suit</button>
        <button onClick={() => shuffle()}>Shuffle</button>
        <button onClick={() => { reset(); setTimeout(() => draw(8), 30) }}>Reset</button>
      </div>
    </BalatroDeck>
  )
}
```

---

## Custom deck

Pass a `DeckConfig` to `useDeck` to customize ranks, suits, or supply cards directly.

```tsx
// Tarot-style 22-card deck
const { hand, draw } = useDeck({
  cards: [
    { id: 'fool',    rank: 'The Fool',    suit: 'major', facing: 'back' },
    { id: 'magician', rank: 'The Magician', suit: 'major', facing: 'back' },
    // ...
  ],
})

// 6-suit deck with custom ranks
const { hand } = useDeck({
  ranks: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  suits: ['fire', 'water', 'earth', 'air', 'light', 'dark'],
})

// Standard deck with jokers
const { hand } = useDeck({ jokers: true })
```

---

## Card with editions and enhancements

Apply visual effects to cards via the `BalatroCard` fields, or mutate them in-hand via `setEdition` / `setSeal`.

```tsx
// Static card with effects
const specialCard = {
  id: 'joker-1',
  rank: 'J',
  suit: 'spades',
  facing: 'front' as const,
  edition: 'holo' as const,
  enhancement: 'mult' as const,
  seal: 'gold' as const,
}

// Mutate a card already in hand
const { hand, setEdition, setSeal } = useDeck()

function upgradeFirstCard() {
  if (hand[0]) {
    setEdition(hand[0], 'polychrome')
    setSeal(hand[0], 'red')
  }
}
```

Available values:
- `edition`: `'foil' | 'holo' | 'polychrome' | 'negative'`
- `enhancement`: `'bonus' | 'mult' | 'wild' | 'glass' | 'steel' | 'stone' | 'gold' | 'lucky'`
- `seal`: `'gold' | 'red' | 'blue' | 'purple'`

---

## Custom card face image

Skip the sprite atlas entirely and supply your own image:

```tsx
const customCard = {
  id: 'custom-1',
  rank: 'Dragon',
  suit: 'special',
  facing: 'front' as const,
  image: '/my-cards/dragon.png',   // any URL or import
  back: '/my-cards/back.png',      // optional custom back
}

<Card card={customCard} />
```

When `image` is set, the sprite lookup is skipped and your image fills the card face.

---

## Custom card back (per-card)

Each `BalatroCard` can carry its own `back` URL, which `CardBack` will use instead of the default sprite:

```tsx
const card = {
  id: '1', rank: 'A', suit: 'spades',
  facing: 'back' as const,
  back: '/my-custom-back.png',
}
```

You can also render `CardBack` standalone:

```tsx
import { CardBack } from '@balatro/cards'
<CardBack customSrc="/my-back.png" />
```

---

## Playing sounds manually

```tsx
import { useSound } from '@balatro/cards'

function ScoreDisplay({ score }: { score: number }) {
  const { playSound } = useSound()

  useEffect(() => {
    if (score > 0) playSound('chips1', { pitch: 0.9 + Math.random() * 0.2, volume: 0.8 })
  }, [score])

  return <div>{score}</div>
}
```

Pitch randomization (`0.9 + Math.random() * 0.2`) is the same trick Balatro uses to prevent sounds from feeling robotic.

---

## Muting sounds

Pass `true` to `useSound` to silence all sounds from that component:

```tsx
const { playSound } = useSound(isMuted)
```

Or gate the `sounds` prop on `BalatroDeck` to skip preloading entirely:

```tsx
<BalatroDeck sounds={!userMutedSounds}>
```

---

## Draggable cards with drop zones

Use `onDragEnd` and `onCardDragEnd` to detect when a card is dropped near a target:

```tsx
function Board() {
  const { hand, discardCards } = useDeck()
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleDragEnd = (card: BalatroCard, info: { point: { x: number; y: number } }) => {
    const zone = dropZoneRef.current?.getBoundingClientRect()
    if (!zone) return
    const { x, y } = info.point
    if (x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom) {
      discardCards([card])
    }
  }

  return (
    <>
      <div ref={dropZoneRef} style={{ width: 200, height: 150, border: '2px dashed white' }}>
        Drop here
      </div>
      <CardArea
        cards={hand}
        layout="fan"
        draggable
        onCardDragEnd={handleDragEnd}
      />
    </>
  )
}
```

---

## Custom fan layout

Use `getFanPositions` directly if you want full control over card positioning:

```tsx
import { getFanPositions, Card } from '@balatro/cards'
import { motion } from 'framer-motion'

function TightFan({ cards }) {
  const positions = getFanPositions(cards.length, {
    maxAngle: 15,    // tighter arc
    xSpread: 25,     // cards closer together
    yParabola: 8,
  })

  return (
    <div style={{ position: 'relative' }}>
      {cards.map((card, i) => (
        <motion.div
          key={card.id}
          style={{ position: 'absolute', zIndex: positions[i].zIndex }}
          animate={{ x: positions[i].x, y: positions[i].y, rotate: positions[i].rotate }}
        >
          <Card card={card} />
        </motion.div>
      ))}
    </div>
  )
}
```
