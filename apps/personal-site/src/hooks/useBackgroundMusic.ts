import { useEffect, useRef } from 'react'

export function useBackgroundMusic(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const playRef = useRef<() => void>(() => {})

  useEffect(() => {
    if (audioRef.current) return  // Strict Mode guard

    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0
    audioRef.current = audio

    function fadeAudio(targetVolume: number, duration: number, callback?: () => void) {
      const startVolume = audio.volume
      const change = targetVolume - startVolume
      const startTime = performance.now()
      clearInterval(fadeIntervalRef.current!)
      fadeIntervalRef.current = setInterval(() => {
        const elapsed = performance.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        audio.volume = Math.max(0, Math.min(1, startVolume + change * progress))
        if (progress >= 1) {
          clearInterval(fadeIntervalRef.current!)
          if (callback) callback()
        }
      }, 50)
    }

    function playMusic() {
      if (!audio.paused && audio.volume > 0) return
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.then(() => {
          fadeAudio(0.5, 2000)
        }).catch(() => {
          const startOnInteraction = () => {
            audio.play()
            fadeAudio(0.5, 2000)
            window.removeEventListener('click', startOnInteraction)
            window.removeEventListener('keydown', startOnInteraction)
          }
          window.addEventListener('click', startOnInteraction)
          window.addEventListener('keydown', startOnInteraction)
        })
      }
    }

    function pauseMusic() {
      fadeAudio(0, 1000, () => audio.pause())
    }

    playRef.current = playMusic

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pauseMusic()
      else playMusic()
    })

    playMusic()
  }, [src])

  return { play: () => playRef.current() }
}
