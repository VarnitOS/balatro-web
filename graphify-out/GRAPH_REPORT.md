# Graph Report - .  (2026-07-03)

## Corpus Check
- 26 files · ~7,931 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 168 nodes · 244 edges · 16 communities (12 shown, 4 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 56,959 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Deck Core Logic|Deck Core Logic]]
- [[_COMMUNITY_Portfolio Page Content|Portfolio Page Content]]
- [[_COMMUNITY_Card Component Library|Card Component Library]]
- [[_COMMUNITY_Spring Animations & Card Internals|Spring Animations & Card Internals]]
- [[_COMMUNITY_WebGL Background & Architecture|WebGL Background & Architecture]]
- [[_COMMUNITY_Card Event Handlers|Card Event Handlers]]
- [[_COMMUNITY_Fan Layout Algorithms|Fan Layout Algorithms]]
- [[_COMMUNITY_Deck Provider & Sound System|Deck Provider & Sound System]]
- [[_COMMUNITY_App Icon & Branding|App Icon & Branding]]
- [[_COMMUNITY_Flip Animations|Flip Animations]]
- [[_COMMUNITY_App Layout|App Layout]]
- [[_COMMUNITY_Styles Declaration|Styles Declaration]]
- [[_COMMUNITY_Flip Module|Flip Module]]

## God Nodes (most connected - your core abstractions)
1. `Page Component (single-page portfolio)` - 13 edges
2. `Card Component` - 10 edges
3. `index.ts — public package entry re-exporting all components, hooks, types, and animation utilities` - 9 edges
4. `BalatroCard` - 6 edges
5. `Card()` - 6 edges
6. `store.ts — Zustand DeckStore holding deck/hand/discard/selected state` - 6 edges
7. `DeckConfig` - 5 edges
8. `useSound()` - 5 edges
9. `getFanPositions()` - 5 edges
10. `BalatroCard — core card entity with rank, suit, facing, edition, enhancement, seal` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Ambient Tilt Orbit (Balatro title screen 1.56 rad/s rAF loop)` --semantically_similar_to--> `fragmentShader (GLSL spinning color field with pixelation)`  [INFERRED] [semantically similar]
  packages/balatro-cards/src/components/Card/Card.tsx → apps/personal-site/src/components/BalatroBackground.tsx
- `Sound System Design (lazy AudioContext, ogg files, playSound/preloadSounds)` --rationale_for--> `handleClick (180ms debounce single-click handler)`  [INFERRED]
  CLAUDE.md → packages/balatro-cards/src/components/Card/Card.tsx
- `Sound System Design (lazy AudioContext, ogg files, playSound/preloadSounds)` --rationale_for--> `flip (double-click face toggle animation)`  [INFERRED]
  CLAUDE.md → packages/balatro-cards/src/components/Card/Card.tsx
- `getSealStyle (Enhancers.png atlas seal lookup)` --implements--> `Sprite Atlas Convention (8BitDeck.png, Enhancers.png, backgroundPosition %)`  [INFERRED]
  packages/balatro-cards/src/components/Card/Card.tsx → CLAUDE.md
- `Monorepo Architecture (apps + packages, pnpm workspaces)` --rationale_for--> `RootLayout (Next.js App Router layout)`  [INFERRED]
  CLAUDE.md → apps/personal-site/src/app/layout.tsx

## Hyperedges (group relationships)
- **Public package API: index.ts re-exports all components, hooks, types, and animation utilities** — index_module, balatrodik_component, card_component, cardarea_component, cardback_component, usedeck_hook, usesound_hook, fan_module, juice_module, spring_module, types_module [EXTRACTED 1.00]
- **Sprite rendering: sprites module provides CSS for Card face and CardBack from 8BitDeck.png / Enhancers.png atlases** — sprites_module, card_component, cardback_component [EXTRACTED 1.00]
- **Deck state system: types + deck utilities + Zustand store + useDeck hook** — types_module, deck_module, store_module, usedeck_hook [EXTRACTED 0.95]
- **Portfolio Section + CardFan + Data Array Pattern** — page_experience, page_projects, page_blogs, cardfan_cardfan, cardfan_fanitem [EXTRACTED 0.95]
- **Landing Mode Visual Layer Stack** — balatroBg_balatroBg, card_card, page_nav_island_layoutid, claude_md_layer_stack [INFERRED 0.85]
- **Site Entry Trigger Flow** — usescrolltoenter_usescrolltoenter, page_hasenteredsite, page_handlenavclick, claude_md_two_mode_page [EXTRACTED 0.90]

## Communities (16 total, 4 thin omitted)

### Community 0 - "Deck Core Logic"
Cohesion: 0.1
Nodes (30): createDeck(), DEFAULT_RANKS, DEFAULT_SUITS, RANK_ORDER, shuffleDeck(), sortByRank(), sortBySuit(), SUIT_ORDER (+22 more)

### Community 1 - "Portfolio Page Content"
Cohesion: 0.11
Nodes (16): ACE_OF_SPADES, BlogEntry, BLOGS, EXPERIENCE, ExperienceEntry, NAV_BUTTONS, Page(), ProjectEntry (+8 more)

### Community 2 - "Card Component Library"
Cohesion: 0.17
Nodes (20): BalatroCard — core card entity with rank, suit, facing, edition, enhancement, seal, BalatroDeck.tsx — root provider component injecting CSS vars and preloading sounds, CardArea.tsx — multi-layout card container (fan / pile / row), CardBack.tsx — card back face using Enhancers sprite atlas, CardTransform — {x, y, rotate, scale, zIndex} layout value object, deck.ts — createDeck / shuffleDeck / sortByRank / sortBySuit utilities, deck.test.ts — unit tests for deck utilities, DeckConfig — config object for creating custom decks (+12 more)

### Community 3 - "Spring Animations & Card Internals"
Cohesion: 0.17
Nodes (15): cardSpring, hoverSpring, juiceSpring, layoutSpring, Card(), CardProps, getSealStyle(), SEAL_COLS (+7 more)

### Community 4 - "WebGL Background & Architecture"
Cohesion: 0.12
Nodes (19): BalatroBackground Component (OGL WebGL spinning shader canvas), fragmentShader (GLSL spinning color field with pixelation), hexToVec4 (hex color to GLSL vec4 converter), vertexShader (fullscreen triangle pass-through), Layer Stack Design (z-index order: background, vignette, hero, chrome), Monorepo Architecture (apps + packages, pnpm workspaces), Two-Mode Page Architecture (landing vs portfolio via hasEnteredSite), RootLayout (Next.js App Router layout) (+11 more)

### Community 5 - "Card Event Handlers"
Cohesion: 0.18
Nodes (13): Ambient Tilt Orbit (Balatro title screen 1.56 rad/s rAF loop), Card Component, CardProps Interface, flip (double-click face toggle animation), getSealStyle (Enhancers.png atlas seal lookup), handleClick (180ms debounce single-click handler), handleDragEnd, handleMouseMove (3D tilt on hover, no re-renders) (+5 more)

### Community 6 - "Fan Layout Algorithms"
Cohesion: 0.29
Nodes (9): FanOptions, getFanPositions(), getPilePosition(), getRowPositions(), [pos], positions, CardArea(), CardAreaProps (+1 more)

### Community 7 - "Deck Provider & Sound System"
Cohesion: 0.24
Nodes (8): BalatroDeckProps, PRELOAD_SOUNDS, bufferCache, getAudioContext(), loadSound(), PlayOptions, preloadSounds(), SoundName

### Community 8 - "App Icon & Branding"
Cohesion: 0.67
Nodes (4): Personal Site App Icon, Balatro Branding, Playing Card Theme, Spade Symbol

## Knowledge Gaps
- **67 isolated node(s):** `SUIT_ROW`, `RANK_COL`, `deck`, `ids`, `custom` (+62 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getFanPositions()` connect `Fan Layout Algorithms` to `Portfolio Page Content`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **Why does `CardFan()` connect `Portfolio Page Content` to `Fan Layout Algorithms`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `BalatroCard` connect `Deck Core Logic` to `Spring Animations & Card Internals`, `Fan Layout Algorithms`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `SUIT_ROW`, `RANK_COL`, `deck` to the rest of the system?**
  _67 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Deck Core Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Portfolio Page Content` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `WebGL Background & Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._