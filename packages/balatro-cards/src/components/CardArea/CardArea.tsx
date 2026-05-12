'use client'
import { AnimatePresence, motion } from 'framer-motion'
import type { BalatroCard, LayoutType } from '../../core/types'
import { getFanPositions, getRowPositions } from '../../animations/fan'
import { useSound } from '../../hooks/useSound'
import { Card } from '../Card/Card'
import './CardArea.css'

interface CardAreaProps {
  cards: BalatroCard[]
  layout?: LayoutType
  type?: string
  selected?: BalatroCard[]
  draggable?: boolean
  maxAngle?: number
  onSelect?: (card: BalatroCard) => void
  onDraw?: () => void
  onCardDragEnd?: (card: BalatroCard, info: { point: { x: number; y: number } }) => void
  className?: string
}

export function CardArea({
  cards,
  layout = 'fan',
  type,
  selected = [],
  draggable = false,
  maxAngle = 30,
  onSelect,
  onDraw,
  onCardDragEnd,
  className = '',
}: CardAreaProps) {
  const { playSound } = useSound()
  const selectedIds = new Set(selected.map(c => c.id))

  if (layout === 'fan') {
    const positions = getFanPositions(cards.length, { maxAngle })

    return (
      <div className={`bc-area bc-fan ${className}`}>
        <AnimatePresence>
          {cards.map((card, i) => {
            const pos = positions[i]
            return (
              <motion.div
                key={card.id}
                className="bc-cardWrapper"
                style={{ zIndex: pos.zIndex }}
                animate={{ x: pos.x, y: pos.y, rotate: pos.rotate, opacity: 1, scale: 1 }}
                initial={{ x: pos.x, y: pos.y + 40, rotate: pos.rotate, opacity: 0, scale: 0.5 }}
                exit={{ opacity: [1, 1, 0], scale: [1.2, 0.05], y: [pos.y - 8, pos.y - 80], transition: { duration: 0.32, times: [0, 0.15, 1], ease: 'easeIn' } }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              >
                <Card
                  card={card}
                  selected={selectedIds.has(card.id)}
                  draggable={draggable}
                  layoutId={card.id}
                  onClick={onSelect}
                  onDragEnd={onCardDragEnd}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    )
  }

  if (layout === 'pile') {
    const topCard = cards[cards.length - 1]
    const backgroundCards = cards.slice(-3, -1)  // last 3 excluding top
    return (
      <div
        className={`bc-area bc-pile ${className}`}
        onClick={() => {
          if (type === 'deck' && onDraw) {
            playSound('cardSlide1', { pitch: 0.9 + Math.random() * 0.2 })
            onDraw()
          }
        }}
        role={type === 'deck' ? 'button' : undefined}
        aria-label={type === 'deck' ? `Draw card (${cards.length} remaining)` : undefined}
      >
        {backgroundCards.map((card, i) => (
          <div
            key={card.id}
            style={{
              position: 'absolute',
              top: (backgroundCards.length - i) * -1.5,
              left: (backgroundCards.length - i) * 0.5,
              zIndex: i,
            }}
          >
            <Card card={{ ...card, facing: 'back' }} />
          </div>
        ))}
        {topCard && (
          <div style={{ position: 'relative', zIndex: 4 }}>
            <Card card={{ ...topCard, facing: 'back' }} />
          </div>
        )}
      </div>
    )
  }

  // Row layout
  const positions = getRowPositions(cards.length)
  return (
    <div className={`bc-area bc-row ${className}`}>
      <AnimatePresence>
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            className="bc-rowWrapper"
            animate={{ marginLeft: positions[i].x, opacity: 1, scale: 1, y: 0 }}
            initial={{ opacity: 0, scale: 0.5, y: 40 }}
            exit={{ opacity: 0, scale: 0.3, y: -60, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <Card
              card={card}
              selected={selectedIds.has(card.id)}
              draggable={draggable}
              layoutId={card.id}
              onClick={onSelect}
              onDragEnd={onCardDragEnd}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
