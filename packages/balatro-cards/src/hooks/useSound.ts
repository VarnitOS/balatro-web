import { useCallback, useEffect, useRef } from 'react'

interface PlayOptions {
  pitch?: number    // playbackRate multiplier, default 1.0 (Balatro uses 0.85–1.5)
  volume?: number   // 0.0–1.0, default 1.0
}

type SoundName =
  | 'card1' | 'card3' | 'cardFan2' | 'cardSlide1' | 'cardSlide2'
  | 'chips1' | 'chips2'
  | 'coin1' | 'coin2' | 'coin3' | 'coin4' | 'coin5' | 'coin6' | 'coin7'
  | 'crumple1' | 'crumple2' | 'crumple3' | 'crumple4' | 'crumple5'
  | 'crumpleLong1' | 'crumpleLong2'
  | 'explosion1' | 'explosion_buildup1' | 'explosion_release1'
  | 'foil1' | 'foil2' | 'glass1' | 'glass2' | 'glass3' | 'glass4' | 'glass5' | 'glass6'
  | 'gold_seal' | 'gong' | 'highlight1' | 'highlight2' | 'holo1'
  | 'magic_crumple' | 'magic_crumple2' | 'magic_crumple3'
  | 'multhit1' | 'multhit2'
  | 'music1' | 'music2' | 'music3' | 'music4' | 'music5'
  | 'negative' | 'other1' | 'paper1' | 'polychrome1'
  | 'slice1' | 'splash_buildup'
  | 'tarot1' | 'tarot2' | 'timpani'
  | 'voice1' | 'voice2' | 'voice3' | 'voice4' | 'voice5'
  | 'voice6' | 'voice7' | 'voice8' | 'voice9' | 'voice10' | 'voice11'
  | 'whoosh' | 'whoosh1' | 'whoosh2' | 'whoosh_long' | 'win'
  | 'button' | 'cancel' | 'generic1' | 'ambientFire1' | 'ambientFire2'
  | 'ambientFire3' | 'ambientOrgan1' | 'introPad1'

let _audioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!_audioContext) {
    _audioContext = new AudioContext()
  }
  return _audioContext
}

const bufferCache = new Map<string, AudioBuffer>()

async function loadSound(name: SoundName): Promise<AudioBuffer | null> {
  const audioContext = getAudioContext()
  if (!audioContext) return null
  if (bufferCache.has(name)) return bufferCache.get(name)!

  try {
    const res = await fetch(`/sounds/${name}.ogg`)
    const arrayBuffer = await res.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    bufferCache.set(name, audioBuffer)
    return audioBuffer
  } catch {
    return null
  }
}

export function useSound(muted = false) {
  const mutedRef = useRef(muted)
  useEffect(() => { mutedRef.current = muted }, [muted])

  const playSound = useCallback(
    async (name: SoundName, options: PlayOptions = {}) => {
      const audioContext = getAudioContext()
      if (mutedRef.current || !audioContext) return
      if (audioContext.state === 'suspended') await audioContext.resume()

      const buffer = await loadSound(name)
      if (!buffer) return

      const source = audioContext.createBufferSource()
      source.buffer = buffer
      source.playbackRate.value = options.pitch ?? 1.0

      const gain = audioContext.createGain()
      gain.gain.value = options.volume ?? 1.0

      source.connect(gain)
      gain.connect(audioContext.destination)
      source.start()
    },
    []
  )

  return { playSound }
}

// Preload commonly used sounds upfront (call in BalatroDeck provider)
export async function preloadSounds(names: SoundName[]): Promise<void> {
  await Promise.all(names.map(n => loadSound(n)))
}

export type { SoundName, PlayOptions }
