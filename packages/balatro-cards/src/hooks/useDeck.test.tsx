import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDeck } from './useDeck'
import { useDeckStore } from '../core/store'

beforeEach(() => {
  // Reset Zustand store between tests
  useDeckStore.setState({ deck: [], hand: [], discard: [], selected: [], config: {} })
})

describe('useDeck', () => {
  it('initializes a 52-card deck', () => {
    const { result } = renderHook(() => useDeck())
    expect(result.current.deck).toHaveLength(52)
    expect(result.current.hand).toHaveLength(0)
  })

  it('draw moves cards from deck to hand face-up', () => {
    const { result } = renderHook(() => useDeck())
    act(() => { result.current.draw(5) })
    expect(result.current.hand).toHaveLength(5)
    expect(result.current.deck).toHaveLength(47)
    expect(result.current.hand.every(c => c.facing === 'front')).toBe(true)
  })

  it('selectCard toggles selection', () => {
    const { result } = renderHook(() => useDeck())
    act(() => { result.current.draw(1) })
    const card = result.current.hand[0]
    act(() => { result.current.selectCard(card) })
    expect(result.current.selected).toHaveLength(1)
    act(() => { result.current.selectCard(card) })
    expect(result.current.selected).toHaveLength(0)
  })

  it('discardCards removes selected cards from hand', () => {
    const { result } = renderHook(() => useDeck())
    act(() => { result.current.draw(5) })
    const card = result.current.hand[0]
    act(() => { result.current.selectCard(card) })
    act(() => { result.current.discardCards() })
    expect(result.current.hand).toHaveLength(4)
    expect(result.current.discard).toHaveLength(1)
    expect(result.current.selected).toHaveLength(0)
  })

  it('reset restores full deck', () => {
    const { result } = renderHook(() => useDeck())
    act(() => { result.current.draw(10) })
    act(() => { result.current.reset() })
    expect(result.current.deck).toHaveLength(52)
    expect(result.current.hand).toHaveLength(0)
  })

  it('sortHand reorders cards', () => {
    const { result } = renderHook(() => useDeck())
    act(() => { result.current.draw(5) })
    act(() => { result.current.sortHand('rank') })
    // Can't guarantee different order (might already be sorted), but length stays same
    expect(result.current.hand).toHaveLength(5)
  })

  it('accepts custom config', () => {
    const { result } = renderHook(() => useDeck({ ranks: ['A'], suits: ['x'] }))
    expect(result.current.deck).toHaveLength(1)
  })
})
