import * as react_jsx_runtime from 'react/jsx-runtime';
import { AnimationControls } from 'framer-motion';

type Edition = 'foil' | 'holo' | 'polychrome' | 'negative';
type Enhancement = 'bonus' | 'mult' | 'wild' | 'glass' | 'steel' | 'stone' | 'gold' | 'lucky';
type Seal = 'gold' | 'red' | 'blue' | 'purple';
type Facing = 'front' | 'back';
type LayoutType = 'fan' | 'pile' | 'row';
type SortBy = 'rank' | 'suit';
interface BalatroCard {
    id: string;
    rank: string;
    suit: string;
    facing: Facing;
    image?: string;
    back?: string;
    edition?: Edition;
    enhancement?: Enhancement;
    seal?: Seal;
    debuffed?: boolean;
}
interface DeckConfig {
    ranks?: string[];
    suits?: string[];
    cards?: BalatroCard[];
    jokers?: boolean;
}
interface CardTransform {
    x: number;
    y: number;
    rotate: number;
    scale: number;
    zIndex: number;
}

interface BalatroDeckProps {
    config?: DeckConfig;
    sounds?: boolean;
    children: React.ReactNode;
    className?: string;
}
declare function BalatroDeck({ sounds, children, className, }: BalatroDeckProps): react_jsx_runtime.JSX.Element;

interface CardProps {
    card: BalatroCard;
    selected?: boolean;
    draggable?: boolean;
    layoutId?: string;
    style?: React.CSSProperties;
    ambient?: boolean;
    onHover?: (card: BalatroCard, hovering: boolean) => void;
    onClick?: (card: BalatroCard) => void;
    onDragEnd?: (card: BalatroCard, info: {
        point: {
            x: number;
            y: number;
        };
    }) => void;
}
declare function Card({ card, selected, draggable, layoutId, style, ambient, onHover, onClick, onDragEnd, }: CardProps): react_jsx_runtime.JSX.Element;

interface CardAreaProps {
    cards: BalatroCard[];
    layout?: LayoutType;
    type?: string;
    selected?: BalatroCard[];
    draggable?: boolean;
    maxAngle?: number;
    onSelect?: (card: BalatroCard) => void;
    onDraw?: () => void;
    onCardDragEnd?: (card: BalatroCard, info: {
        point: {
            x: number;
            y: number;
        };
    }) => void;
    className?: string;
}
declare function CardArea({ cards, layout, type, selected, draggable, maxAngle, onSelect, onDraw, onCardDragEnd, className, }: CardAreaProps): react_jsx_runtime.JSX.Element;

interface CardBackProps {
    customSrc?: string;
    className?: string;
}
declare function CardBack({ customSrc, className }: CardBackProps): react_jsx_runtime.JSX.Element;

declare function useDeck(config?: DeckConfig): {
    deck: BalatroCard[];
    hand: BalatroCard[];
    discard: BalatroCard[];
    selected: BalatroCard[];
    config: DeckConfig;
    shuffle: () => void;
    draw: (n: number) => void;
    discardCards: (cards?: BalatroCard[]) => void;
    selectCard: (card: BalatroCard) => void;
    sortHand: (by: SortBy) => void;
    setEdition: (card: BalatroCard, edition: Edition | undefined) => void;
    setSeal: (card: BalatroCard, seal: Seal | undefined) => void;
    reset: () => void;
};

interface PlayOptions {
    pitch?: number;
    volume?: number;
}
type SoundName = 'card1' | 'card3' | 'cardFan2' | 'cardSlide1' | 'cardSlide2' | 'chips1' | 'chips2' | 'coin1' | 'coin2' | 'coin3' | 'coin4' | 'coin5' | 'coin6' | 'coin7' | 'crumple1' | 'crumple2' | 'crumple3' | 'crumple4' | 'crumple5' | 'crumpleLong1' | 'crumpleLong2' | 'explosion1' | 'explosion_buildup1' | 'explosion_release1' | 'foil1' | 'foil2' | 'glass1' | 'glass2' | 'glass3' | 'glass4' | 'glass5' | 'glass6' | 'gold_seal' | 'gong' | 'highlight1' | 'highlight2' | 'holo1' | 'magic_crumple' | 'magic_crumple2' | 'magic_crumple3' | 'multhit1' | 'multhit2' | 'music1' | 'music2' | 'music3' | 'music4' | 'music5' | 'negative' | 'other1' | 'paper1' | 'polychrome1' | 'slice1' | 'splash_buildup' | 'tarot1' | 'tarot2' | 'timpani' | 'voice1' | 'voice2' | 'voice3' | 'voice4' | 'voice5' | 'voice6' | 'voice7' | 'voice8' | 'voice9' | 'voice10' | 'voice11' | 'whoosh' | 'whoosh1' | 'whoosh2' | 'whoosh_long' | 'win' | 'button' | 'cancel' | 'generic1' | 'ambientFire1' | 'ambientFire2' | 'ambientFire3' | 'ambientOrgan1' | 'introPad1';
declare function useSound(muted?: boolean): {
    playSound: (name: SoundName, options?: PlayOptions) => Promise<void>;
};

interface FanOptions {
    maxAngle?: number;
    xSpread?: number;
    yParabola?: number;
}
declare function getFanPositions(n: number, options?: FanOptions): CardTransform[];
declare function getPilePosition(): CardTransform;
declare function getRowPositions(n: number, spacing?: number): CardTransform[];

declare function juiceUp(controls: AnimationControls, scale: number, rotation: number): Promise<void>;

declare const cardSpring: {
    type: "spring";
    stiffness: number;
    damping: number;
    mass: number;
};
declare const hoverSpring: {
    type: "spring";
    stiffness: number;
    damping: number;
    mass: number;
};
declare const juiceSpring: {
    type: "spring";
    stiffness: number;
    damping: number;
    mass: number;
};
declare const layoutSpring: {
    type: "spring";
    stiffness: number;
    damping: number;
    mass: number;
};

export { type BalatroCard, BalatroDeck, Card, CardArea, CardBack, type CardTransform, type DeckConfig, type Edition, type Enhancement, type Facing, type LayoutType, type Seal, type SortBy, cardSpring, getFanPositions, getPilePosition, getRowPositions, hoverSpring, juiceSpring, juiceUp, layoutSpring, useDeck, useSound };
