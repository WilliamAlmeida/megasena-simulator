// Types for Mega Sena Simulator

export interface Game {
    id: string;
    playerName: string;
    numbers: number[];
    createdAt: string;
    matches?: number; // Number of matches with last draw
}

export interface DrawResult {
    id: string;
    numbers: number[];
    drawnAt: string;
    searchStats?: {
        attempts: number;
        timeMs: number;
        allAttempts: number[][];
    };
}

export interface Winner {
    game: Game;
    matches: number;
    prize: 'quadra' | 'quina' | 'sena';
}

export type RandomMode =
    | 'free'           // Can repeat any number
    | 'avoid-some'     // Avoid X numbers from previous games
    | 'avoid-all';     // Avoid all numbers from previous games

export type DrawMode =
    | 'random'         // Completely random
    | 'from-games'     // Random from registered numbers
    | 'until-winner';  // Keep drawing until finding a winner

export interface MegaSenaState {
    games: Game[];
    lastDraw: DrawResult | null;
    winners: Winner[];
}
