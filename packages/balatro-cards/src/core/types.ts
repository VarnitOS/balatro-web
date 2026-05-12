export type Edition = 'foil' | 'holo' | 'polychrome' | 'negative'
export type Enhancement =
  | 'bonus' | 'mult' | 'wild' | 'glass'
  | 'steel' | 'stone' | 'gold' | 'lucky'
export type Seal = 'gold' | 'red' | 'blue' | 'purple'
export type Facing = 'front' | 'back'
export type LayoutType = 'fan' | 'pile' | 'row'
export type SortBy = 'rank' | 'suit'

export interface BalatroCard {
  id: string
  rank: string           // '2'–'A' or any custom string
  suit: string           // 'spades'|'hearts'|'clubs'|'diamonds' or custom
  facing: Facing
  image?: string         // custom face image URL — overrides sprite lookup
  back?: string          // custom back image URL
  edition?: Edition
  enhancement?: Enhancement
  seal?: Seal
  debuffed?: boolean
}

export interface DeckConfig {
  ranks?: string[]       // default standard 13 ranks
  suits?: string[]       // default 4 suits
  cards?: BalatroCard[]  // fully custom — overrides ranks/suits
  jokers?: boolean
}

export interface CardTransform {
  x: number
  y: number
  rotate: number
  scale: number
  zIndex: number
}
