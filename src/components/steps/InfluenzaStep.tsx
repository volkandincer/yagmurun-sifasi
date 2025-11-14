import { useState, useCallback, useMemo, useEffect, useRef, memo } from "react";
import { GameProps } from "../../interfaces/GameProps.interface";
import styles from "../../styles/InfluenzaStep.module.css";

interface HealthTip {
  id: number;
  text: string;
  clickable: boolean;
}

const HEALTH_TIPS: HealthTip[] = [
  { id: 1, text: "Bol bol dinlen 💤", clickable: false },
  { id: 2, text: "Sıvı tüketimi artır 💧", clickable: false },
  { id: 3, text: "İlaçlarını zamanında al 💊", clickable: false },
  { id: 4, text: "Oda sıcaklığını ayarla 🌡️", clickable: false },
  {
    id: 5,
    text: "Sevdiklerinle konuş, moralini yüksek tut! 💙",
    clickable: true,
  },
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
    setFailedAttempts(0);
    setShowScenarioMessage(false);
    setCountdown(15);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  }, [step.id]);

  // Rastgele başlangıç pozisyonu
  const [textPosition, setTextPosition] = useState<{ x: number; y: number }>(
    () => ({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    })
  );
  const [textKey, setTextKey] = useState<number>(0);
  const [clickCount, setClickCount] = useState<number>(0);
  const [showTryAgain, setShowTryAgain] = useState<boolean>(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [showScenarioMessage, setShowScenarioMessage] =
    useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(15);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const moveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleTextClick = useCallback(() => {
    // Senaryo mesajı gösteriliyorsa tıklamayı engelle
    if (showScenarioMessage) return;

    // Hasta olduğun için tıklayamıyorsun - metin hemen kaçıyor
    setFailedAttempts((prev) => {
      const newFailed = prev + 1;

      // 3 başarısız denemeden sonra senaryo mesajını göster (sadece bir kez)
      if (newFailed >= 3 && !showScenarioMessage) {
        // Metin hareketini durdur (mesaj gösterilirken)
        if (moveIntervalRef.current) {
          clearInterval(moveIntervalRef.current);
          moveIntervalRef.current = null;
        }

        setShowScenarioMessage(true);
        // 4 saniye sonra mesajı kapat (zamanlayıcı devam ediyor)
        timeoutRef.current = setTimeout(() => {
          setShowScenarioMessage(false);
          // Metin hareketini yeniden başlat
          if (showGame) {
            moveIntervalRef.current = setInterval(() => {
              const newX = Math.random() * 80 + 10;
              const newY = Math.random() * 80 + 10;
              setTextPosition({ x: newX, y: newY });
              setTextKey((prev) => prev + 1);
            }, 1500);
          }
        }, 4000);
      }

      return newFailed;
    });
    setClickCount(0);

    // Metni çok hızlı kaçır (hasta olduğun için yakalayamıyorsun)
    const newX = Math.random() * 80 + 10;
    const newY = Math.random() * 80 + 10;
    setTextPosition({ x: newX, y: newY });
    setTextKey((prevKey) => prevKey + 1);
    setShowTryAgain(false);
  }, [showScenarioMessage]);

  const handleTipClick = useCallback((tip: HealthTip) => {
    // Artık butonlarla geçiş yok, sadece zamanlayıcı ile geçiş var
    // Bu fonksiyon artık kullanılmıyor ama butonlar görsel olarak kalabilir
    return;
  }, []);

  const currentTip = useMemo(
    () => HEALTH_TIPS[currentTipIndex],
    [currentTipIndex]
  );

  // Metin pozisyonunu sürekli değiştir (çok hızlı - hasta olduğun için yakalayamıyorsun)
  useEffect(() => {
    if (!showGame || showScenarioMessage) return;

    moveIntervalRef.current = setInterval(() => {
      const newX = Math.random() * 80 + 10;
      const newY = Math.random() * 80 + 10;
      setTextPosition({ x: newX, y: newY });
      setTextKey((prev) => prev + 1);
    }, 1500); // 1.5 saniyede bir pozisyon değişsin (çok hızlı)

    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
      }
    };
  }, [showGame, showScenarioMessage]);

  // Zamanlayıcı - belirli süre sonra otomatik geçiş (iyileşme süreci)
  useEffect(() => {
    if (!showGame || showScenarioMessage) return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        const newTime = prev - 1;

        // 0 saniyeye ulaştığında otomatik geçiş (iyileşme süreci tamamlandı)
        if (newTime <= 0) {
          // Tüm interval'leri durdur
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (moveIntervalRef.current) {
            clearInterval(moveIntervalRef.current);
            moveIntervalRef.current = null;
          }
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          // Senaryo mesajı göster
          setShowScenarioMessage(true);

          // 3 saniye sonra geçiş yap
          timeoutRef.current = setTimeout(() => {
            // Tüm interval'leri temizle
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            if (moveIntervalRef.current) {
              clearInterval(moveIntervalRef.current);
              moveIntervalRef.current = null;
            }
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            // Tüm state'leri temizle
            setShowScenarioMessage(false);
            setShowGame(false);
            // Geçiş yap
            onComplete();
          }, 3000);
        }

        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [showGame, showScenarioMessage, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
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
                  isActive ? styles.active : ""
                } ${isPast ? styles.past : ""} ${
                  !tip.clickable ? styles.disabled : ""
                }`}
                onClick={() => handleTipClick(tip)}
                disabled={!tip.clickable || !isActive}
              >
                {tip.text}
              </button>
            );
          })}
        </div>

        {/* Senaryo mesajı */}
        {showScenarioMessage && (
          <div className={styles.scenarioMessage}>
            {countdown > 0 ? (
              <>
                <p className={styles.scenarioText}>
                  Daha çabuk iyileşmek için listedekileri yapıyoruz, sonra
                  geçiyoruz plisss... 🤒
                </p>
                <p className={styles.scenarioSubtext}>
                  Hasta olduğun için tıklayamıyorsun. Biraz dinlen, iyileşme
                  süreci devam ediyor... 💙
                </p>
              </>
            ) : (
              <>
                <p className={styles.completionText}>
                  İyileşme süreci tamamlandı! Bir sonraki adıma geçiyoruz... ✨
                </p>
                <div className={styles.loadingSpinner}></div>
              </>
            )}
          </div>
        )}

        {/* Zamanlayıcı gösterimi */}
        {!showScenarioMessage && (
          <div className={styles.timerDisplay}>
            <p className={styles.timerText}>İyileşme süreci: {countdown} sn</p>
            <div className={styles.timerBar}>
              <div
                className={styles.timerFill}
                style={{ width: `${((15 - countdown) / 15) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Hareketli metin */}
        {currentTip && !showScenarioMessage && (
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
          </div>
        )}

        {/* Başarısız deneme mesajı */}
        {failedAttempts > 0 && !showScenarioMessage && (
          <div className={styles.failedAttemptMessage}>
            Tıklayamadın... Hasta olduğun için yakalayamıyorsun 🤒
            <br />
            Deneme: {failedAttempts}
          </div>
        )}
      </div>
    </div>
  );
});

InfluenzaStep.displayName = "InfluenzaStep";

export default InfluenzaStep;
