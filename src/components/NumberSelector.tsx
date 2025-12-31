'use client';

import { useState } from 'react';
import { MIN_NUMBER, MAX_NUMBER, NUMBERS_PER_GAME } from '@/lib/megasena';
import styles from './NumberSelector.module.css';

interface NumberSelectorProps {
    selectedNumbers: number[];
    onChange: (numbers: number[]) => void;
    maxSelectable?: number;
}

export function NumberSelector({
    selectedNumbers,
    onChange,
    maxSelectable = NUMBERS_PER_GAME
}: NumberSelectorProps) {
    const allNumbers = Array.from(
        { length: MAX_NUMBER - MIN_NUMBER + 1 },
        (_, i) => i + MIN_NUMBER
    );

    const toggleNumber = (num: number) => {
        if (selectedNumbers.includes(num)) {
            onChange(selectedNumbers.filter(n => n !== num));
        } else if (selectedNumbers.length < maxSelectable) {
            onChange([...selectedNumbers, num].sort((a, b) => a - b));
        }
    };

    const clearAll = () => {
        onChange([]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.counter}>
                    Selecionados: <strong>{selectedNumbers.length}</strong> / {maxSelectable}
                </span>
                {selectedNumbers.length > 0 && (
                    <button className={styles.clearBtn} onClick={clearAll}>
                        Limpar
                    </button>
                )}
            </div>

            <div className={styles.grid}>
                {allNumbers.map(num => (
                    <button
                        key={num}
                        className={`${styles.number} ${selectedNumbers.includes(num) ? styles.selected : ''}`}
                        onClick={() => toggleNumber(num)}
                        disabled={!selectedNumbers.includes(num) && selectedNumbers.length >= maxSelectable}
                    >
                        {num.toString().padStart(2, '0')}
                    </button>
                ))}
            </div>

            {selectedNumbers.length > 0 && (
                <div className={styles.preview}>
                    <span className={styles.previewLabel}>Números escolhidos:</span>
                    <div className={styles.previewNumbers}>
                        {selectedNumbers.map(num => (
                            <span key={num} className={styles.previewNumber}>
                                {num.toString().padStart(2, '0')}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
