export const FLIP_HALF_DURATION = 0.1

export const flipCollapse = {
  scaleX: 0,
  transition: {
    duration: FLIP_HALF_DURATION,
    ease: [0.4, 0, 1, 1] as [number, number, number, number],
  },
}

export const flipExpand = {
  scaleX: 1,
  transition: {
    duration: FLIP_HALF_DURATION,
    ease: [0, 0, 0.6, 1] as [number, number, number, number],
  },
}
