import { useState, useEffect, memo } from 'react';
import { GameProps } from '../../interfaces/GameProps.interface';
import styles from '../../styles/SurpriseStep.module.css';

const CONFETTI_COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

const SurpriseStep = memo(({ step, onComplete }: GameProps) => {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; color: string }>>([]);

  useEffect(() => {
    const confettiArray = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    }));
    setConfetti(confettiArray);

    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={styles.surpriseContainer}>
      <div className={styles.confettiContainer}>
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className={styles.confetti}
            style={{
              left: `${piece.x}%`,
              backgroundColor: piece.color,
              animationDelay: `${piece.id * 0.1}s`,
            }}
          />
        ))}
      </div>
      <div className={styles.surpriseContent}>
        <h2 className={styles.surpriseTitle}>🎉 Tebrikler Yağmur! 🎉</h2>
        <p className={styles.surpriseText}>{step.content}</p>
        <div className={styles.heartAnimation}>💙</div>
      </div>
    </div>
  );
});

SurpriseStep.displayName = 'SurpriseStep';

export default SurpriseStep;

