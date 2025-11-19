import { memo, useState, useCallback, useMemo } from 'react';
import { GameProps } from '../../interfaces/GameProps.interface';
import styles from '../../styles/RecoveryStep.module.css';

interface RecoveryStatus {
  smell: number; // 0-100
  taste: number; // 0-100
  cough: number; // 0-100 (ters - yüksek = kötü)
}

const RecoveryStep = memo(({ onComplete }: GameProps) => {
  const [status, setStatus] = useState<RecoveryStatus>({
    smell: 20,
    taste: 15,
    cough: 80,
  });
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const handleSmellChange = useCallback((value: number) => {
    setStatus((prev) => ({ ...prev, smell: value }));
  }, []);

  const handleTasteChange = useCallback((value: number) => {
    setStatus((prev) => ({ ...prev, taste: value }));
  }, []);

  const handleCoughChange = useCallback((value: number) => {
    setStatus((prev) => ({ ...prev, cough: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    setHasSubmitted(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  }, [onComplete]);

  const overallProgress = useMemo(() => {
    // Koku ve tat iyileşme yüzdesi, öksürük ters (düşük öksürük = iyi)
    const smellProgress = status.smell;
    const tasteProgress = status.taste;
    const coughProgress = 100 - status.cough; // Ters çevir
    return Math.round((smellProgress + tasteProgress + coughProgress) / 3);
  }, [status]);

  const getStatusEmoji = useCallback((value: number, isCough: boolean = false) => {
    if (isCough) {
      // Öksürük için ters - düşük değer = iyi
      if (value <= 30) return '😊';
      if (value <= 60) return '😐';
      return '😷';
    }
    // Koku/tat için normal
    if (value >= 70) return '😊';
    if (value >= 40) return '😐';
    return '😷';
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.introText}>
          İyileşme sürecini takip edelim. Bugün nasıl hissediyorsun? 💙
        </p>

        <div className={styles.statusCard}>
          <div className={styles.overallProgress}>
            <div className={styles.progressCircle}>
              <svg className={styles.progressSvg} viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="50%" stopColor="#764ba2" />
                    <stop offset="100%" stopColor="#f093fb" />
                  </linearGradient>
                </defs>
                <circle
                  className={styles.progressBg}
                  cx="50"
                  cy="50"
                  r="45"
                />
                <circle
                  className={styles.progressBar}
                  cx="50"
                  cy="50"
                  r="45"
                  strokeDasharray={`${overallProgress * 2.827} 283`}
                />
              </svg>
              <div className={styles.progressText}>
                <span className={styles.progressNumber}>{overallProgress}%</span>
                <span className={styles.progressLabel}>İyileşme</span>
              </div>
            </div>
          </div>

          <div className={styles.statusItems}>
            <div className={styles.statusItem}>
              <div className={styles.statusHeader}>
                <span className={styles.statusIcon}>
                  {getStatusEmoji(status.smell)}
                </span>
                <span className={styles.statusLabel}>Koku Alma</span>
                <span className={styles.statusValue}>{status.smell}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={status.smell}
                onChange={(e) => handleSmellChange(Number(e.target.value))}
                className={styles.slider}
                disabled={hasSubmitted}
              />
            </div>

            <div className={styles.statusItem}>
              <div className={styles.statusHeader}>
                <span className={styles.statusIcon}>
                  {getStatusEmoji(status.taste)}
                </span>
                <span className={styles.statusLabel}>Tat Alma</span>
                <span className={styles.statusValue}>{status.taste}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={status.taste}
                onChange={(e) => handleTasteChange(Number(e.target.value))}
                className={styles.slider}
                disabled={hasSubmitted}
              />
            </div>

            <div className={styles.statusItem}>
              <div className={styles.statusHeader}>
                <span className={styles.statusIcon}>
                  {getStatusEmoji(status.cough, true)}
                </span>
                <span className={styles.statusLabel}>Öksürük</span>
                <span className={styles.statusValue}>{status.cough}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={status.cough}
                onChange={(e) => handleCoughChange(Number(e.target.value))}
                className={styles.slider}
                disabled={hasSubmitted}
              />
              <p className={styles.coughNote}>
                (Yüksek değer = daha fazla öksürük)
              </p>
            </div>
          </div>

          {!hasSubmitted ? (
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              type="button"
            >
              Durumu Kaydet 💙
            </button>
          ) : (
            <div className={styles.successMessage}>
              <p>✅ Durumun kaydedildi! İyileşme yolunda devam ediyorsun 💙</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

RecoveryStep.displayName = 'RecoveryStep';

export default RecoveryStep;

