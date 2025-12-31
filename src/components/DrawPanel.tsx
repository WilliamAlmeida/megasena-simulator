'use client';

import { useState } from 'react';
import { DrawMode } from '@/types';
import { NumberSelector } from './NumberSelector';
import { NUMBERS_PER_DRAW, validateNumbers } from '@/lib/megasena';
import styles from './DrawPanel.module.css';

interface DrawPanelProps {
    onPerformDraw: (mode: DrawMode) => void;
    onManualDraw: (numbers: number[]) => void;
    hasGames: boolean;
    isDrawing?: boolean;
    currentAttempts?: number;
}

export function DrawPanel({ onPerformDraw, onManualDraw, hasGames, isDrawing, currentAttempts }: DrawPanelProps) {
    const [isManual, setIsManual] = useState(false);
    const [manualNumbers, setManualNumbers] = useState<number[]>([]);
    const [error, setError] = useState('');

    const handleRandomDraw = (mode: DrawMode) => {
        onPerformDraw(mode);
    };

    const handleManualDraw = () => {
        const validation = validateNumbers(manualNumbers);
        if (!validation.valid) {
            setError(validation.error || 'Números inválidos');
            return;
        }
        onManualDraw(manualNumbers);
        setManualNumbers([]);
        setError('');
        setIsManual(false);
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>🎰 Realizar Sorteio</h3>

            {isDrawing && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>Realizando Sorteio...</p>
                    {currentAttempts !== undefined && currentAttempts > 0 && (
                        <p className={styles.attemptsCount}>
                            Tentativas: {currentAttempts.toLocaleString('pt-BR')}
                        </p>
                    )}
                </div>
            )}

            {!isManual ? (
                <div className={styles.buttonGroup}>
                    <button
                        className={`${styles.drawBtn} ${styles.random}`}
                        onClick={() => handleRandomDraw('random')}
                        disabled={isDrawing}
                    >
                        <span className={styles.btnIcon}>🎲</span>
                        <span className={styles.btnText}>Sorteio Aleatório</span>
                        <span className={styles.btnDesc}>Números totalmente aleatórios</span>
                    </button>

                    <button
                        className={`${styles.drawBtn} ${styles.fromGames}`}
                        onClick={() => handleRandomDraw('from-games')}
                        disabled={!hasGames || isDrawing}
                    >
                        <span className={styles.btnIcon}>📋</span>
                        <span className={styles.btnText}>Aleatório dos Jogos</span>
                        <span className={styles.btnDesc}>Apenas números registrados</span>
                    </button>

                    <button
                        className={`${styles.drawBtn} ${styles.untilWinner}`}
                        onClick={() => handleRandomDraw('until-winner')}
                        disabled={!hasGames || isDrawing}
                    >
                        <span className={styles.btnIcon}>🔍</span>
                        <span className={styles.btnText}>Buscar Ganhador</span>
                        <span className={styles.btnDesc}>Sortear até encontrar vencedor</span>
                    </button>

                    <button
                        className={`${styles.drawBtn} ${styles.manual}`}
                        onClick={() => setIsManual(true)}
                        disabled={isDrawing}
                    >
                        <span className={styles.btnIcon}>✏️</span>
                        <span className={styles.btnText}>Resultado Manual</span>
                        <span className={styles.btnDesc}>Inserir números do sorteio oficial</span>
                    </button>
                </div>
            ) : (
                <div className={styles.manualSection}>
                    <p className={styles.manualHint}>
                        Selecione os {NUMBERS_PER_DRAW} números do resultado oficial:
                    </p>

                    <NumberSelector
                        selectedNumbers={manualNumbers}
                        onChange={setManualNumbers}
                        maxSelectable={NUMBERS_PER_DRAW}
                    />

                    <div className={styles.manualActions}>
                        <button
                            className={styles.cancelBtn}
                            onClick={() => {
                                setIsManual(false);
                                setManualNumbers([]);
                                setError('');
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            className={styles.confirmBtn}
                            onClick={handleManualDraw}
                            disabled={manualNumbers.length !== NUMBERS_PER_DRAW}
                        >
                            Confirmar Resultado
                        </button>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}
                </div>
            )}
        </div>
    );
}
