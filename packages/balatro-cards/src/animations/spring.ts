export const cardSpring = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 22,
  mass: 0.7,
}

// Snappy with slight overshoot — matches DOTween OutBack feel
export const hoverSpring = {
  type: 'spring' as const,
  stiffness: 550,
  damping: 18,
  mass: 0.5,
}

export const juiceSpring = {
  type: 'spring' as const,
  stiffness: 700,
  damping: 16,
  mass: 0.4,
}

export const layoutSpring = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 32,
  mass: 1.0,
}
