import { getCardBackStyle } from '../../core/sprites'
import './CardBack.css'

interface CardBackProps {
  customSrc?: string  // override with a custom back image
  className?: string
}

export function CardBack({ customSrc, className }: CardBackProps) {
  const spriteStyle = customSrc
    ? { backgroundImage: `url(${customSrc})`, backgroundSize: 'cover' }
    : getCardBackStyle()

  return (
    <div
      className={`bc-back ${className ?? ''}`}
      style={spriteStyle}
      aria-hidden="true"
    />
  )
}
