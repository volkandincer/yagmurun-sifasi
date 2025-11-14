import { useState, useCallback, useMemo, useEffect } from "react";
import { Step } from "./interfaces/Step.interface";
import { StepProgress } from "./interfaces/Step.interface";
import ProgressBar from "./components/ProgressBar";
import StepComponent from "./components/StepComponent";
import Countdown from "./components/Countdown";
import styles from "./styles/App.module.css";

const CONFETTI_COLORS = [
  "#667eea",
  "#764ba2",
  "#f093fb",
  "#4facfe",
  "#43e97b",
  "#fa709a",
];

const INITIAL_STEPS: Step[] = [
  {
    id: 1,
    title: "Hoş Geldin Yağmur! 💙",
    description: "İyileşmeni dört gözle bekliyoruzzzzz",
    type: "message",
    content:
      "Biraz eğlenmeni istedim umarım keyfin yerine gelir. Her adımda karşına çıkacak sürprizlere gülümse...",
    completed: false,
  },
  {
    id: 2,
    title: "Pozitif Enerji Toplama 🌟",
    description: "Bu butona bas ve pozitif enerji topla!",
    type: "game",
    content:
      "Aşağıdaki butona basıp ve pozitif enerji topluyoruz.! Her tıklamada daha güçlü olacaksın!",
    completed: false,
  },
  {
    id: 3,
    title: "Şifa Mesajları 💐",
    description: "Senin için özel mesajlar",
    type: "message",
    content:
      "Çok güçlüsün Yağmur! Bu zorlu günleri atlatacak ve daha güçlü olacaksın. Seni seven herkes yanında!",
    completed: false,
  },
  {
    id: 4,
    title: "BMW 3.20 leri Bulmaca 🎨",
    description: "BMW 3.20 leri eşleştir ve puan kazan!",
    type: "puzzle",
    content:
      "Renkleri eşleştirerek puan kazan! Her eşleşme seni bir adım daha ileri götürecek.",
    completed: false,
  },
  {
    id: 5,
    title: "İyileşmek için yapman gerekenler 🤒",
    description: "mızmızlanmak yok :)",
    type: "influenza",
    content:
      "Influenza olan birinin yapması gerekenler. Önce bir video izleyelim, sonra önerilere bakalım!",
    completed: false,
  },
  {
    id: 6,
    title: "Kahve ve Müzik Zamanı ☕🎵",
    description: "Kahveni yap ve özel playlist'i dinle",
    type: "spotify",
    content:
      "Kahveni yapıp bu özel şarkıları dinleyerek pinekliyorsun. Bahane istemiyoruzzzz. Bu şarkılar senin için seçildi!",
    completed: false,
  },
  {
    id: 7,
    title: "Sürpriz Mesaj 🎁",
    description: "Son adımda özel bir sürpriz seni bekliyor!",
    type: "surprise",
    content:
      "Sen harika birisin bazen gıcık olsan da... Hızlıca iyileşmen dileğiyle! 💙",
    completed: false,
  },
];

function App() {
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [countdownCompleted, setCountdownCompleted] = useState<boolean>(false);
  const [confetti, setConfetti] = useState<
    Array<{ id: number; x: number; color: string }>
  >([]);
  const [showSurprisePopup, setShowSurprisePopup] = useState<boolean>(false);

  const progress: StepProgress = useMemo(() => {
    const completedSteps = steps.filter((step) => step.completed).length;
    const allCompleted = steps.every((step) => step.completed);
    return {
      currentStep: currentStepIndex + 1,
      totalSteps: steps.length,
      // Tüm adımlar tamamlandıysa %100 göster
      completedSteps: allCompleted ? steps.length : completedSteps,
    };
  }, [steps, currentStepIndex]);

  const handleStepComplete = useCallback(() => {
    const currentIndex = currentStepIndex;

    setSteps((prevSteps) => {
      const newSteps = [...prevSteps];
      newSteps[currentIndex] = {
        ...newSteps[currentIndex],
        completed: true,
      };
      return newSteps;
    });

    // Sonraki step'e geç (eğer son step değilse)
    if (currentIndex < steps.length - 1) {
      setTimeout(() => {
        setCurrentStepIndex((prev) => {
          // Eğer prev hala currentIndex ise, bir sonraki step'e geç
          if (prev === currentIndex) {
            return prev + 1;
          }
          return prev;
        });
      }, 1000);
    }
  }, [currentStepIndex, steps.length]);

  const currentStep = useMemo(
    () => steps[currentStepIndex],
    [steps, currentStepIndex]
  );

  const allCompleted = useMemo(
    () => steps.every((step) => step.completed),
    [steps]
  );

  // Completion message gösterildiğinde konfetiler ekle
  useEffect(() => {
    if (allCompleted) {
      const confettiArray = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color:
          CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      }));
      setConfetti(confettiArray);
    } else {
      setConfetti([]);
    }
  }, [allCompleted]);

  const handleCountdownComplete = useCallback(() => {
    setCountdownCompleted(true);
  }, []);


  const handleSurpriseClick = useCallback(() => {
    setShowSurprisePopup(true);
  }, []);

  const handleCloseSurprisePopup = useCallback(() => {
    setShowSurprisePopup(false);
  }, []);

  if (!countdownCompleted) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Yağmur'un Şifası 💙</h1>
          <Countdown onComplete={handleCountdownComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Yağmur'un Şifası 💙</h1>
        {!allCompleted && <ProgressBar progress={progress} />}
        {!allCompleted ? (
          <StepComponent step={currentStep} onComplete={handleStepComplete} />
        ) : (
          <>
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
            <div className={styles.completionMessage}>
              <ProgressBar progress={progress} />
              <h2>🎉 Bomba gibiyiz dimiiiii 🎉</h2>
              <p>
                Tüm adımları tamamladığın için tebrikler! Sen gerçekten harika
                birisin!
              </p>
              <button
                className={styles.surpriseButton}
                onClick={handleSurpriseClick}
              >
                Sürpriz 🎁
              </button>
            </div>

            {/* Sürpriz Popup */}
            {showSurprisePopup && (
              <div
                className={styles.surprisePopupOverlay}
                onClick={handleCloseSurprisePopup}
              >
                <div
                  className={styles.surprisePopupContent}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={styles.closePopupButton}
                    onClick={handleCloseSurprisePopup}
                  >
                    ✕
                  </button>
                  <div className={styles.surpriseImageContainer}>
                    <img
                      src="https://www.gather.com.tr/wp-content/uploads/2025/03/Taylot-Nedir.jpg"
                      alt="Sürpriz"
                      className={styles.surpriseImage}
                    />
                    <p className={styles.surpriseImageText}>
                      Severek içilen bir şey değil ki zaten
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
