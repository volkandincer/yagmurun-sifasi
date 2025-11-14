import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { GameProps } from '../../interfaces/GameProps.interface';
import { Particle } from '../../interfaces/Particle.interface';
import { ENERGY_TYPES, EnergyType } from '../../interfaces/EnergyType.interface';
import { SUCCESS_MESSAGES } from '../../interfaces/SuccessMessage.interface';
import styles from '../../styles/GameStep.module.css';

const TARGET_CLICKS = 10;
const COMBO_TIME_WINDOW = 500; // 500ms içinde tıklama combo sayılır
const PARTICLE_COUNT = 15;

const GameStep = memo(({ step, onComplete }: GameProps) => {
  const [energy, setEnergy] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [currentEnergyType, setCurrentEnergyType] = useState<EnergyType>(ENERGY_TYPES[0]);
  const [buttonScale, setButtonScale] = useState(1);
  const lastClickTime = useRef<number>(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      color,
      size: Math.random() * 6 + 4,
      velocityX: (Math.random() - 0.5) * 8,
      velocityY: (Math.random() - 0.5) * 8,
      opacity: 1,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  const getRandomSuccessMessage = useCallback(() => {
    return SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)];
  }, []);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime.current;
    
    // Combo hesaplama
    let newCombo = 1;
    if (timeSinceLastClick < COMBO_TIME_WINDOW) {
      newCombo = combo + 1;
      setCombo(newCombo);
    } else {
      setCombo(1);
    }
    lastClickTime.current = now;

    // Buton pozisyonunu al
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Parçacık efektleri
    createParticles(x, y, currentEnergyType.color);

    // Başarı mesajı
    const message = getRandomSuccessMessage();
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 1000);

    // Buton animasyonu
    setButtonScale(1.2);
    setTimeout(() => setButtonScale(1), 150);

    // Enerji türü değişimi
    const randomType = ENERGY_TYPES[Math.floor(Math.random() * ENERGY_TYPES.length)];
    setCurrentEnergyType(randomType);

    // Enerji ve tıklama sayısı
    const energyGain = 10 * newCombo;
    setClickCount((prev) => {
      const newCount = prev + 1;
      setEnergy((prevEnergy) => Math.min(prevEnergy + energyGain, 100));
      
      if (newCount >= TARGET_CLICKS) {
        setTimeout(() => {
          onComplete();
        }, 500);
      }
      
      return newCount;
    });
  }, [combo, currentEnergyType, createParticles, getRandomSuccessMessage, onComplete]);

  // Parçacık animasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.velocityX,
            y: particle.y + particle.velocityY,
            opacity: particle.opacity - 0.02,
            velocityY: particle.velocityY + 0.2, // gravity
          }))
          .filter((particle) => particle.opacity > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  // Combo reset - belirli süre sonra combo sıfırlanır
  useEffect(() => {
    if (combo > 0) {
      const timer = setTimeout(() => {
        setCombo(0);
      }, COMBO_TIME_WINDOW);
      return () => clearTimeout(timer);
    }
  }, [combo]);

  const progress = (clickCount / TARGET_CLICKS) * 100;

  return (
    <div className={styles.gameContainer}>
      <p className={styles.gameDescription}>{step.content}</p>
      
      {/* Enerji Türü ve Combo Gösterimi */}
      <div className={styles.energyTypeDisplay}>
        <div className={styles.energyTypeBadge} style={{ color: currentEnergyType.color }}>
          <span className={styles.energyTypeEmoji}>{currentEnergyType.emoji}</span>
          <span className={styles.energyTypeName}>{currentEnergyType.name} Enerji</span>
        </div>
        {combo > 1 && (
          <div className={styles.comboDisplay}>
            <span className={styles.comboText}>COMBO x{combo}!</span>
          </div>
        )}
      </div>

      <div className={styles.energyDisplay}>
        <div className={styles.energyLabel}>Toplanan Enerji</div>
        <div className={styles.energyValue} style={{ color: currentEnergyType.color }}>
          {energy}%
        </div>
      </div>

      {/* Başarı Mesajı */}
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}

      <div className={styles.progressCircle}>
        <svg className={styles.circleSvg} viewBox="0 0 120 120">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={currentEnergyType.color} />
              <stop offset="100%" stopColor={ENERGY_TYPES[(ENERGY_TYPES.indexOf(currentEnergyType) + 1) % ENERGY_TYPES.length].color} />
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

      {/* Parçacık Efektleri */}
      <div className={styles.particlesContainer}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={styles.particle}
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              backgroundColor: particle.color,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
            }}
          />
        ))}
      </div>

      <button
        ref={buttonRef}
        className={styles.energyButton}
        onClick={handleClick}
        disabled={clickCount >= TARGET_CLICKS}
        style={{
          transform: `scale(${buttonScale})`,
          background: `linear-gradient(135deg, ${currentEnergyType.color} 0%, ${ENERGY_TYPES[(ENERGY_TYPES.indexOf(currentEnergyType) + 1) % ENERGY_TYPES.length].color} 100%)`,
          transition: 'transform 0.15s ease-out, background 0.3s ease',
        }}
      >
        {clickCount >= TARGET_CLICKS ? 'Tamamlandı! 🎉' : `${currentEnergyType.emoji} Enerji Topla! ⚡`}
      </button>
    </div>
  );
});

GameStep.displayName = 'GameStep';

export default GameStep;

