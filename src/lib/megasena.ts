// Mega Sena utility functions

import { Game, Winner, RandomMode, DrawMode } from '@/types';

// Mega Sena constants
export const MIN_NUMBER = 1;
export const MAX_NUMBER = 60;
export const NUMBERS_PER_GAME = 6;
export const NUMBERS_PER_DRAW = 6;

// Generate a unique ID
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generate random numbers for a game
export function generateRandomNumbers(
    mode: RandomMode = 'free',
    existingGames: Game[] = [],
    avoidCount: number = 0
): number[] {
    const numbers: Set<number> = new Set();

    // Collect numbers to avoid based on mode
    let numbersToAvoid: Set<number> = new Set();

    if (mode === 'avoid-all') {
        // Avoid ALL numbers from previous games
        existingGames.forEach(game => {
            game.numbers.forEach(n => numbersToAvoid.add(n));
        });
    } else if (mode === 'avoid-some' && avoidCount > 0) {
        // Avoid the most recent X numbers from previous games
        const allNumbers: number[] = [];
        existingGames.forEach(game => {
            game.numbers.forEach(n => {
                if (!allNumbers.includes(n)) {
                    allNumbers.push(n);
                }
            });
        });
        // Take the first avoidCount numbers (most used)
        const frequencyMap = new Map<number, number>();
        existingGames.forEach(game => {
            game.numbers.forEach(n => {
                frequencyMap.set(n, (frequencyMap.get(n) || 0) + 1);
            });
        });
        const sortedByFrequency = Array.from(frequencyMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, avoidCount)
            .map(([num]) => num);
        sortedByFrequency.forEach(n => numbersToAvoid.add(n));
    }

    // Available numbers pool
    const availableNumbers: number[] = [];
    for (let i = MIN_NUMBER; i <= MAX_NUMBER; i++) {
        if (!numbersToAvoid.has(i)) {
            availableNumbers.push(i);
        }
    }

    // Check if we have enough numbers
    if (availableNumbers.length < NUMBERS_PER_GAME) {
        // Not enough numbers available, fall back to free mode
        for (let i = MIN_NUMBER; i <= MAX_NUMBER; i++) {
            availableNumbers.push(i);
        }
        numbersToAvoid.clear();
    }

    // Pick random numbers
    while (numbers.size < NUMBERS_PER_GAME) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const num = availableNumbers[randomIndex];
        if (!numbers.has(num)) {
            numbers.add(num);
        }
    }

    return Array.from(numbers).sort((a, b) => a - b);
}

// Generate draw result
export function generateDrawNumbers(
    mode: DrawMode = 'random',
    games: Game[] = []
): number[] {
    if (mode === 'from-games' && games.length > 0) {
        // Collect all unique numbers from games
        const allNumbers: Set<number> = new Set();
        games.forEach(game => {
            game.numbers.forEach(n => allNumbers.add(n));
        });

        const availableNumbers = Array.from(allNumbers);

        // If not enough numbers, mix with random
        if (availableNumbers.length < NUMBERS_PER_DRAW) {
            for (let i = MIN_NUMBER; i <= MAX_NUMBER; i++) {
                if (!allNumbers.has(i)) {
                    availableNumbers.push(i);
                }
            }
        }

        // Pick random from available
        const result: Set<number> = new Set();
        while (result.size < NUMBERS_PER_DRAW) {
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            result.add(availableNumbers[randomIndex]);
        }

        return Array.from(result).sort((a, b) => a - b);
    }

    // Completely random
    const numbers: Set<number> = new Set();
    while (numbers.size < NUMBERS_PER_DRAW) {
        const num = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
        numbers.add(num);
    }

    return Array.from(numbers).sort((a, b) => a - b);
}

// Draw until finding a winner
export function drawUntilWinner(games: Game[]): {
    numbers: number[];
    attempts: number;
    timeMs: number;
    allAttempts: number[][];
} {
    const startTime = performance.now();
    const allAttempts: number[][] = [];
    let attempts = 0;
    const MAX_ATTEMPTS = 100000; // Safety limit

    while (attempts < MAX_ATTEMPTS) {
        attempts++;
        const numbers = generateDrawNumbers('random', games);
        allAttempts.push(numbers);

        // Check if we have any winners
        const winners = findWinners(games, numbers);
        if (winners.length > 0) {
            const endTime = performance.now();
            return {
                numbers,
                attempts,
                timeMs: Math.round(endTime - startTime),
                allAttempts
            };
        }
    }

    // If we hit max attempts, return the last draw anyway
    const endTime = performance.now();
    return {
        numbers: allAttempts[allAttempts.length - 1],
        attempts,
        timeMs: Math.round(endTime - startTime),
        allAttempts
    };
}

// Check matches between game and draw
export function checkMatches(gameNumbers: number[], drawNumbers: number[]): number {
    return gameNumbers.filter(n => drawNumbers.includes(n)).length;
}

// Determine prize based on matches
export function getPrize(matches: number): 'quadra' | 'quina' | 'sena' | null {
    switch (matches) {
        case 6: return 'sena';
        case 5: return 'quina';
        case 4: return 'quadra';
        default: return null;
    }
}

// Find all winners from games
export function findWinners(games: Game[], drawNumbers: number[]): Winner[] {
    const winners: Winner[] = [];

    games.forEach(game => {
        const matches = checkMatches(game.numbers, drawNumbers);
        const prize = getPrize(matches);

        if (prize) {
            winners.push({
                game: { ...game, matches },
                matches,
                prize
            });
        }
    });

    // Sort by matches (highest first)
    return winners.sort((a, b) => b.matches - a.matches);
}

// Validate game numbers
export function validateNumbers(numbers: number[]): { valid: boolean; error?: string } {
    if (numbers.length !== NUMBERS_PER_GAME) {
        return { valid: false, error: `Selecione exatamente ${NUMBERS_PER_GAME} números` };
    }

    const unique = new Set(numbers);
    if (unique.size !== numbers.length) {
        return { valid: false, error: 'Números não podem se repetir' };
    }

    for (const num of numbers) {
        if (num < MIN_NUMBER || num > MAX_NUMBER) {
            return { valid: false, error: `Números devem estar entre ${MIN_NUMBER} e ${MAX_NUMBER}` };
        }
    }

    return { valid: true };
}

// Format prize name in Portuguese
export function formatPrize(prize: 'quadra' | 'quina' | 'sena'): string {
    const names = {
        quadra: 'Quadra (4 acertos)',
        quina: 'Quina (5 acertos)',
        sena: 'SENA! (6 acertos)'
    };
    return names[prize];
}
