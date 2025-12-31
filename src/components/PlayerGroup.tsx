'use client';

import { useState } from 'react';
import { Game } from '@/types';
import { GameCard } from './GameCard';
import styles from './PlayerGroup.module.css';

interface PlayerGroupProps {
    playerName: string;
    games: Game[];
    drawNumbers?: number[];
    onRemoveGame: (id: string) => void;
}

export function PlayerGroup({ playerName, games, drawNumbers, onRemoveGame }: PlayerGroupProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`${styles.playerGroup} ${isExpanded ? styles.expanded : ''}`}>
            <div className={styles.header} onClick={toggleExpand}>
                <div className={styles.info}>
                    <span className={styles.playerName}>{playerName || 'Sem Nome'}</span>
                    <span className={styles.gameCount}>
                        {games.length} jogo{games.length > 1 ? 's' : ''}
                    </span>
                </div>
                <span className={styles.toggleIcon}>
                    {isExpanded ? '🔼' : '🔽'}
                </span>
            </div>

            {isExpanded && (
                <div className={styles.gamesGrid}>
                    {games.map(game => (
                        <GameCard
                            key={game.id}
                            game={game}
                            drawNumbers={drawNumbers}
                            onRemove={onRemoveGame}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
