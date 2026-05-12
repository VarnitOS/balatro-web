'use client'
import { AnimatePresence } from 'framer-motion'
import type { BalatroCard, LayoutType } from '../../core/types'
import { getFanPositions, getRowPositions } from '../../animations/fan'
import { useSound } from '../../hooks/useSound'
import { Card } from '../Card/Card'
import styles from './CardArea.module.css'

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
      <div className={`${styles.area} ${styles.fan} ${className}`}>
        <AnimatePresence>
          {cards.map((card, i) => {
            const pos = positions[i]
            return (
              <div
                key={card.id}
                className={styles.cardWrapper}
                style={{
                  transform: `translateX(${pos.x}px) translateY(${pos.y}px) rotate(${pos.rotate}deg)`,
                  zIndex: pos.zIndex,
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <Card
                  card={card}
                  selected={selectedIds.has(card.id)}
                  draggable={draggable}
                  layoutId={card.id}
                  onClick={onSelect}
                  onDragEnd={onCardDragEnd}
                />
              </div>
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
        className={`${styles.area} ${styles.pile} ${className}`}
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
    <div className={`${styles.area} ${styles.row} ${className}`}>
      <AnimatePresence>
        {cards.map((card, i) => (
          <div key={card.id} className={styles.rowWrapper} style={{ marginLeft: positions[i].x }}>
            <Card
              card={card}
              selected={selectedIds.has(card.id)}
              draggable={draggable}
              layoutId={card.id}
              onClick={onSelect}
              onDragEnd={onCardDragEnd}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
