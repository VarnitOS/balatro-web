'use client'

import { useMemo } from 'react'
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
  activeId?: string | null
}

export function CardFan({ items, cardWidth = 150, cardHeight = 210, fanAngle = 20, activeId }: CardFanProps) {
  const positions = useMemo(
    () => getFanPositions(items.length, { maxAngle: fanAngle, xSpread: 55, yParabola: 14 }),
    [items.length, fanAngle]
  )

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
      {items.map((item, i) => {
        const isActive = activeId === item.card.id
        return (
          <motion.div
            key={item.card.id}
            className={styles.slot}
            initial={{ x: 0, y: 60, rotate: 0, opacity: 0 }}
            animate={{ x: positions[i].x, y: positions[i].y, rotate: positions[i].rotate, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 26, delay: i * 0.09 }}
            style={{ zIndex: isActive ? 100 : positions[i].zIndex }}
          >
            <div style={{
              transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.35s ease',
              transform: isActive ? 'translateY(-18px)' : 'translateY(0)',
              filter: isActive
                ? 'drop-shadow(0 0 10px rgba(220, 165, 32, 1)) drop-shadow(0 0 22px rgba(220, 165, 32, 0.6)) drop-shadow(0 0 40px rgba(220, 165, 32, 0.3))'
                : 'none',
            }}>
              <Card card={item.card} onClick={item.onClick} />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
