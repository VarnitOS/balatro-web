import { useEffect, useRef } from 'react'

const SCROLL_THRESHOLD = 18

export function useScrollToEnter(enabled: boolean, onTrigger: () => void) {
  const onTriggerRef = useRef(onTrigger)
  onTriggerRef.current = onTrigger

  useEffect(() => {
    if (!enabled) return

    let accumulated = 0
    let touchStartY = 0

    function detach() {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }

    function fire() {
      detach()
      onTriggerRef.current()
    }

    function handleWheel(e: WheelEvent) {
      accumulated += Math.abs(e.deltaY)
      if (accumulated >= SCROLL_THRESHOLD) fire()
    }

    function handleTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0]?.clientY ?? 0
    }

    function handleTouchMove(e: TouchEvent) {
      const y = e.touches[0]?.clientY ?? touchStartY
      accumulated = Math.abs(y - touchStartY)
      if (accumulated >= SCROLL_THRESHOLD) fire()
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return detach
  }, [enabled])
}
