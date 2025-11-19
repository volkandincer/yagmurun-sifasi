import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { CountdownProps } from "../interfaces/Countdown.interface";
import styles from "../styles/Countdown.module.css";

const COUNTDOWN_DURATION = 10;

const MOTIVATION_TEXTS: readonly string[] = [
  "İyileşme yolundasın ✨",
  "Her gün daha güçlü oluyorsun 💪",
  "Seni seven herkes yanında 💙",
  "Pozitif enerji seninle 🌈",
  "Güçlü kal, Yağmur! 🌟",
  "Her nefes seni iyileştiriyor 🌸",
  "Sen harika birisin! 💫",
  "Umudun her zaman var 🌺",
  "Yakında birlikte olacağız 💕",
  "İyileşince neler yapacağız! 🎉",
] as const;

const Countdown = memo(({ onComplete }: CountdownProps) => {
  const [count, setCount] = useState<number>(COUNTDOWN_DURATION);
  const [showReadyMessage, setShowReadyMessage] = useState<boolean>(false);
  // Başlangıçta rastgele bir metin göster
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(() =>
    Math.floor(Math.random() * MOTIVATION_TEXTS.length)
  );

  const currentMotivationText = useMemo(
    () => MOTIVATION_TEXTS[currentTextIndex],
    [currentTextIndex]
  );

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount((prev) => prev - 1);
        // Her saniye metni değiştir
        setCurrentTextIndex((prev) => (prev + 1) % MOTIVATION_TEXTS.length);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setShowReadyMessage(true);
    }
  }, [count]);

  const handleStart = useCallback(() => {
    onComplete();
  }, [onComplete]);

  if (showReadyMessage) {
    return (
      <div className={styles.container}>
        <div className={styles.readyMessage}>
          <div className={styles.readyIcon}>💙</div>
          <h2 className={styles.readyTitle}>
            Çocukları yanına al merak ederler :)
          </h2>
          <h2 className={styles.readyTitle}>Hazır mısın?</h2>
          <p className={styles.readySubtitle}>
            İyileşme yolculuğuna başlıyoruz. Umarım keyif alırsın.
          </p>
          <button className={styles.startButton} onClick={handleStart}>
            Başlıyoruz... ✨
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.countdown}>
        <div key={count} className={styles.countdownNumber}>
          {count} sn
        </div>
        <p
          key={`motivation-${currentTextIndex}`}
          className={styles.motivationText}
        >
          {currentMotivationText}
        </p>
      </div>
    </div>
  );
});

Countdown.displayName = "Countdown";

export default Countdown;
