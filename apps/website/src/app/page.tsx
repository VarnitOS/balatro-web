'use client'
import { BalatroDeck, CardArea, useDeck } from '@balatro/cards'

export default function Page() {
  const { deck, hand, discard, selected, draw, discardCards, selectCard, sortHand, reset, shuffle } =
    useDeck()

  return (
    <BalatroDeck sounds>
      <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '48px', alignItems: 'center' }}>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: `Draw 5 (${deck.length} left)`, action: () => draw(5), disabled: deck.length === 0 },
            { label: 'Discard Selected', action: () => discardCards(), disabled: selected.length === 0 },
            { label: 'Sort by Rank', action: () => sortHand('rank') },
            { label: 'Sort by Suit', action: () => sortHand('suit') },
            { label: 'Shuffle Deck', action: () => shuffle() },
            { label: 'Reset', action: () => reset() },
          ].map(({ label, action, disabled }) => (
            <button
              key={label}
              onClick={action}
              disabled={disabled}
              style={{
                fontFamily: "'m6x11plus', monospace",
                background: disabled ? '#333' : '#3a3a6a',
                color: disabled ? '#666' : '#e8e8f0',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: '14px',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Deck pile and discard */}
        <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontFamily: "'m6x11plus'", color: '#888', marginBottom: '8px', fontSize: '12px' }}>
              DECK ({deck.length})
            </p>
            <CardArea cards={deck} layout="pile" type="deck" onDraw={() => draw(1)} />
          </div>
          <div>
            <p style={{ fontFamily: "'m6x11plus'", color: '#888', marginBottom: '8px', fontSize: '12px' }}>
              DISCARD ({discard.length})
            </p>
            <CardArea cards={discard} layout="pile" type="discard" />
          </div>
        </div>

        {/* Hand */}
        <div style={{ width: '100%', maxWidth: '800px' }}>
          <p style={{ fontFamily: "'m6x11plus'", color: '#888', marginBottom: '8px', fontSize: '12px', textAlign: 'center' }}>
            HAND — click to select, double-click to flip
          </p>
          <CardArea
            cards={hand}
            layout="fan"
            selected={selected}
            onSelect={selectCard}
            maxAngle={24}
            draggable
          />
        </div>

        {selected.length > 0 && (
          <p style={{ fontFamily: "'m6x11plus'", color: '#f4d03f', fontSize: '12px' }}>
            {selected.length} card{selected.length > 1 ? 's' : ''} selected
          </p>
        )}
      </div>
    </BalatroDeck>
  )
}
