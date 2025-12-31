'use client';

import { useState } from 'react';
import { Winner } from '@/types';
import { formatPrize } from '@/lib/megasena';
import styles from './WinnersModal.module.css';

interface WinnersModalProps {
    winners: Winner[];
    drawNumbers: number[];
    searchStats?: {
        attempts: number;
        timeMs: number;
        allAttempts: number[][];
    };
    onClose: () => void;
}

export function WinnersModal({ winners, drawNumbers, searchStats, onClose }: WinnersModalProps) {
    const senaWinners = winners.filter(w => w.prize === 'sena');
    const quinaWinners = winners.filter(w => w.prize === 'quina');
    const quadraWinners = winners.filter(w => w.prize === 'quadra');
    const [showAllAttempts, setShowAllAttempts] = useState(false);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>

                <div className={styles.header}>
                    <h2 className={styles.title}>🏆 Resultado do Sorteio</h2>
                    <div className={styles.drawNumbers}>
                        {drawNumbers.map((num, idx) => (
                            <span key={idx} className={styles.drawNumber}>
                                {num.toString().padStart(2, '0')}
                            </span>
                        ))}
                    </div>

                    {searchStats && (
                        <div className={styles.searchStats}>
                            <div className={styles.statsGrid}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Tentativas</span>
                                    <span className={styles.statValue}>{searchStats.attempts.toLocaleString('pt-BR')}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Tempo</span>
                                    <span className={styles.statValue}>
                                        {searchStats.timeMs < 1000
                                            ? `${searchStats.timeMs}ms`
                                            : `${(searchStats.timeMs / 1000).toFixed(2)}s`}
                                    </span>
                                </div>
                            </div>
                            <button
                                className={styles.toggleAttemptsBtn}
                                onClick={() => setShowAllAttempts(!showAllAttempts)}
                            >
                                {showAllAttempts ? '▼' : '▶'} Ver todas as tentativas ({searchStats.allAttempts.length})
                            </button>
                            {showAllAttempts && (
                                <div className={styles.allAttempts}>
                                    {searchStats.allAttempts.map((attempt, idx) => (
                                        <div key={idx} className={styles.attemptRow}>
                                            <span className={styles.attemptNum}>#{idx + 1}</span>
                                            <div className={styles.attemptNumbers}>
                                                {attempt.map((num, nidx) => (
                                                    <span key={nidx} className={styles.attemptNumber}>
                                                        {num.toString().padStart(2, '0')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.content}>
                    {winners.length === 0 ? (
                        <div className={styles.noWinners}>
                            <span className={styles.noWinnersIcon}>😢</span>
                            <p>Nenhum ganhador desta vez!</p>
                            <p className={styles.noWinnersHint}>Continue tentando, a sorte pode mudar!</p>
                        </div>
                    ) : (
                        <>
                            {senaWinners.length > 0 && (
                                <div className={styles.prizeSection}>
                                    <h3 className={`${styles.prizeTitle} ${styles.sena}`}>
                                        🎉 SENA - 6 Acertos
                                    </h3>
                                    <div className={styles.winnersList}>
                                        {senaWinners.map((winner, idx) => (
                                            <div key={idx} className={`${styles.winnerCard} ${styles.senaCard}`}>
                                                <span className={styles.winnerName}>{winner.game.playerName}</span>
                                                <div className={styles.winnerNumbers}>
                                                    {winner.game.numbers.map((num, nidx) => (
                                                        <span
                                                            key={nidx}
                                                            className={`${styles.winnerNumber} ${drawNumbers.includes(num) ? styles.matched : ''}`}
                                                        >
                                                            {num.toString().padStart(2, '0')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {quinaWinners.length > 0 && (
                                <div className={styles.prizeSection}>
                                    <h3 className={`${styles.prizeTitle} ${styles.quina}`}>
                                        🎊 QUINA - 5 Acertos
                                    </h3>
                                    <div className={styles.winnersList}>
                                        {quinaWinners.map((winner, idx) => (
                                            <div key={idx} className={`${styles.winnerCard} ${styles.quinaCard}`}>
                                                <span className={styles.winnerName}>{winner.game.playerName}</span>
                                                <div className={styles.winnerNumbers}>
                                                    {winner.game.numbers.map((num, nidx) => (
                                                        <span
                                                            key={nidx}
                                                            className={`${styles.winnerNumber} ${drawNumbers.includes(num) ? styles.matched : ''}`}
                                                        >
                                                            {num.toString().padStart(2, '0')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {quadraWinners.length > 0 && (
                                <div className={styles.prizeSection}>
                                    <h3 className={`${styles.prizeTitle} ${styles.quadra}`}>
                                        🎈 QUADRA - 4 Acertos
                                    </h3>
                                    <div className={styles.winnersList}>
                                        {quadraWinners.map((winner, idx) => (
                                            <div key={idx} className={`${styles.winnerCard} ${styles.quadraCard}`}>
                                                <span className={styles.winnerName}>{winner.game.playerName}</span>
                                                <div className={styles.winnerNumbers}>
                                                    {winner.game.numbers.map((num, nidx) => (
                                                        <span
                                                            key={nidx}
                                                            className={`${styles.winnerNumber} ${drawNumbers.includes(num) ? styles.matched : ''}`}
                                                        >
                                                            {num.toString().padStart(2, '0')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={styles.summary}>
                                <p>Total de ganhadores: <strong>{winners.length}</strong></p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
