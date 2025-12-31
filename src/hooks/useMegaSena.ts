'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Game, DrawResult, Winner, RandomMode, DrawMode } from '@/types';
import {
    generateId,
    generateRandomNumbers,
    generateDrawNumbers,
    drawUntilWinner,
    findWinners,
    checkMatches
} from '@/lib/megasena';

const GAMES_KEY = 'megasena_games';
const DRAW_KEY = 'megasena_last_draw';

export function useMegaSena() {
    const [games, setGames] = useLocalStorage<Game[]>(GAMES_KEY, []);
    const [lastDraw, setLastDraw] = useLocalStorage<DrawResult | null>(DRAW_KEY, null);

    // Add a new game
    const addGame = useCallback((playerName: string, numbers: number[]) => {
        const newGame: Game = {
            id: generateId(),
            playerName,
            numbers: [...numbers].sort((a, b) => a - b),
            createdAt: new Date().toISOString()
        };
        setGames(prev => [...prev, newGame]);
        return newGame;
    }, [setGames]);

    // Add multiple random games
    const addRandomGames = useCallback((
        playerName: string,
        count: number,
        mode: RandomMode = 'free',
        avoidCount: number = 0
    ) => {
        const newGames: Game[] = [];
        let currentGames = [...games];

        for (let i = 0; i < count; i++) {
            const numbers = generateRandomNumbers(mode, [...currentGames, ...newGames], avoidCount);
            const newGame: Game = {
                id: generateId(),
                playerName,
                numbers,
                createdAt: new Date().toISOString()
            };
            newGames.push(newGame);
        }

        setGames(prev => [...prev, ...newGames]);
        return newGames;
    }, [games, setGames]);

    // Remove a game
    const removeGame = useCallback((gameId: string) => {
        setGames(prev => prev.filter(g => g.id !== gameId));
    }, [setGames]);

    // Clear all games
    const clearGames = useCallback(() => {
        setGames([]);
    }, [setGames]);

    // Perform a draw
    const performDraw = useCallback((mode: DrawMode = 'random') => {
        if (mode === 'until-winner') {
            const result = drawUntilWinner(games);
            const draw: DrawResult = {
                id: generateId(),
                numbers: result.numbers,
                drawnAt: new Date().toISOString(),
                searchStats: {
                    attempts: result.attempts,
                    timeMs: result.timeMs,
                    allAttempts: result.allAttempts
                }
            };
            setLastDraw(draw);
            return draw;
        }

        const numbers = generateDrawNumbers(mode, games);
        const draw: DrawResult = {
            id: generateId(),
            numbers,
            drawnAt: new Date().toISOString()
        };
        setLastDraw(draw);
        return draw;
    }, [games, setLastDraw]);

    // Set manual draw numbers
    const setManualDraw = useCallback((numbers: number[]) => {
        const draw: DrawResult = {
            id: generateId(),
            numbers: [...numbers].sort((a, b) => a - b),
            drawnAt: new Date().toISOString()
        };
        setLastDraw(draw);
        return draw;
    }, [setLastDraw]);

    // Get winners from last draw
    const winners = useMemo((): Winner[] => {
        if (!lastDraw) return [];
        return findWinners(games, lastDraw.numbers);
    }, [games, lastDraw]);

    // Get games with match info
    const gamesWithMatches = useMemo(() => {
        if (!lastDraw) return games;
        return games.map(game => ({
            ...game,
            matches: checkMatches(game.numbers, lastDraw.numbers)
        }));
    }, [games, lastDraw]);

    // Group games by player
    const gamesByPlayer = useMemo(() => {
        const grouped = new Map<string, Game[]>();
        gamesWithMatches.forEach(game => {
            const playerGames = grouped.get(game.playerName) || [];
            playerGames.push(game);
            grouped.set(game.playerName, playerGames);
        });
        return Array.from(grouped.entries()).map(([playerName, games]) => ({
            playerName,
            games
        }));
    }, [gamesWithMatches]);

    return {
        games,
        gamesWithMatches,
        gamesByPlayer,
        lastDraw,
        winners,
        addGame,
        addRandomGames,
        removeGame,
        clearGames,
        performDraw,
        setManualDraw
    };
}
