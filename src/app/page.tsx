'use client';

import { useState } from 'react';
import { useMegaSena } from '@/hooks/useMegaSena';
import { PlayerGroup } from '@/components/PlayerGroup';
import { GameForm } from '@/components/GameForm';
import { DrawPanel } from '@/components/DrawPanel';
import { WinnersModal } from '@/components/WinnersModal';
import { DrawMode, RandomMode } from '@/types';
import styles from './page.module.css';

export default function Home() {
  const {
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
  } = useMegaSena();

  const [showWinners, setShowWinners] = useState(false);
  const [activeTab, setActiveTab] = useState<'games' | 'add' | 'draw'>('games');

  const handlePerformDraw = (mode: DrawMode) => {
    performDraw(mode);
    setShowWinners(true);
  };

  const handleManualDraw = (numbers: number[]) => {
    setManualDraw(numbers);
    setShowWinners(true);
  };

  const handleAddGame = (playerName: string, numbers: number[]) => {
    addGame(playerName, numbers);
    setActiveTab('games');
  };

  const handleAddRandomGames = (playerName: string, count: number, mode: RandomMode, avoidCount: number) => {
    addRandomGames(playerName, count, mode, avoidCount);
    setActiveTab('games');
  };

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🍀</span>
          <h1 className={styles.title}>Mega Sena Simulator</h1>
        </div>
        <p className={styles.subtitle}>Registre seus jogos e teste sua sorte!</p>
      </header>

      {/* Last Draw Result */}
      {lastDraw && (
        <section className={styles.lastDraw}>
          <h2 className={styles.sectionTitle}>🎰 Último Resultado</h2>
          <div className={styles.drawResult}>
            <div className={styles.drawNumbers}>
              {lastDraw.numbers.map((num, idx) => (
                <span key={idx} className={styles.drawNumber}>
                  {num.toString().padStart(2, '0')}
                </span>
              ))}
            </div>
            <div className={styles.drawInfo}>
              <span className={styles.drawDate}>
                {new Date(lastDraw.drawnAt).toLocaleString('pt-BR')}
              </span>
              {winners.length > 0 && (
                <button
                  className={styles.viewWinnersBtn}
                  onClick={() => setShowWinners(true)}
                >
                  Ver {winners.length} Ganhador{winners.length > 1 ? 'es' : ''}
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Navigation Tabs */}
      <nav className={styles.nav}>
        <button
          className={`${styles.navBtn} ${activeTab === 'games' ? styles.active : ''}`}
          onClick={() => setActiveTab('games')}
        >
          <span>📋</span>
          <span>Jogos ({games.length})</span>
        </button>
        <button
          className={`${styles.navBtn} ${activeTab === 'add' ? styles.active : ''}`}
          onClick={() => setActiveTab('add')}
        >
          <span>➕</span>
          <span>Novo Jogo</span>
        </button>
        <button
          className={`${styles.navBtn} ${activeTab === 'draw' ? styles.active : ''}`}
          onClick={() => setActiveTab('draw')}
        >
          <span>🎲</span>
          <span>Sorteio</span>
        </button>
      </nav>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'games' && (
          <section className={styles.gamesSection}>
            {games.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>🎯</span>
                <h3>Nenhum jogo registrado</h3>
                <p>Clique em "Novo Jogo" para começar!</p>
              </div>
            ) : (
              <>
                <div className={styles.gamesHeader}>
                  <span className={styles.gamesCount}>{games.length} jogo{games.length > 1 ? 's' : ''} registrado{games.length > 1 ? 's' : ''}</span>
                  <button
                    className={styles.clearAllBtn}
                    onClick={() => {
                      if (confirm('Tem certeza que deseja apagar todos os jogos?')) {
                        clearGames();
                      }
                    }}
                  >
                    Limpar Tudo
                  </button>
                </div>
                <div className={styles.playersList}>
                  {gamesByPlayer.map(group => (
                    <PlayerGroup
                      key={group.playerName}
                      playerName={group.playerName}
                      games={group.games}
                      drawNumbers={lastDraw?.numbers}
                      onRemoveGame={removeGame}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {activeTab === 'add' && (
          <section className={styles.addSection}>
            <GameForm
              existingGames={games}
              onAddGame={handleAddGame}
              onAddRandomGames={handleAddRandomGames}
            />
          </section>
        )}

        {activeTab === 'draw' && (
          <section className={styles.drawSection}>
            <DrawPanel
              onPerformDraw={handlePerformDraw}
              onManualDraw={handleManualDraw}
              hasGames={games.length > 0}
            />
          </section>
        )}
      </div>

      {/* Winners Modal */}
      {showWinners && lastDraw && (
        <WinnersModal
          winners={winners}
          drawNumbers={lastDraw.numbers}
          searchStats={lastDraw.searchStats}
          onClose={() => setShowWinners(false)}
        />
      )}
    </main>
  );
}
