import { useState, useCallback, memo } from 'react';
import { GameProps } from '../../interfaces/GameProps.interface';
import styles from '../../styles/GameStep.module.css';

const GameStep = memo(({ step, onComplete }: GameProps) => {
  const [energy, setEnergy] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const TARGET_CLICKS = 10;

  const handleClick = useCallback(() => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      setEnergy((prevEnergy) => prevEnergy + 10);
      
      if (newCount >= TARGET_CLICKS) {
        setTimeout(() => {
          onComplete();
        }, 500);
      }
      
      return newCount;
    });
  }, [onComplete]);

  const progress = (clickCount / TARGET_CLICKS) * 100;

  return (
    <div className={styles.gameContainer}>
      <p className={styles.gameDescription}>{step.content}</p>
      <div className={styles.energyDisplay}>
        <div className={styles.energyLabel}>Pozitif Enerji</div>
        <div className={styles.energyValue}>{energy}%</div>
      </div>
      <div className={styles.progressCircle}>
        <svg className={styles.circleSvg} viewBox="0 0 120 120">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
          <circle
            className={styles.circleBackground}
            cx="60"
            cy="60"
            r="50"
          />
          <circle
            className={styles.circleProgress}
            cx="60"
            cy="60"
            r="50"
            stroke="url(#progressGradient)"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
          />
        </svg>
        <div className={styles.circleText}>
          {clickCount} / {TARGET_CLICKS}
        </div>
      </div>
      <button
        className={styles.energyButton}
        onClick={handleClick}
        disabled={clickCount >= TARGET_CLICKS}
      >
        {clickCount >= TARGET_CLICKS ? 'Tamamlandı! 🎉' : 'Enerji Topla! ⚡'}
      </button>
    </div>
  );
});

GameStep.displayName = 'GameStep';

export default GameStep;

