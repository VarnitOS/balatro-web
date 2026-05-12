"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BalatroDeck: () => BalatroDeck,
  Card: () => Card,
  CardArea: () => CardArea,
  CardBack: () => CardBack,
  cardSpring: () => cardSpring,
  getFanPositions: () => getFanPositions,
  getPilePosition: () => getPilePosition,
  getRowPositions: () => getRowPositions,
  hoverSpring: () => hoverSpring,
  juiceSpring: () => juiceSpring,
  juiceUp: () => juiceUp,
  layoutSpring: () => layoutSpring,
  useDeck: () => useDeck,
  useSound: () => useSound
});
module.exports = __toCommonJS(index_exports);

// src/components/BalatroDeck/BalatroDeck.tsx
var import_react2 = require("react");

// src/hooks/useSound.ts
var import_react = require("react");
var audioContext = typeof window !== "undefined" ? new AudioContext() : null;
var bufferCache = /* @__PURE__ */ new Map();
async function loadSound(name) {
  if (!audioContext) return null;
  if (bufferCache.has(name)) return bufferCache.get(name);
  try {
    const res = await fetch(`/sounds/${name}.ogg`);
    const arrayBuffer = await res.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    bufferCache.set(name, audioBuffer);
    return audioBuffer;
  } catch {
    return null;
  }
}
function useSound(muted = false) {
  const mutedRef = (0, import_react.useRef)(muted);
  (0, import_react.useEffect)(() => {
    mutedRef.current = muted;
  }, [muted]);
  const playSound = (0, import_react.useCallback)(
    async (name, options = {}) => {
      if (mutedRef.current || !audioContext) return;
      if (audioContext.state === "suspended") await audioContext.resume();
      const buffer = await loadSound(name);
      if (!buffer) return;
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = options.pitch ?? 1;
      const gain = audioContext.createGain();
      gain.gain.value = options.volume ?? 1;
      source.connect(gain);
      gain.connect(audioContext.destination);
      source.start();
    },
    []
  );
  return { playSound };
}
async function preloadSounds(names) {
  await Promise.all(names.map((n) => loadSound(n)));
}

// src/components/BalatroDeck/BalatroDeck.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var PRELOAD_SOUNDS = [
  "card1",
  "card3",
  "cardFan2",
  "cardSlide1",
  "cardSlide2",
  "highlight1",
  "highlight2",
  "chips1",
  "chips2",
  "coin1",
  "coin2",
  "crumple1",
  "crumple2"
];
var BALATRO_CSS_VARS = `
  :root {
    --balatro-bg:          #1a1a2e;
    --balatro-surface:     #252545;
    --balatro-border:      rgba(255, 255, 255, 0.08);
    --balatro-text:        #e8e8f0;
    --balatro-red:         #cc3333;
    --balatro-yellow:      #f4d03f;
    --balatro-purple:      #8b5cf6;
    --balatro-glow:        rgba(244, 208, 63, 0.5);
    --card-w:              71px;
    --card-h:              95px;
    --card-radius:         5px;
  }

  @font-face {
    font-family: 'm6x11plus';
    src: url('/fonts/m6x11plus.ttf') format('truetype');
    font-display: swap;
  }
`;
function BalatroDeck({
  sounds = true,
  children,
  className = ""
}) {
  (0, import_react2.useEffect)(() => {
    const existing = document.getElementById("balatro-styles");
    if (existing) return;
    const style = document.createElement("style");
    style.id = "balatro-styles";
    style.textContent = BALATRO_CSS_VARS;
    document.head.appendChild(style);
    return () => {
      document.getElementById("balatro-styles")?.remove();
    };
  }, []);
  (0, import_react2.useEffect)(() => {
    if (sounds) preloadSounds(PRELOAD_SOUNDS);
  }, [sounds]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className,
      style: { fontFamily: "'m6x11plus', monospace", color: "var(--balatro-text)" },
      children
    }
  );
}

// src/components/Card/Card.tsx
var import_react3 = require("react");
var import_framer_motion = require("framer-motion");

// src/core/sprites.ts
var SUIT_ROW = {
  hearts: 0,
  clubs: 1,
  diamonds: 2,
  spades: 3
};
var RANK_COL = {
  "2": 0,
  "3": 1,
  "4": 2,
  "5": 3,
  "6": 4,
  "7": 5,
  "8": 6,
  "9": 7,
  "10": 8,
  "J": 9,
  "Jack": 9,
  "Q": 10,
  "Queen": 10,
  "K": 11,
  "King": 11,
  "A": 12,
  "Ace": 12
};
var ATLAS_COLS = 13;
var ATLAS_ROWS = 4;
function getCardFaceStyle(rank, suit) {
  const col = RANK_COL[rank];
  const row = SUIT_ROW[suit.toLowerCase()];
  if (col === void 0 || row === void 0) return {};
  return {
    backgroundImage: "url(/textures/1x/8BitDeck.png)",
    backgroundSize: `${ATLAS_COLS * 100}% ${ATLAS_ROWS * 100}%`,
    backgroundPosition: `${col / (ATLAS_COLS - 1) * 100}% ${row / (ATLAS_ROWS - 1) * 100}%`,
    imageRendering: "pixelated"
  };
}
function hasSprite(rank, suit) {
  return RANK_COL[rank] !== void 0 && SUIT_ROW[suit.toLowerCase()] !== void 0;
}
function getCardBackStyle() {
  return {
    backgroundImage: "url(/textures/1x/Enhancers.png)",
    backgroundSize: "500% 800%",
    // Enhancers.png is 5 cols × 8 rows
    backgroundPosition: "50% 0%",
    // col 2 of 5 = 50%; row 0 of 8 = 0%
    imageRendering: "pixelated"
  };
}

// src/animations/spring.ts
var cardSpring = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.8
};
var hoverSpring = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  mass: 0.5
};
var juiceSpring = {
  type: "spring",
  stiffness: 600,
  damping: 20,
  mass: 0.4
};
var layoutSpring = {
  type: "spring",
  stiffness: 300,
  damping: 35,
  mass: 1
};

// src/components/CardBack/CardBack.module.css
var CardBack_default = {};

// src/components/CardBack/CardBack.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function CardBack({ customSrc, className }) {
  const spriteStyle = customSrc ? { backgroundImage: `url(${customSrc})`, backgroundSize: "cover" } : getCardBackStyle();
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      className: `${CardBack_default.back} ${className ?? ""}`,
      style: spriteStyle,
      "aria-hidden": "true"
    }
  );
}

// src/components/Card/Card.module.css
var Card_default = {};

// src/effects/effects.module.css
var effects_default = {};

// src/components/Card/Card.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function Card({
  card,
  selected = false,
  draggable = false,
  layoutId,
  style,
  onHover,
  onClick,
  onDragEnd
}) {
  const [scope, animate] = (0, import_framer_motion.useAnimate)();
  const [facing, setFacing] = (0, import_react3.useState)(card.facing);
  const [isHovered, setIsHovered] = (0, import_react3.useState)(false);
  const { playSound } = useSound();
  const handleClick = (0, import_react3.useCallback)(async () => {
    await animate(scope.current, {
      scale: 1.08,
      rotate: (Math.random() > 0.5 ? 1 : -1) * 3.6
    }, { duration: 0.08, ease: "easeOut" });
    animate(scope.current, { scale: 1, rotate: 0 }, {
      type: "spring",
      stiffness: 500,
      damping: 25
    });
    onClick?.(card);
    playSound("highlight1", { pitch: 0.9 + Math.random() * 0.2, volume: 0.5 });
  }, [card, onClick, animate, scope, playSound]);
  const flip = (0, import_react3.useCallback)(async () => {
    playSound("card1", { pitch: 0.9 + Math.random() * 0.2 });
    await animate(scope.current, { scaleX: 0 }, {
      duration: 0.1,
      ease: [0.4, 0, 1, 1]
    });
    setFacing((f) => f === "front" ? "back" : "front");
    await animate(scope.current, { scaleX: 1 }, {
      duration: 0.1,
      ease: [0, 0, 0.6, 1]
    });
  }, [animate, scope, playSound]);
  const handleDragEnd = (0, import_react3.useCallback)(
    (_, info) => {
      onDragEnd?.(card, info);
    },
    [card, onDragEnd]
  );
  const editionClass = card.edition ? effects_default[card.edition] : "";
  const enhancementClass = card.enhancement ? Card_default[card.enhancement] : "";
  const faceStyle = hasSprite(card.rank, card.suit) ? getCardFaceStyle(card.rank, card.suit) : {};
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    import_framer_motion.motion.div,
    {
      ref: scope,
      layout: true,
      layoutId,
      className: [
        Card_default.card,
        selected ? effects_default.selected : "",
        isHovered ? effects_default.hovered : "",
        card.debuffed ? effects_default.debuffed : "",
        editionClass
      ].join(" "),
      style,
      animate: {
        y: isHovered ? -14 : 0,
        scale: selected ? 1.04 : 1
      },
      transition: isHovered ? hoverSpring : cardSpring,
      drag: draggable,
      dragSnapToOrigin: !onDragEnd,
      onDragEnd: handleDragEnd,
      onHoverStart: () => {
        setIsHovered(true);
        onHover?.(card, true);
        playSound("highlight1", { pitch: 1 + Math.random() * 0.1, volume: 0.3 });
      },
      onHoverEnd: () => {
        setIsHovered(false);
        onHover?.(card, false);
      },
      onClick: handleClick,
      onDoubleClick: flip,
      "data-card-id": card.id,
      "data-facing": facing,
      role: "button",
      "aria-pressed": selected,
      "aria-label": `${card.rank} of ${card.suit}`,
      children: [
        facing === "back" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CardBack, { customSrc: card.back }) : card.image ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("img", { src: card.image, alt: `${card.rank} of ${card.suit}`, className: Card_default.customFace }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: [Card_default.face, editionClass].join(" "),
            style: faceStyle,
            children: card.enhancement && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: `${Card_default.enhancement} ${enhancementClass}` })
          }
        ),
        card.seal && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: Card_default.seal,
            style: getSealStyle(card.seal),
            "aria-label": `${card.seal} seal`
          }
        )
      ]
    }
  );
}
var SEAL_COLS = { gold: 0, red: 1, blue: 2, purple: 3 };
function getSealStyle(seal) {
  const col = SEAL_COLS[seal] ?? 0;
  return {
    backgroundImage: "url(/textures/1x/Enhancers.png)",
    backgroundSize: "500% 800%",
    backgroundPosition: `${col / 4 * 100}% ${5 / 7 * 100}%`,
    imageRendering: "pixelated"
  };
}

// src/components/CardArea/CardArea.tsx
var import_framer_motion2 = require("framer-motion");

// src/animations/fan.ts
function getFanPositions(n, options = {}) {
  if (n === 0) return [];
  const { maxAngle = 30, xSpread = 40, yParabola = 15 } = options;
  if (n === 1) return [{ x: 0, y: 0, rotate: 0, scale: 1, zIndex: 1 }];
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1) - 0.5;
    return {
      x: t * xSpread * Math.min(n, 8),
      y: Math.pow(t * 2, 2) * yParabola,
      rotate: t * maxAngle,
      scale: 1,
      zIndex: i + 1
    };
  });
}
function getPilePosition() {
  return { x: 0, y: 0, rotate: 0, scale: 1, zIndex: 1 };
}
function getRowPositions(n, spacing = 80) {
  return Array.from({ length: n }, (_, i) => ({
    x: (i - (n - 1) / 2) * spacing,
    y: 0,
    rotate: 0,
    scale: 1,
    zIndex: i + 1
  }));
}

// src/components/CardArea/CardArea.module.css
var CardArea_default = {};

// src/components/CardArea/CardArea.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function CardArea({
  cards,
  layout = "fan",
  type,
  selected = [],
  draggable = false,
  maxAngle = 30,
  onSelect,
  onDraw,
  onCardDragEnd,
  className = ""
}) {
  const { playSound } = useSound();
  const selectedIds = new Set(selected.map((c) => c.id));
  if (layout === "fan") {
    const positions2 = getFanPositions(cards.length, { maxAngle });
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: `${CardArea_default.area} ${CardArea_default.fan} ${className}`, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_framer_motion2.AnimatePresence, { children: cards.map((card, i) => {
      const pos = positions2[i];
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "div",
        {
          className: CardArea_default.cardWrapper,
          style: {
            transform: `translateX(${pos.x}px) translateY(${pos.y}px) rotate(${pos.rotate}deg)`,
            zIndex: pos.zIndex,
            transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            Card,
            {
              card,
              selected: selectedIds.has(card.id),
              draggable,
              layoutId: card.id,
              onClick: onSelect,
              onDragEnd: onCardDragEnd
            }
          )
        },
        card.id
      );
    }) }) });
  }
  if (layout === "pile") {
    const topCard = cards[cards.length - 1];
    const backgroundCards = cards.slice(-3, -1);
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      "div",
      {
        className: `${CardArea_default.area} ${CardArea_default.pile} ${className}`,
        onClick: () => {
          if (type === "deck" && onDraw) {
            playSound("cardSlide1", { pitch: 0.9 + Math.random() * 0.2 });
            onDraw();
          }
        },
        role: type === "deck" ? "button" : void 0,
        "aria-label": type === "deck" ? `Draw card (${cards.length} remaining)` : void 0,
        children: [
          backgroundCards.map((card, i) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "div",
            {
              style: {
                position: "absolute",
                top: (backgroundCards.length - i) * -1.5,
                left: (backgroundCards.length - i) * 0.5,
                zIndex: i
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Card, { card: { ...card, facing: "back" } })
            },
            card.id
          )),
          topCard && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { position: "relative", zIndex: 4 }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Card, { card: { ...topCard, facing: "back" } }) })
        ]
      }
    );
  }
  const positions = getRowPositions(cards.length);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: `${CardArea_default.area} ${CardArea_default.row} ${className}`, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_framer_motion2.AnimatePresence, { children: cards.map((card, i) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: CardArea_default.rowWrapper, style: { marginLeft: positions[i].x }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    Card,
    {
      card,
      selected: selectedIds.has(card.id),
      draggable,
      layoutId: card.id,
      onClick: onSelect,
      onDragEnd: onCardDragEnd
    }
  ) }, card.id)) }) });
}

// src/hooks/useDeck.ts
var import_react4 = require("react");

// src/core/store.ts
var import_zustand = require("zustand");

// src/core/deck.ts
var DEFAULT_RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var DEFAULT_SUITS = ["spades", "hearts", "clubs", "diamonds"];
var RANK_ORDER = Object.fromEntries(DEFAULT_RANKS.map((r, i) => [r, i]));
var SUIT_ORDER = {
  spades: 0,
  hearts: 1,
  clubs: 2,
  diamonds: 3
};
function createDeck(config = {}) {
  if (config.cards) {
    return config.cards.map((c) => ({ ...c, facing: "back" }));
  }
  const ranks = config.ranks ?? DEFAULT_RANKS;
  const suits = config.suits ?? DEFAULT_SUITS;
  const cards = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      cards.push({
        id: `${rank}-${suit}-${crypto.randomUUID()}`,
        rank,
        suit,
        facing: "back"
      });
    }
  }
  if (config.jokers) {
    cards.push({ id: `joker-1-${crypto.randomUUID()}`, rank: "Joker", suit: "none", facing: "back" });
    cards.push({ id: `joker-2-${crypto.randomUUID()}`, rank: "Joker", suit: "none", facing: "back" });
  }
  return cards;
}
function shuffleDeck(cards) {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function sortByRank(cards) {
  return [...cards].sort((a, b) => {
    const ar = RANK_ORDER[a.rank] ?? 999;
    const br = RANK_ORDER[b.rank] ?? 999;
    return ar - br;
  });
}
function sortBySuit(cards) {
  return [...cards].sort((a, b) => {
    const as = SUIT_ORDER[a.suit] ?? 999;
    const bs = SUIT_ORDER[b.suit] ?? 999;
    if (as !== bs) return as - bs;
    return (RANK_ORDER[a.rank] ?? 999) - (RANK_ORDER[b.rank] ?? 999);
  });
}

// src/core/store.ts
var useDeckStore = (0, import_zustand.create)((set, get) => ({
  deck: [],
  hand: [],
  discard: [],
  selected: [],
  config: {},
  _initialize: (config) => {
    const cards = createDeck(config);
    set({ deck: shuffleDeck(cards), hand: [], discard: [], selected: [], config });
  },
  _shuffle: () => set((state) => ({ deck: shuffleDeck([...state.deck]) })),
  _draw: (n) => set((state) => {
    const toDraw = state.deck.slice(0, n).map((c) => ({ ...c, facing: "front" }));
    return { deck: state.deck.slice(n), hand: [...state.hand, ...toDraw] };
  }),
  _discardCards: (cards) => set((state) => {
    const toDiscard = cards ?? state.selected;
    const ids = new Set(toDiscard.map((c) => c.id));
    return {
      hand: state.hand.filter((c) => !ids.has(c.id)),
      discard: [...state.discard, ...toDiscard],
      selected: state.selected.filter((c) => !ids.has(c.id))
    };
  }),
  _selectCard: (card) => set((state) => {
    const already = state.selected.some((c) => c.id === card.id);
    return {
      selected: already ? state.selected.filter((c) => c.id !== card.id) : [...state.selected, card]
    };
  }),
  _sortHand: (by) => set((state) => ({
    hand: by === "rank" ? sortByRank(state.hand) : sortBySuit(state.hand)
  })),
  _setEdition: (cardId, edition) => set((state) => ({
    hand: state.hand.map((c) => c.id === cardId ? { ...c, edition } : c)
  })),
  _setSeal: (cardId, seal) => set((state) => ({
    hand: state.hand.map((c) => c.id === cardId ? { ...c, seal } : c)
  })),
  _reset: () => {
    const { config } = get();
    const cards = createDeck(config);
    set({ deck: shuffleDeck(cards), hand: [], discard: [], selected: [] });
  }
}));

// src/hooks/useDeck.ts
function useDeck(config = {}) {
  const store = useDeckStore();
  const initialized = (0, import_react4.useRef)(false);
  (0, import_react4.useEffect)(() => {
    if (!initialized.current) {
      initialized.current = true;
      store._initialize(config);
    }
  }, []);
  return {
    deck: store.deck,
    hand: store.hand,
    discard: store.discard,
    selected: store.selected,
    config: store.config,
    shuffle: store._shuffle,
    draw: store._draw,
    discardCards: store._discardCards,
    selectCard: store._selectCard,
    sortHand: store._sortHand,
    setEdition: (card, edition) => store._setEdition(card.id, edition),
    setSeal: (card, seal) => store._setSeal(card.id, seal),
    reset: store._reset
  };
}

// src/animations/juice.ts
async function juiceUp(controls, scale, rotation) {
  const dir = Math.random() > 0.5 ? 1 : -1;
  await controls.start({
    scale: 1 + scale * 0.25,
    rotate: rotation * 12 * dir,
    transition: { duration: 0.08, ease: "easeOut" }
  });
  controls.start({
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 500, damping: 25 }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BalatroDeck,
  Card,
  CardArea,
  CardBack,
  cardSpring,
  getFanPositions,
  getPilePosition,
  getRowPositions,
  hoverSpring,
  juiceSpring,
  juiceUp,
  layoutSpring,
  useDeck,
  useSound
});
//# sourceMappingURL=index.js.map