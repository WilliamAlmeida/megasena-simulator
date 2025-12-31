'use client';

import { useState } from 'react';
import { NumberSelector } from './NumberSelector';
import { RandomMode } from '@/types';
import { generateRandomNumbers, validateNumbers, NUMBERS_PER_GAME } from '@/lib/megasena';
import styles from './GameForm.module.css';

interface GameFormProps {
    existingGames: { numbers: number[] }[];
    onAddGame: (playerName: string, numbers: number[]) => void;
    onAddRandomGames: (playerName: string, count: number, mode: RandomMode, avoidCount: number) => void;
}

export function GameForm({ existingGames, onAddGame, onAddRandomGames }: GameFormProps) {
    const [playerName, setPlayerName] = useState('');
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [isRandomMode, setIsRandomMode] = useState(false);
    const [randomCount, setRandomCount] = useState(1);
    const [randomMode, setRandomMode] = useState<RandomMode>('free');
    const [avoidCount, setAvoidCount] = useState(10);
    const [error, setError] = useState('');

    const handleSubmitManual = () => {
        if (!playerName.trim()) {
            setError('Informe o nome do jogador');
            return;
        }

        const validation = validateNumbers(selectedNumbers);
        if (!validation.valid) {
            setError(validation.error || 'Números inválidos');
            return;
        }

        onAddGame(playerName.trim(), selectedNumbers);
        setSelectedNumbers([]);
        setError('');
    };

    const handleSubmitRandom = () => {
        if (!playerName.trim()) {
            setError('Informe o nome do jogador');
            return;
        }

        if (randomCount < 1 || randomCount > 50) {
            setError('Quantidade deve ser entre 1 e 50');
            return;
        }

        onAddRandomGames(playerName.trim(), randomCount, randomMode, avoidCount);
        setError('');
    };

    const generatePreview = () => {
        return generateRandomNumbers(randomMode, existingGames as any, avoidCount);
    };

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${!isRandomMode ? styles.active : ''}`}
                    onClick={() => setIsRandomMode(false)}
                >
                    Manual
                </button>
                <button
                    className={`${styles.tab} ${isRandomMode ? styles.active : ''}`}
                    onClick={() => setIsRandomMode(true)}
                >
                    Aleatório
                </button>
            </div>

            <div className={styles.form}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Nome do Jogador</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Digite o nome..."
                    />
                </div>

                {!isRandomMode ? (
                    <>
                        <div className={styles.selectorWrapper}>
                            <label className={styles.label}>Escolha {NUMBERS_PER_GAME} números</label>
                            <NumberSelector
                                selectedNumbers={selectedNumbers}
                                onChange={setSelectedNumbers}
                            />
                        </div>

                        <button
                            className={styles.submitBtn}
                            onClick={handleSubmitManual}
                            disabled={selectedNumbers.length !== NUMBERS_PER_GAME}
                        >
                            Registrar Jogo
                        </button>
                    </>
                ) : (
                    <>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Quantidade de Jogos</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={randomCount}
                                onChange={(e) => setRandomCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                                min={1}
                                max={50}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Modo de Geração</label>
                            <select
                                className={styles.select}
                                value={randomMode}
                                onChange={(e) => setRandomMode(e.target.value as RandomMode)}
                            >
                                <option value="free">Livre (pode repetir números)</option>
                                <option value="avoid-some">Evitar os mais usados</option>
                                <option value="avoid-all">Evitar todos os números usados</option>
                            </select>
                        </div>

                        {randomMode === 'avoid-some' && (
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Quantos números evitar?</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={avoidCount}
                                    onChange={(e) => setAvoidCount(Math.max(1, Math.min(54, parseInt(e.target.value) || 1)))}
                                    min={1}
                                    max={54}
                                />
                                <span className={styles.hint}>
                                    Evitar os {avoidCount} números mais frequentes nos jogos anteriores
                                </span>
                            </div>
                        )}

                        {randomMode === 'avoid-all' && existingGames.length > 0 && (
                            <div className={styles.warning}>
                                ⚠️ {new Set(existingGames.flatMap(g => g.numbers)).size} números já foram usados.
                                Se não houver 6 números disponíveis, o modo livre será usado.
                            </div>
                        )}

                        <button
                            className={styles.submitBtn}
                            onClick={handleSubmitRandom}
                        >
                            Gerar {randomCount} Jogo{randomCount > 1 ? 's' : ''} Aleatório{randomCount > 1 ? 's' : ''}
                        </button>
                    </>
                )}

                {error && <div className={styles.error}>{error}</div>}
            </div>
        </div>
    );
}
