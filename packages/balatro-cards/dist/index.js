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
var _audioContext = null;
function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!_audioContext) {
    _audioContext = new AudioContext();
  }
  return _audioContext;
}
var bufferCache = /* @__PURE__ */ new Map();
async function loadSound(name) {
  const audioContext = getAudioContext();
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
      const audioContext = getAudioContext();
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
var ENH_COLS = 7;
var ENH_ROWS = 5;
function getCardBackStyle() {
  return {
    backgroundImage: "url(/textures/1x/Enhancers.png)",
    backgroundSize: `${ENH_COLS * 100}% ${ENH_ROWS * 100}%`,
    // 700% 500%
    backgroundPosition: "0% 0%",
    // col=0, row=0 = Red Deck back
    imageRendering: "pixelated"
  };
}

// src/animations/spring.ts
var cardSpring = {
  type: "spring",
  stiffness: 380,
  damping: 22,
  mass: 0.7
};
var hoverSpring = {
  type: "spring",
  stiffness: 550,
  damping: 18,
  mass: 0.5
};
var juiceSpring = {
  type: "spring",
  stiffness: 700,
  damping: 16,
  mass: 0.4
};
var layoutSpring = {
  type: "spring",
  stiffness: 300,
  damping: 32,
  mass: 1
};

// src/components/CardBack/CardBack.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function CardBack({ customSrc, className }) {
  const spriteStyle = customSrc ? { backgroundImage: `url(${customSrc})`, backgroundSize: "cover" } : getCardBackStyle();
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      className: `bc-back ${className ?? ""}`,
      style: spriteStyle,
      "aria-hidden": "true"
    }
  );
}

// src/components/Card/Card.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function Card({
  card,
  selected = false,
  draggable = false,
  layoutId,
  style,
  ambient = false,
  onHover,
  onClick,
  onDragEnd
}) {
  const [scope, animate] = (0, import_framer_motion.useAnimate)();
  const [facing, setFacing] = (0, import_react3.useState)(card.facing);
  (0, import_react3.useEffect)(() => {
    setFacing(card.facing);
  }, [card.id, card.facing]);
  const [isHovered, setIsHovered] = (0, import_react3.useState)(false);
  const [isDragging, setIsDragging] = (0, import_react3.useState)(false);
  const [dragOffsetX, setDragOffsetX] = (0, import_react3.useState)(0);
  const { playSound } = useSound();
  const clickTimerRef = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => () => {
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
  }, []);
  const tiltX = (0, import_framer_motion.useMotionValue)(0);
  const tiltY = (0, import_framer_motion.useMotionValue)(0);
  const ambientActiveRef = (0, import_react3.useRef)(ambient);
  const ambientTimerRef = (0, import_react3.useRef)(null);
  const rafRef = (0, import_react3.useRef)(0);
  const orbitStartRef = (0, import_react3.useRef)(performance.now());
  (0, import_react3.useEffect)(() => {
    if (!ambient) return;
    ambientActiveRef.current = true;
    orbitStartRef.current = performance.now();
    const tick = (now) => {
      if (ambientActiveRef.current) {
        const t = (now - orbitStartRef.current) / 1e3;
        const angle = t * 1.56;
        tiltX.set(-Math.sin(angle) * 9.6);
        tiltY.set(Math.cos(angle) * 9.6);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ambient, tiltX, tiltY]);
  const handleMouseMove = (0, import_react3.useCallback)((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(-ny * 24);
    tiltY.set(nx * 24);
  }, [tiltX, tiltY]);
  const resetTilt = (0, import_react3.useCallback)(() => {
    (0, import_framer_motion.animate)(tiltX, 0, { type: "spring", stiffness: 400, damping: 28 });
    (0, import_framer_motion.animate)(tiltY, 0, { type: "spring", stiffness: 400, damping: 28 });
  }, [tiltX, tiltY]);
  const handleClick = (0, import_react3.useCallback)(() => {
    if (isDragging) return;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(async () => {
      clickTimerRef.current = null;
      await animate(scope.current, { scale: 1.12, rotate: (Math.random() > 0.5 ? 1 : -1) * 4 }, { duration: 0.07 });
      animate(scope.current, { scale: 1, rotate: 0 }, { type: "spring", stiffness: 500, damping: 22 });
      onClick?.(card);
      playSound("highlight1", { pitch: 0.9 + Math.random() * 0.2, volume: 0.6 });
    }, 180);
  }, [card, onClick, animate, scope, playSound, isDragging]);
  const flip = (0, import_react3.useCallback)(async () => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    playSound("card1", { pitch: 0.9 + Math.random() * 0.2 });
    await animate(scope.current, { scaleX: 0 }, { duration: 0.1, ease: [0.4, 0, 1, 1] });
    setFacing((f) => f === "front" ? "back" : "front");
    await animate(scope.current, { scaleX: 1 }, { duration: 0.1, ease: [0, 0, 0.6, 1] });
  }, [animate, scope, playSound]);
  const handleDragEnd = (0, import_react3.useCallback)(
    (_, info) => {
      setIsDragging(false);
      setDragOffsetX(0);
      onDragEnd?.(card, info);
    },
    [card, onDragEnd]
  );
  const editionClass = card.edition ? `bc-${card.edition}` : "";
  const enhancementClass = card.enhancement ? `bc-${card.enhancement}` : "";
  const faceStyle = hasSprite(card.rank, card.suit) ? getCardFaceStyle(card.rank, card.suit) : {};
  const dragRotate = isDragging ? Math.max(-18, Math.min(18, dragOffsetX * 0.05)) : 0;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    import_framer_motion.motion.div,
    {
      ref: scope,
      layout: true,
      layoutId,
      className: [
        "bc-card",
        selected ? "bc-selected" : "",
        isHovered ? "bc-hovered" : "",
        card.debuffed ? "bc-debuffed" : "",
        editionClass
      ].join(" "),
      style: {
        ...style,
        transformPerspective: 600,
        rotateX: tiltX,
        rotateY: tiltY
      },
      animate: {
        y: isHovered && !isDragging ? [selected ? -25 : -14, selected ? -30 : -19] : ambient && !isHovered ? [-6, -14] : selected ? -25 : 0,
        scale: selected ? 1.15 : isHovered && !isDragging ? 1.1 : 1,
        rotate: dragRotate
      },
      transition: {
        y: isHovered && !isDragging ? { duration: 0.9, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" } : ambient && !isHovered ? { duration: 2.2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" } : hoverSpring,
        scale: isHovered ? hoverSpring : cardSpring,
        rotate: { type: "spring", stiffness: 300, damping: 25 }
      },
      drag: draggable,
      dragSnapToOrigin: !onDragEnd,
      dragElastic: 0.12,
      dragMomentum: false,
      onDragStart: () => {
        setIsDragging(true);
        resetTilt();
        playSound("cardSlide1", { pitch: 0.95 + Math.random() * 0.1, volume: 0.4 });
      },
      onDrag: (_, info) => setDragOffsetX(info.offset.x),
      onDragEnd: handleDragEnd,
      onHoverStart: () => {
        setIsHovered(true);
        onHover?.(card, true);
        if (ambient) {
          if (ambientTimerRef.current) clearTimeout(ambientTimerRef.current);
          ambientActiveRef.current = false;
        }
        animate(scope.current, { rotate: [0, 5, -3, 0] }, { duration: 0.22 });
        playSound("highlight1", { pitch: 1 + Math.random() * 0.1, volume: 0.22 });
      },
      onHoverEnd: () => {
        setIsHovered(false);
        onHover?.(card, false);
        resetTilt();
        if (ambient) {
          ambientTimerRef.current = setTimeout(() => {
            orbitStartRef.current = performance.now();
            ambientActiveRef.current = true;
          }, 400);
        }
      },
      onMouseMove: handleMouseMove,
      onClick: handleClick,
      onDoubleClick: flip,
      "data-card-id": card.id,
      "data-facing": facing,
      role: "button",
      "aria-pressed": selected,
      "aria-label": `${card.rank} of ${card.suit}`,
      children: [
        facing === "back" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CardBack, { customSrc: card.back }) : card.image ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("img", { src: card.image, alt: `${card.rank} of ${card.suit}`, className: "bc-customFace" }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: ["bc-face", editionClass].join(" "),
            style: faceStyle,
            children: card.enhancement && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: `bc-enhancement ${enhancementClass}` })
          }
        ),
        card.seal && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: "bc-seal",
            style: getSealStyle(card.seal),
            "aria-label": `${card.seal} seal`
          }
        )
      ]
    }
  );
}
var ENH_COLS2 = 7;
var ENH_ROWS2 = 5;
var SEAL_COLS = { gold: 0, red: 1, blue: 2, purple: 3 };
function getSealStyle(seal) {
  const col = SEAL_COLS[seal] ?? 0;
  return {
    backgroundImage: "url(/textures/1x/Enhancers.png)",
    backgroundSize: `${ENH_COLS2 * 100}% ${ENH_ROWS2 * 100}%`,
    backgroundPosition: `${col / (ENH_COLS2 - 1) * 100}% ${4 / (ENH_ROWS2 - 1) * 100}%`,
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
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: `bc-area bc-fan ${className}`, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_framer_motion2.AnimatePresence, { children: cards.map((card, i) => {
      const pos = positions2[i];
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        import_framer_motion2.motion.div,
        {
          className: "bc-cardWrapper",
          style: { zIndex: pos.zIndex },
          animate: { x: pos.x, y: pos.y, rotate: pos.rotate, opacity: 1, scale: 1 },
          initial: { x: pos.x, y: pos.y + 40, rotate: pos.rotate, opacity: 0, scale: 0.5 },
          exit: { opacity: [1, 1, 0], scale: [1.2, 0.05], y: [pos.y - 8, pos.y - 80], transition: { duration: 0.32, times: [0, 0.15, 1], ease: "easeIn" } },
          transition: { type: "spring", stiffness: 320, damping: 28 },
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
        className: `bc-area bc-pile ${className}`,
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: `bc-area bc-row ${className}`, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_framer_motion2.AnimatePresence, { children: cards.map((card, i) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_framer_motion2.motion.div,
    {
      className: "bc-rowWrapper",
      animate: { marginLeft: positions[i].x, opacity: 1, scale: 1, y: 0 },
      initial: { opacity: 0, scale: 0.5, y: 40 },
      exit: { opacity: 0, scale: 0.3, y: -60, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } },
      transition: { type: "spring", stiffness: 320, damping: 28 },
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
  )) }) });
}

// src/hooks/useDeck.ts
var import_react4 = require("react");

// src/core/store.ts
var import_zustand = require("zustand");

// src/core/deck.ts
function uid() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
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
        id: `${rank}-${suit}-${uid()}`,
        rank,
        suit,
        facing: "back"
      });
    }
  }
  if (config.jokers) {
    cards.push({ id: `joker-1-${uid()}`, rank: "Joker", suit: "none", facing: "back" });
    cards.push({ id: `joker-2-${uid()}`, rank: "Joker", suit: "none", facing: "back" });
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