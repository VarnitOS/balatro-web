'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, useAnimate, useMotionValue, animate as animateValue } from 'framer-motion'
import type { BalatroCard } from '../../core/types'
import { getCardFaceStyle, hasSprite } from '../../core/sprites'
import { cardSpring, hoverSpring } from '../../animations/spring'
import { useSound } from '../../hooks/useSound'
import { CardBack } from '../CardBack/CardBack'
import './Card.css'
import '../../effects/effects.css'

interface CardProps {
  card: BalatroCard
  selected?: boolean
  draggable?: boolean
  layoutId?: string
  style?: React.CSSProperties
  ambient?: boolean
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
  ambient = false,
  onHover,
  onClick,
  onDragEnd,
}: CardProps) {
  const [scope, animate] = useAnimate()
  const [facing, setFacing] = useState<'front' | 'back'>(card.facing)
  useEffect(() => { setFacing(card.facing) }, [card.id, card.facing])
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffsetX, setDragOffsetX] = useState(0)
  const { playSound } = useSound()
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (clickTimerRef.current) clearTimeout(clickTimerRef.current) }, [])

  // 3D tilt MotionValues — updated directly in onMouseMove (no re-renders)
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)

  // Ambient tilt: circular orbit of a virtual cursor, matching Balatro's ambient_tilt=0.8 on the title screen.
  // Maths from card.lua:4379-4384 — tilt_angle = t*1.56, nx = 0.5*0.8*cos, ny = 0.5*0.8*sin
  const ambientActiveRef = useRef(ambient)
  const ambientTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number>(0)
  const orbitStartRef = useRef(performance.now())

  useEffect(() => {
    if (!ambient) return
    ambientActiveRef.current = true
    orbitStartRef.current = performance.now()

    const tick = (now: number) => {
      if (ambientActiveRef.current) {
        const t = (now - orbitStartRef.current) / 1000   // seconds
        const angle = t * 1.56                            // 1.56 rad/s — Balatro title screen speed
        tiltX.set(-Math.sin(angle) * 9.6)                // -0.5 * 0.8 * sin * 24°
        tiltY.set( Math.cos(angle) * 9.6)                //  0.5 * 0.8 * cos * 24°
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [ambient, tiltX, tiltY])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5   // -0.5 to +0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5   // -0.5 to +0.5
    tiltX.set(-ny * 24)   // rotateX: tilt up when cursor above center
    tiltY.set(nx * 24)    // rotateY: tilt right when cursor right of center
  }, [tiltX, tiltY])

  const resetTilt = useCallback(() => {
    animateValue(tiltX, 0, { type: 'spring', stiffness: 400, damping: 28 })
    animateValue(tiltY, 0, { type: 'spring', stiffness: 400, damping: 28 })
  }, [tiltX, tiltY])

  const handleClick = useCallback(() => {
    if (isDragging) return
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    clickTimerRef.current = setTimeout(async () => {
      clickTimerRef.current = null
      await animate(scope.current, { scale: 1.12, rotate: (Math.random() > 0.5 ? 1 : -1) * 4 }, { duration: 0.07 })
      animate(scope.current, { scale: 1, rotate: 0 }, { type: 'spring', stiffness: 500, damping: 22 })
      onClick?.(card)
      playSound('highlight1', { pitch: 0.9 + Math.random() * 0.2, volume: 0.6 })
    }, 180)
  }, [card, onClick, animate, scope, playSound, isDragging])

  const flip = useCallback(async () => {
    // Cancel pending single-click before flipping
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current)
      clickTimerRef.current = null
    }
    playSound('card1', { pitch: 0.9 + Math.random() * 0.2 })
    await animate(scope.current, { scaleX: 0 }, { duration: 0.1, ease: [0.4, 0, 1, 1] })
    setFacing(f => (f === 'front' ? 'back' : 'front'))
    await animate(scope.current, { scaleX: 1 }, { duration: 0.1, ease: [0, 0, 0.6, 1] })
  }, [animate, scope, playSound])

  const handleDragEnd = useCallback(
    (_: unknown, info: { point: { x: number; y: number } }) => {
      setIsDragging(false)
      setDragOffsetX(0)
      onDragEnd?.(card, info)
    },
    [card, onDragEnd]
  )

  const editionClass = card.edition ? `bc-${card.edition}` : ''
  const enhancementClass = card.enhancement ? `bc-${card.enhancement}` : ''

  const faceStyle = hasSprite(card.rank, card.suit)
    ? getCardFaceStyle(card.rank, card.suit)
    : {}

  // Z-axis drag tilt — driven by how far the card has been dragged horizontally
  const dragRotate = isDragging ? Math.max(-18, Math.min(18, dragOffsetX * 0.05)) : 0

  return (
    <motion.div
      ref={scope}
      layout
      layoutId={layoutId}
      className={[
        'bc-card',
        selected ? 'bc-selected' : '',
        isHovered ? 'bc-hovered' : '',
        card.debuffed ? 'bc-debuffed' : '',
        editionClass,
      ].join(' ')}
      style={{
        ...style,
        transformPerspective: 600,
        rotateX: tiltX,
        rotateY: tiltY,
      }}
      animate={{
        y: isHovered && !isDragging
          ? [selected ? -25 : -14, selected ? -30 : -19]
          : ambient && !isHovered
          ? [-6, -14]
          : selected ? -25 : 0,
        scale: selected ? 1.15 : (isHovered && !isDragging ? 1.1 : 1),
        rotate: dragRotate,
      }}
      transition={{
        y: isHovered && !isDragging
          ? { duration: 0.9, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }
          : ambient && !isHovered
          ? { duration: 2.2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }
          : hoverSpring,
        scale: isHovered ? hoverSpring : cardSpring,
        rotate: { type: 'spring', stiffness: 300, damping: 25 },
      }}
      drag={draggable}
      dragSnapToOrigin={!onDragEnd}
      dragElastic={0.12}
      dragMomentum={false}
      onDragStart={() => {
        setIsDragging(true)
        resetTilt()
        playSound('cardSlide1', { pitch: 0.95 + Math.random() * 0.1, volume: 0.4 })
      }}
      onDrag={(_, info) => setDragOffsetX(info.offset.x)}
      onDragEnd={handleDragEnd}
      onHoverStart={() => {
        setIsHovered(true)
        onHover?.(card, true)
        if (ambient) {
          if (ambientTimerRef.current) clearTimeout(ambientTimerRef.current)
          ambientActiveRef.current = false
        }
        animate(scope.current, { rotate: [0, 5, -3, 0] }, { duration: 0.22 })
        playSound('highlight1', { pitch: 1.0 + Math.random() * 0.1, volume: 0.22 })
      }}
      onHoverEnd={() => {
        setIsHovered(false)
        onHover?.(card, false)
        resetTilt()
        if (ambient) {
          // Wait for the spring reset (~350 ms) then resume orbit from angle=0
          ambientTimerRef.current = setTimeout(() => {
            orbitStartRef.current = performance.now()
            ambientActiveRef.current = true
          }, 400)
        }
      }}
      onMouseMove={handleMouseMove}
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
        <img src={card.image} alt={`${card.rank} of ${card.suit}`} className="bc-customFace" />
      ) : (
        <div
          className={['bc-face', editionClass].join(' ')}
          style={faceStyle}
        >
          {card.enhancement && (
            <div className={`bc-enhancement ${enhancementClass}`} />
          )}
        </div>
      )}

      {card.seal && (
        <div
          className="bc-seal"
          style={getSealStyle(card.seal)}
          aria-label={`${card.seal} seal`}
        />
      )}
    </motion.div>
  )
}

// Enhancers.png atlas: 497×475 px, 7 cols × 5 rows (each sprite is 71×95 px)
const ENH_COLS = 7
const ENH_ROWS = 5

const SEAL_COLS: Record<string, number> = { gold: 0, red: 1, blue: 2, purple: 3 }
function getSealStyle(seal: string): React.CSSProperties {
  const col = SEAL_COLS[seal] ?? 0
  return {
    backgroundImage: 'url(/textures/1x/Enhancers.png)',
    backgroundSize: `${ENH_COLS * 100}% ${ENH_ROWS * 100}%`,
    backgroundPosition: `${(col / (ENH_COLS - 1)) * 100}% ${(4 / (ENH_ROWS - 1)) * 100}%`,
    imageRendering: 'pixelated',
  }
}
