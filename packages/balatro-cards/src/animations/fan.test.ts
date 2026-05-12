import { describe, it, expect } from 'vitest'
import { getFanPositions, getRowPositions, getPilePosition } from './fan'

describe('getFanPositions', () => {
  it('returns empty array for 0 cards', () => {
    expect(getFanPositions(0)).toEqual([])
  })

  it('returns centered position for 1 card', () => {
    const [pos] = getFanPositions(1)
    expect(pos.rotate).toBe(0)
    expect(pos.x).toBe(0)
    expect(pos.y).toBe(0)
  })

  it('returns n positions for n cards', () => {
    expect(getFanPositions(5)).toHaveLength(5)
  })

  it('first and last cards have opposite rotations', () => {
    const positions = getFanPositions(5)
    expect(positions[0].rotate).toBeLessThan(0)
    expect(positions[4].rotate).toBeGreaterThan(0)
    expect(Math.abs(positions[0].rotate)).toBeCloseTo(Math.abs(positions[4].rotate), 1)
  })

  it('middle card has zero rotation', () => {
    const positions = getFanPositions(5)
    expect(positions[2].rotate).toBeCloseTo(0, 5)
  })

  it('zIndex increases left to right', () => {
    const positions = getFanPositions(5)
    for (let i = 1; i < positions.length; i++) {
      expect(positions[i].zIndex).toBeGreaterThan(positions[i - 1].zIndex)
    }
  })

  it('respects custom maxAngle', () => {
    const positions = getFanPositions(3, { maxAngle: 60 })
    expect(positions[0].rotate).toBeCloseTo(-30, 1)
    expect(positions[2].rotate).toBeCloseTo(30, 1)
  })
})

describe('getRowPositions', () => {
  it('centers the row', () => {
    const positions = getRowPositions(3, 80)
    expect(positions[1].x).toBe(0)  // middle card centered
    expect(positions[0].x).toBeLessThan(0)
    expect(positions[2].x).toBeGreaterThan(0)
  })
})
