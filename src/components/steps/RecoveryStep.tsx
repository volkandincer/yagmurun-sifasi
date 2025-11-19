import { memo, useState, useCallback, useMemo } from "react";
import { GameProps } from "../../interfaces/GameProps.interface";
import styles from "../../styles/RecoveryStep.module.css";

interface RecoveryStatus {
  smell: number; // 0-100
  taste: number; // 0-100
  cough: number; // 0-100 (ters - yüksek = kötü)
  weakness: number; // 0-100 (ters - yüksek = kötü)
  sneeze: number; // 0-100 (ters - yüksek = kötü)
}

const getAnalysisMessage = (
  progress: number
): { title: string; message: string; emoji: string; herbalTip: string } => {
  if (progress >= 80) {
    return {
      title: "🏆 Süper İyileşme Modu!",
      message: `Sen %${progress} iyileşmişsin! Bu demek oluyor ki influenza olanların sadece %${
        100 - progress
      }'i senden daha iyi durumda. Sen neredeyse bir süper kahraman gibisin! 🦸‍♀️`,
      emoji: "🎉",
      herbalTip:
        "🌿 Bitkisel Öneri: Zencefil ve bal karışımı ile bağışıklığını güçlendirmeye devam et! Bir tutam taze zencefil, bir çay kaşığı bal ve sıcak su ile hazırlayacağın çay seni tamamen iyileştirecek. 💚",
    };
  }
  if (progress >= 60) {
    return {
      title: "👍 İyi Gidiyorsun!",
      message: `%${progress} iyileşme var! Influenza olanların %${Math.round(
        (progress / 100) * 73
      )}'ü senden daha kötü durumda. Yani sen ortalamanın üstündesin! (Bu istatistik %100 doğru, Google'a sorma 😄)`,
      emoji: "✨",
      herbalTip:
        "🌿 Bitkisel Öneri: Ihlamur çayı içmeye devam et! Bir avuç ıhlamur, birkaç dilim limon ve bal ile hazırlayacağın çay öksürüğünü yatıştırır ve boğazını rahatlatır. Günde 2-3 fincan içebilirsin. 💚",
    };
  }
  if (progress >= 40) {
    return {
      title: "😐 Orta Seviye İyileşme",
      message: `%${progress} iyileşme... Influenza olanların %${Math.round(
        (progress / 100) * 50
      )}'si senden daha iyi, %${Math.round(
        ((100 - progress) / 100) * 50
      )}'si senden daha kötü. Yani tam ortadasın! (Bu analiz bilimsel değil, güvenme 😅)`,
      emoji: "📊",
      herbalTip:
        "🌿 Bitkisel Öneri: Adaçayı gargarası yap! Bir tutam adaçayını kaynar suda demleyip soğut, sonra gargara yap. Bu boğaz ağrını ve öksürüğünü azaltır. Ayrıca ekinezya çayı da bağışıklığını destekler. 💚",
    };
  }
  if (progress >= 20) {
    return {
      title: "😷 Biraz Daha Sabır",
      message: `%${progress} iyileşme var. Influenza olanların %${Math.round(
        ((100 - progress) / 100) * 80
      )}'i senden daha iyi durumda. Ama endişelenme, sen hala %${
        100 - Math.round(((100 - progress) / 100) * 80)
      }'lik bir azınlıktasın! (İstatistikler bazen yalan söyler 🤷‍♀️)`,
      emoji: "💪",
      herbalTip:
        "🌿 Bitkisel Öneri: Karabiber, zerdeçal ve bal karışımı hazırla! Bir çay kaşığı bal, yarım çay kaşığı karabiber ve çeyrek çay kaşığı zerdeçalı karıştır. Bu karışım öksürüğünü keser ve bağışıklığını güçlendirir. Günde 2-3 kez alabilirsin. 💚",
    };
  }
  return {
    title: "🆘 Acil Durum Modu",
    message: `%${progress} iyileşme... Influenza olanların %${Math.round(
      ((100 - progress) / 100) * 95
    )}'i senden daha iyi. Ama merak etme, bu sadece bir sayı! Sen gerçekte çok daha güçlüsün! (Bu analiz tamamen rastgele, ciddiye alma 😂)`,
    emoji: "🚑",
    herbalTip:
      "🌿 Bitkisel Öneri: Tarçın, zencefil, bal ve limon karışımı hazırla! Bir çay kaşığı bal, yarım çay kaşığı toz tarçın, bir tutam taze zencefil ve birkaç damla limon suyunu karıştır. Bu güçlü karışım bağışıklığını hızla toparlar. Günde 3-4 kez alabilirsin. Ayrıca bol bol C vitamini içeren meyveler (portakal, kivi) tüket! 💚",
  };
};

const RecoveryStep = memo(({ onComplete }: GameProps) => {
  const [status, setStatus] = useState<RecoveryStatus>({
    smell: 20,
    taste: 15,
    cough: 80,
    weakness: 70,
    sneeze: 50,
  });
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [analysisConfirmed, setAnalysisConfirmed] = useState<boolean>(false);

  const handleSmellChange = useCallback((value: number) => {
    setStatus((prev) => ({ ...prev, smell: value }));
  }, []);

  const handleTasteChange = useCallback((value: number) => {
    setStatus((prev) => ({ ...prev, taste: value }));
  }, []);

  const handleCoughChange = useCallback((value: number) => {
    setStatus((prev) => ({ ...prev, cough: value }));
  }, []);

  const handleWeaknessChange = useCallback((value: number) => {
    setStatus((prev) => ({ ...prev, weakness: value }));
  }, []);

  const handleSneezeChange = useCallback((value: number) => {
    setStatus((prev) => ({ ...prev, sneeze: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    setHasSubmitted(true);
    setShowAnalysis(true);
  }, []);

  const handleAnalysisConfirm = useCallback(() => {
    if (analysisConfirmed) {
      setShowAnalysis(false);
      onComplete();
    }
  }, [analysisConfirmed, onComplete]);

  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAnalysisConfirmed(e.target.checked);
    },
    []
  );

  const overallProgress = useMemo(() => {
    // Koku ve tat iyileşme yüzdesi, diğerleri ters (düşük = iyi)
    const smellProgress = status.smell;
    const tasteProgress = status.taste;
    const coughProgress = 100 - status.cough;
    const weaknessProgress = 100 - status.weakness;
    const sneezeProgress = 100 - status.sneeze;
    return Math.round(
      (smellProgress +
        tasteProgress +
        coughProgress +
        weaknessProgress +
        sneezeProgress) /
        5
    );
  }, [status]);

  const getStatusEmoji = useCallback(
    (value: number, isReversed: boolean = false) => {
      if (isReversed) {
        // Ters değerler için - düşük değer = iyi
        if (value <= 30) return "😊";
        if (value <= 60) return "😐";
        return "😷";
      }
      // Normal değerler için - yüksek değer = iyi
      if (value >= 70) return "😊";
      if (value >= 40) return "😐";
      return "😷";
    },
    []
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.introText}>
          İyileşme sürecini takip edelim. Bugün nasıl hissediyorsun? Öksürük,
          halsizlik, hapşırma gibi durumlarını paylaş 💙
        </p>

        <div className={styles.statusCard}>
          <div className={styles.overallProgress}>
            <div className={styles.progressCircle}>
              <svg className={styles.progressSvg} viewBox="0 0 100 100">
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="50%" stopColor="#764ba2" />
                    <stop offset="100%" stopColor="#f093fb" />
                  </linearGradient>
                </defs>
                <circle className={styles.progressBg} cx="50" cy="50" r="45" />
                <circle
                  className={styles.progressBar}
                  cx="50"
                  cy="50"
                  r="45"
                  strokeDasharray={`${overallProgress * 2.827} 283`}
                />
              </svg>
              <div className={styles.progressText}>
                <span className={styles.progressNumber}>
                  {overallProgress}%
                </span>
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

            <div className={styles.statusItem}>
              <div className={styles.statusHeader}>
                <span className={styles.statusIcon}>
                  {getStatusEmoji(status.weakness, true)}
                </span>
                <span className={styles.statusLabel}>Halsizlik</span>
                <span className={styles.statusValue}>{status.weakness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={status.weakness}
                onChange={(e) => handleWeaknessChange(Number(e.target.value))}
                className={styles.slider}
                disabled={hasSubmitted}
              />
              <p className={styles.coughNote}>
                (Yüksek değer = daha fazla halsizlik)
              </p>
            </div>

            <div className={styles.statusItem}>
              <div className={styles.statusHeader}>
                <span className={styles.statusIcon}>
                  {getStatusEmoji(status.sneeze, true)}
                </span>
                <span className={styles.statusLabel}>Hapşırma</span>
                <span className={styles.statusValue}>{status.sneeze}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={status.sneeze}
                onChange={(e) => handleSneezeChange(Number(e.target.value))}
                className={styles.slider}
                disabled={hasSubmitted}
              />
              <p className={styles.coughNote}>
                (Yüksek değer = daha fazla hapşırma)
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
              <p>✅ Durumun kaydedildi!</p>
            </div>
          )}
        </div>
      </div>

      {showAnalysis && (
        <div className={styles.analysisPopupOverlay}>
          <div
            className={styles.analysisPopupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.analysisEmoji}>
              {getAnalysisMessage(overallProgress).emoji}
            </div>
            <h3 className={styles.analysisTitle}>
              {getAnalysisMessage(overallProgress).title}
            </h3>
            <p className={styles.analysisText}>
              {getAnalysisMessage(overallProgress).message}
            </p>
            <div className={styles.herbalTipContainer}>
              <p className={styles.herbalTipText}>
                {getAnalysisMessage(overallProgress).herbalTip}
              </p>
            </div>
            <div className={styles.analysisCheckboxContainer}>
              <label className={styles.analysisCheckboxLabel}>
                <input
                  type="checkbox"
                  checked={analysisConfirmed}
                  onChange={handleCheckboxChange}
                  className={styles.analysisCheckbox}
                />
                <span className={styles.analysisCheckboxText}>
                  Analizi anladım yeminle ✋
                </span>
              </label>
            </div>
            <button
              className={`${styles.analysisConfirmButton} ${
                !analysisConfirmed ? styles.analysisConfirmButtonDisabled : ""
              }`}
              onClick={handleAnalysisConfirm}
              disabled={!analysisConfirmed}
              type="button"
            >
              Devam Et →
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

RecoveryStep.displayName = "RecoveryStep";

export default RecoveryStep;
