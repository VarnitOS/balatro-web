'use client'

import { motion } from 'framer-motion'
import { Card, getFanPositions } from '@balatro/cards'
import type { BalatroCard } from '@balatro/cards'
import styles from './CardFan.module.css'

export interface FanItem {
  card: BalatroCard
  label: string
  onClick?: (card: BalatroCard) => void
}

interface CardFanProps {
  items: FanItem[]
  cardWidth?: number
  cardHeight?: number
  fanAngle?: number
}

export function CardFan({ items, cardWidth = 150, cardHeight = 210, fanAngle = 20 }: CardFanProps) {
  const positions = getFanPositions(items.length, {
    maxAngle: fanAngle,
    xSpread: 55,
    yParabola: 14,
  })

  return (
    <div
      className={styles.wrap}
      style={{
        height: cardHeight + 60,
        ['--card-w' as string]: `${cardWidth}px`,
        ['--card-h' as string]: `${cardHeight}px`,
        ['--card-radius' as string]: '10px',
      }}
    >
      {items.map((item, i) => (
        <motion.div
          key={item.card.id}
          className={styles.slot}
          initial={{ x: 0, y: 60, rotate: 0, opacity: 0 }}
          animate={{ x: positions[i].x, y: positions[i].y, rotate: positions[i].rotate, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 26, delay: i * 0.09 }}
          style={{ zIndex: positions[i].zIndex }}
        >
          <Card card={item.card} onClick={item.onClick} />
        </motion.div>
      ))}
    </div>
  )
}
