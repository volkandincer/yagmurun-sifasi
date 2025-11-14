import { useState, useCallback, useMemo, useEffect, useRef, memo } from 'react';
import { GameProps } from '../../interfaces/GameProps.interface';
import styles from '../../styles/InfluenzaStep.module.css';

interface HealthTip {
  id: number;
  text: string;
  clickable: boolean;
}

const HEALTH_TIPS: HealthTip[] = [
  { id: 1, text: 'Bol bol dinlen 💤', clickable: false },
  { id: 2, text: 'Sıvı tüketimi artır 💧', clickable: false },
  { id: 3, text: 'İlaçlarını zamanında al 💊', clickable: false },
  { id: 4, text: 'Oda sıcaklığını ayarla 🌡️', clickable: false },
  { id: 5, text: 'Sevdiklerinle konuş, moralini yüksek tut! 💙', clickable: true },
];

const InfluenzaStep = memo(({ step, onComplete }: GameProps) => {
  // Direkt oyunu göster, YouTube yok
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);
  const [showGame, setShowGame] = useState<boolean>(true);

  // Step değiştiğinde state'leri sıfırla
  useEffect(() => {
    setCurrentTipIndex(0);
    setShowGame(true);
    setTextPosition({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    });
    setTextKey(0);
    setClickCount(0);
    setShowTryAgain(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [step.id]);

  // Rastgele başlangıç pozisyonu
  const [textPosition, setTextPosition] = useState<{ x: number; y: number }>(() => ({
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
  }));
  const [textKey, setTextKey] = useState<number>(0);
  const [clickCount, setClickCount] = useState<number>(0);
  const [showTryAgain, setShowTryAgain] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTextClick = useCallback(() => {
    setClickCount((prev) => {
      const newClickCount = prev + 1;

      // Timeout'u temizle
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (newClickCount < 3) {
        // Henüz 3 kere tıklanmadı, metni kaçır
        const newX = Math.random() * 80 + 10;
        const newY = Math.random() * 80 + 10;
        setTextPosition({ x: newX, y: newY });
        setTextKey((prevKey) => prevKey + 1);
        setShowTryAgain(false);

        // 5 saniye içinde 3. tıklama yapılmazsa "bi daha dene" göster
        timeoutRef.current = setTimeout(() => {
          setShowTryAgain(true);
          setClickCount(0);
          // Metni yeni bir yere taşı
          setTextPosition({
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10,
          });
          setTextKey((prevKey) => prevKey + 1);
        }, 5000);
      } else {
        // 3. tıklama - yakalandı!
        setShowTryAgain(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // Listedeki bir sonraki adıma geç
        setCurrentTipIndex((prevIndex) => {
          if (prevIndex < HEALTH_TIPS.length - 1) {
            return prevIndex + 1;
          } else {
            // Son adıma ulaşıldığında bir sonraki step'e geç
            setTimeout(() => {
              onComplete();
            }, 500);
            return prevIndex;
          }
        });

        // Yeni metin için pozisyon ayarla
        setTextPosition({
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
        });
        setTextKey((prevKey) => prevKey + 1);
      }

      return newClickCount;
    });
  }, [onComplete]);

  const handleTipClick = useCallback((tip: HealthTip) => {
    if (!tip.clickable) return;
    
    // Son tıklanabilir metne tıklandığında bir sonraki adıma geç
    setTimeout(() => {
      onComplete();
    }, 500);
  }, [onComplete]);

  const currentTip = useMemo(
    () => HEALTH_TIPS[currentTipIndex],
    [currentTipIndex]
  );

  // Metin pozisyonunu rastgele değiştir (sürekli hareket) - sadece tıklama yoksa
  useEffect(() => {
    if (!showGame || clickCount > 0) return;
    
    const interval = setInterval(() => {
      const newX = Math.random() * 80 + 10; // 10-90% arası
      const newY = Math.random() * 80 + 10; // 10-90% arası
      setTextPosition({ x: newX, y: newY });
      setTextKey((prev) => prev + 1);
    }, 4000); // 4 saniyede bir pozisyon değişsin

    return () => clearInterval(interval);
  }, [showGame, clickCount]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!showGame) {
    return null;
  }

  return (
    <div className={styles.influenzaContainer}>
      <div className={styles.gameContainer}>
        <div className={styles.tipsContainer}>
          {HEALTH_TIPS.map((tip, index) => {
            const isActive = index === currentTipIndex;
            const isPast = index < currentTipIndex;
            
            return (
              <button
                key={tip.id}
                className={`${styles.tipButton} ${
                  isActive ? styles.active : ''
                } ${isPast ? styles.past : ''} ${
                  !tip.clickable ? styles.disabled : ''
                }`}
                onClick={() => handleTipClick(tip)}
                disabled={!tip.clickable || !isActive}
              >
                {tip.text}
              </button>
            );
          })}
        </div>

        {/* Hareketli metin */}
        {currentTip && (
          <>
            <div 
              key={`${currentTipIndex}-${textKey}`}
              className={styles.movingText}
              style={{
                left: `${textPosition.x}%`,
                top: `${textPosition.y}%`,
              }}
              onClick={handleTextClick}
            >
              {currentTip.text}
              {clickCount > 0 && clickCount < 3 && (
                <span className={styles.clickCounter}>{clickCount}/3</span>
              )}
            </div>
            {showTryAgain && (
              <div className={styles.tryAgainMessage}>
                Bi daha dene! 😊
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

InfluenzaStep.displayName = 'InfluenzaStep';

export default InfluenzaStep;

