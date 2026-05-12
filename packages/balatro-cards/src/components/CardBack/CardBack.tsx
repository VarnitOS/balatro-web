import { getCardBackStyle } from '../../core/sprites'
import styles from './CardBack.module.css'

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
      className={`${styles.back} ${className ?? ''}`}
      style={spriteStyle}
      aria-hidden="true"
    />
  )
}
