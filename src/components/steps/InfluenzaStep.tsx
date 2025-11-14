import { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { GameProps } from '../../interfaces/GameProps.interface';
import styles from '../../styles/InfluenzaStep.module.css';

const YOUTUBE_VIDEO_ID = 'NF09k1LU1wA'; // Barış Manço - Nane Limon Kabuğu
const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`;

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
  const [showYouTube, setShowYouTube] = useState<boolean>(true);
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);
  const [showGame, setShowGame] = useState<boolean>(false);

  const handleCloseYouTube = useCallback(() => {
    setShowYouTube(false);
    setTimeout(() => {
      setShowGame(true);
    }, 500);
  }, []);

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

  // Otomatik olarak bir sonraki tipe geç (3 saniyede bir)
  useEffect(() => {
    if (!showGame) return;
    
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => {
        if (prev < HEALTH_TIPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [showGame]);

  if (showYouTube) {
    return (
      <div className={styles.influenzaContainer}>
        <div className={styles.youtubeOverlay} onClick={handleCloseYouTube}>
          <div className={styles.youtubeModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={handleCloseYouTube}>
              ✕
            </button>
            <div className={styles.youtubeContainer}>
              <iframe
                className={styles.youtubeIframe}
                src={YOUTUBE_EMBED_URL}
                title="Barış Manço - Nane Limon Kabuğu"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!showGame) {
    return null;
  }

  return (
    <div className={styles.influenzaContainer}>
      <div className={styles.gameContainer}>
        <h3 className={styles.gameTitle}>Influenza Olan Birinin Yapması Gerekenler</h3>
        
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
          <div 
            key={currentTipIndex}
            className={styles.movingText}
          >
            {currentTip.text}
          </div>
        )}
      </div>
    </div>
  );
});

InfluenzaStep.displayName = 'InfluenzaStep';

export default InfluenzaStep;

