import type { AnimationControls } from 'framer-motion'

export async function juiceUp(
  controls: AnimationControls,
  scale: number,
  rotation: number
): Promise<void> {
  const dir = Math.random() > 0.5 ? 1 : -1
  await controls.start({
    scale: 1 + scale * 0.25,
    rotate: rotation * 12 * dir,
    transition: { duration: 0.08, ease: 'easeOut' },
  })
  controls.start({
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 500, damping: 25 },
  })
}
