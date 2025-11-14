import { useState, useEffect, useMemo, memo } from 'react';
import { CountdownProps } from '../interfaces/Countdown.interface';
import styles from '../styles/Countdown.module.css';

const COUNTDOWN_DURATION = 10;
const MOTIVATION_TEXT_INTERVAL = 2000; // 2 saniyede bir değişir

const MOTIVATION_TEXTS: readonly string[] = [
  'Sen çok güçlüsün! 💪',
  'Her gün daha iyi oluyorsun 🌟',
  'Seni seven herkes yanında 💙',
  'İyileşme yolundasın ✨',
  'Pozitif enerji seninle 🌈',
  'Güçlü kal, Yağmur! 💪',
  'Her nefes seni daha güçlü yapıyor 🌸',
  'Sen harika birisin! 🌟',
  'Umudun her zaman var 🌺',
  'Senin için dualar ediliyor 🙏',
] as const;

const Countdown = memo(({ onComplete }: CountdownProps) => {
  const [count, setCount] = useState<number>(COUNTDOWN_DURATION);
  const [showReadyMessage, setShowReadyMessage] = useState<boolean>(false);
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);

  const currentMotivationText = useMemo(
    () => MOTIVATION_TEXTS[currentTextIndex],
    [currentTextIndex]
  );

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setShowReadyMessage(true);
      const readyTimer = setTimeout(() => {
        onComplete();
      }, 2000);

      return () => clearTimeout(readyTimer);
    }
  }, [count, onComplete]);

  useEffect(() => {
    if (showReadyMessage) {
      return;
    }

    const textTimer = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % MOTIVATION_TEXTS.length);
    }, MOTIVATION_TEXT_INTERVAL);

    return () => clearInterval(textTimer);
  }, [showReadyMessage]);

  if (showReadyMessage) {
    return (
      <div className={styles.container}>
        <div className={styles.readyMessage}>
          <h2 className={styles.readyTitle}>Hazır mısın?</h2>
          <p className={styles.readySubtitle}>Başlıyoruz!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.countdown}>
        <div className={styles.countdownNumber}>{count}</div>
        <p className={styles.countdownText}>Saniye</p>
        <p className={styles.motivationText}>{currentMotivationText}</p>
      </div>
    </div>
  );
});

Countdown.displayName = 'Countdown';

export default Countdown;

