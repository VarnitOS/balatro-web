'use client'
import { useState, useCallback } from 'react'
import { motion, useAnimate } from 'framer-motion'
import type { BalatroCard } from '../../core/types'
import { getCardFaceStyle, hasSprite } from '../../core/sprites'
import { cardSpring, hoverSpring } from '../../animations/spring'
import { useSound } from '../../hooks/useSound'
import { CardBack } from '../CardBack/CardBack'
import cardStyles from './Card.module.css'
import effectStyles from '../../effects/effects.module.css'

interface CardProps {
  card: BalatroCard
  selected?: boolean
  draggable?: boolean
  layoutId?: string
  style?: React.CSSProperties
  onHover?: (card: BalatroCard, hovering: boolean) => void
  onClick?: (card: BalatroCard) => void
  onDragEnd?: (card: BalatroCard, info: { point: { x: number; y: number } }) => void
}

export function Card({
  card,
  selected = false,
  draggable = false,
  layoutId,
  style,
  onHover,
  onClick,
  onDragEnd,
}: CardProps) {
  const [scope, animate] = useAnimate()
  const [facing, setFacing] = useState<'front' | 'back'>(card.facing)
  const [isHovered, setIsHovered] = useState(false)
  const { playSound } = useSound()

  const handleClick = useCallback(async () => {
    // Juice burst on click
    await animate(scope.current, {
      scale: 1.08,
      rotate: (Math.random() > 0.5 ? 1 : -1) * 3.6,
    }, { duration: 0.08, ease: 'easeOut' })
    animate(scope.current, { scale: 1, rotate: 0 }, {
      type: 'spring', stiffness: 500, damping: 25,
    })
    onClick?.(card)
    playSound('highlight1', { pitch: 0.9 + Math.random() * 0.2, volume: 0.5 })
  }, [card, onClick, animate, scope, playSound])

  const flip = useCallback(async () => {
    playSound('card1', { pitch: 0.9 + Math.random() * 0.2 })
    await animate(scope.current, { scaleX: 0 }, {
      duration: 0.1,
      ease: [0.4, 0, 1, 1],
    })
    setFacing(f => (f === 'front' ? 'back' : 'front'))
    await animate(scope.current, { scaleX: 1 }, {
      duration: 0.1,
      ease: [0, 0, 0.6, 1],
    })
  }, [animate, scope, playSound])

  const handleDragEnd = useCallback(
    (_: unknown, info: { point: { x: number; y: number } }) => {
      onDragEnd?.(card, info)
    },
    [card, onDragEnd]
  )

  const editionClass = card.edition ? effectStyles[card.edition] : ''
  const enhancementClass = card.enhancement ? cardStyles[card.enhancement] : ''

  const faceStyle = hasSprite(card.rank, card.suit)
    ? getCardFaceStyle(card.rank, card.suit)
    : {}

  return (
    <motion.div
      ref={scope}
      layout
      layoutId={layoutId}
      className={[
        cardStyles.card,
        selected ? effectStyles.selected : '',
        isHovered ? effectStyles.hovered : '',
        card.debuffed ? effectStyles.debuffed : '',
        editionClass,
      ].join(' ')}
      style={style}
      animate={{
        y: isHovered ? -14 : 0,
        scale: selected ? 1.04 : 1,
      }}
      transition={isHovered ? hoverSpring : cardSpring}
      drag={draggable}
      dragSnapToOrigin={!onDragEnd}
      onDragEnd={handleDragEnd}
      onHoverStart={() => {
        setIsHovered(true)
        onHover?.(card, true)
        playSound('highlight1', { pitch: 1.0 + Math.random() * 0.1, volume: 0.3 })
      }}
      onHoverEnd={() => {
        setIsHovered(false)
        onHover?.(card, false)
      }}
      onClick={handleClick}
      onDoubleClick={flip}
      data-card-id={card.id}
      data-facing={facing}
      role="button"
      aria-pressed={selected}
      aria-label={`${card.rank} of ${card.suit}`}
    >
      {facing === 'back' ? (
        <CardBack customSrc={card.back} />
      ) : card.image ? (
        <img src={card.image} alt={`${card.rank} of ${card.suit}`} className={cardStyles.customFace} />
      ) : (
        <div
          className={[cardStyles.face, editionClass].join(' ')}
          style={faceStyle}
        >
          {card.enhancement && (
            <div className={`${cardStyles.enhancement} ${enhancementClass}`} />
          )}
        </div>
      )}

      {card.seal && (
        <div
          className={cardStyles.seal}
          style={getSealStyle(card.seal)}
          aria-label={`${card.seal} seal`}
        />
      )}
    </motion.div>
  )
}

const SEAL_COLS: Record<string, number> = { gold: 0, red: 1, blue: 2, purple: 3 }
function getSealStyle(seal: string): React.CSSProperties {
  const col = SEAL_COLS[seal] ?? 0
  return {
    backgroundImage: 'url(/textures/1x/Enhancers.png)',
    backgroundSize: '500% 800%',
    backgroundPosition: `${(col / 4) * 100}% ${(5 / 7) * 100}%`,
    imageRendering: 'pixelated',
  }
}
