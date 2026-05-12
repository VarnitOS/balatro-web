'use client'
import { useEffect } from 'react'
import { BalatroDeck, CardArea, useDeck, useSound } from '@balatro/cards'

export default function Page() {
  const { deck, hand, discard, selected, draw, discardCards, selectCard, sortHand, reset, shuffle } =
    useDeck()
  const { playSound } = useSound()

  useEffect(() => { draw(8) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const playHand = () => {
    if (selected.length === 0) return
    playSound('cardSlide1', { pitch: 0.85 + Math.random() * 0.15, volume: 0.8 })
    discardCards()
  }

  const discardSelected = () => {
    if (selected.length === 0) return
    playSound('crumple1', { pitch: 0.85 + Math.random() * 0.2, volume: 0.9 })
    discardCards()
  }

  const handleReset = () => {
    reset()
    setTimeout(() => draw(8), 30)
  }

  return (
    <BalatroDeck sounds>
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse 110% 80% at 50% 30%, #3d9060 0%, #246840 35%, #154a28 65%, #0a2a15 100%)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
      }}>

        {/* Play area — top center */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '48px',
        }}>
          {discard.length > 0 ? (
            <CardArea cards={discard.slice(-8)} layout="row" />
          ) : (
            <div style={{
              width: '480px',
              height: '95px',
              border: '2px dashed rgba(255,255,255,0.1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: "'m6x11plus', monospace",
                color: 'rgba(255,255,255,0.15)',
                fontSize: '12px',
                letterSpacing: '4px',
              }}>PLAY AREA</span>
            </div>
          )}
        </div>

        {/* Bottom — controls | hand | deck */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          padding: '0 48px 48px',
          gap: '16px',
        }}>

          {/* Left controls */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '7px',
            paddingBottom: '28px',
            minWidth: '110px',
          }}>
            {([
              { label: `Draw (${deck.length})`, action: () => draw(8), disabled: deck.length === 0 },
              { label: 'Sort Rank', action: () => sortHand('rank'), disabled: false },
              { label: 'Sort Suit', action: () => sortHand('suit'), disabled: false },
              { label: 'Shuffle', action: () => shuffle(), disabled: false },
              { label: 'Reset', action: handleReset, disabled: false },
            ] as { label: string; action: () => void; disabled: boolean }[]).map(({ label, action, disabled }) => (
              <button
                key={label}
                onClick={action}
                disabled={disabled}
                style={{
                  fontFamily: "'m6x11plus', monospace",
                  background: 'rgba(0,0,0,0.3)',
                  color: disabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  textAlign: 'left',
                }}
              >{label}</button>
            ))}
          </div>

          {/* Hand — center */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
          }}>
            {/* Play / Discard buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={playHand}
                disabled={selected.length === 0}
                style={{
                  fontFamily: "'m6x11plus', monospace",
                  background: selected.length > 0 ? 'rgba(40,80,180,0.75)' : 'rgba(0,0,0,0.25)',
                  color: selected.length > 0 ? '#bbddff' : 'rgba(255,255,255,0.2)',
                  border: `1px solid ${selected.length > 0 ? 'rgba(100,160,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '4px',
                  padding: '8px 26px',
                  cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  boxShadow: selected.length > 0 ? '0 0 18px rgba(60,100,255,0.2)' : 'none',
                  transition: 'all 0.12s',
                }}
              >Play Hand</button>
              <button
                onClick={discardSelected}
                disabled={selected.length === 0}
                style={{
                  fontFamily: "'m6x11plus', monospace",
                  background: selected.length > 0 ? 'rgba(150,60,20,0.75)' : 'rgba(0,0,0,0.25)',
                  color: selected.length > 0 ? '#ffbb77' : 'rgba(255,255,255,0.2)',
                  border: `1px solid ${selected.length > 0 ? 'rgba(255,130,50,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '4px',
                  padding: '8px 26px',
                  cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  transition: 'all 0.12s',
                }}
              >Discard</button>
            </div>

            <CardArea
              cards={hand}
              layout="fan"
              selected={selected}
              onSelect={selectCard}
              maxAngle={24}
              draggable
            />

            {selected.length > 0 && (
              <p style={{ fontFamily: "'m6x11plus'", color: '#f4d03f', fontSize: '12px', margin: 0 }}>
                {selected.length} card{selected.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Deck — right */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            paddingBottom: '16px',
          }}>
            <CardArea cards={deck} layout="pile" type="deck" onDraw={() => draw(1)} />
            <span style={{
              fontFamily: "'m6x11plus', monospace",
              color: 'rgba(255,255,255,0.4)',
              fontSize: '11px',
              letterSpacing: '1px',
            }}>{deck.length} left</span>
          </div>
        </div>
      </div>
    </BalatroDeck>
  )
}
