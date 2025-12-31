'use client';

import { Game } from '@/types';
import styles from './GameCard.module.css';

interface GameCardProps {
    game: Game;
    drawNumbers?: number[];
    onRemove?: (id: string) => void;
}

export function GameCard({ game, drawNumbers, onRemove }: GameCardProps) {
    const getNumberClass = (num: number) => {
        if (!drawNumbers) return styles.number;
        return drawNumbers.includes(num)
            ? `${styles.number} ${styles.matched}`
            : styles.number;
    };

    const matchCount = drawNumbers
        ? game.numbers.filter(n => drawNumbers.includes(n)).length
        : 0;

    const getPrizeLabel = () => {
        if (!drawNumbers) return null;
        if (matchCount === 6) return { text: 'SENA!', class: styles.sena };
        if (matchCount === 5) return { text: 'QUINA!', class: styles.quina };
        if (matchCount === 4) return { text: 'QUADRA!', class: styles.quadra };
        return null;
    };

    const prize = getPrizeLabel();

    return (
        <div className={`${styles.card} ${prize ? styles.winner : ''}`}>
            <div className={styles.header}>
                <span className={styles.playerName}>{game.playerName}</span>
                {onRemove && (
                    <button
                        className={styles.removeBtn}
                        onClick={() => onRemove(game.id)}
                        aria-label="Remover jogo"
                    >
                        ×
                    </button>
                )}
            </div>

            <div className={styles.numbers}>
                {game.numbers.map((num, idx) => (
                    <span key={idx} className={getNumberClass(num)}>
                        {num.toString().padStart(2, '0')}
                    </span>
                ))}
            </div>

            {drawNumbers && (
                <div className={styles.footer}>
                    <span className={styles.matchCount}>
                        {matchCount} acertos
                    </span>
                    {prize && (
                        <span className={`${styles.prize} ${prize.class}`}>
                            {prize.text}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
