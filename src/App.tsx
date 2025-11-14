import { useState, useCallback, useMemo } from "react";
import { Step } from "./interfaces/Step.interface";
import { StepProgress } from "./interfaces/Step.interface";
import ProgressBar from "./components/ProgressBar";
import StepComponent from "./components/StepComponent";
import Countdown from "./components/Countdown";
import styles from "./styles/App.module.css";

const INITIAL_STEPS: Step[] = [
  {
    id: 1,
    title: "Hoş Geldin Yağmur! 💙",
    description: "Senin için özel bir yolculuk hazırladım",
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
      "Aşağıdaki butona bas ve pozitif enerji topla! Her tıklamada daha güçlü olacaksın!",
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
    title: "Renkli Bulmaca 🎨",
    description: "Renkleri eşleştir ve puan kazan!",
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
      "Kahveni yapıp bu özel şarkıları dinleyerek pinekle. Bu şarkılar senin için seçildi!",
    completed: false,
  },
  {
    id: 7,
    title: "Sürpriz Mesaj 🎁",
    description: "Son adımda özel bir sürpriz seni bekliyor!",
    type: "surprise",
    content:
      "Tebrikler Yağmur! Tüm adımları tamamladın! Sen harika birisin ve çok seviliyorsun. Hızlıca iyileşmen dileğiyle! 💙",
    completed: false,
  },
];

function App() {
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [countdownCompleted, setCountdownCompleted] = useState<boolean>(false);

  const progress: StepProgress = useMemo(() => {
    const completedSteps = steps.filter((step) => step.completed).length;
    return {
      currentStep: currentStepIndex + 1,
      totalSteps: steps.length,
      completedSteps,
    };
  }, [steps, currentStepIndex]);

  const handleStepComplete = useCallback(() => {
    setSteps((prevSteps) => {
      const newSteps = [...prevSteps];
      newSteps[currentStepIndex] = {
        ...newSteps[currentStepIndex],
        completed: true,
      };
      return newSteps;
    });

    if (currentStepIndex < steps.length - 1) {
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
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

  const handleCountdownComplete = useCallback(() => {
    setCountdownCompleted(true);
  }, []);

  const handleRestart = useCallback(() => {
    setSteps(INITIAL_STEPS);
    setCurrentStepIndex(0);
    setCountdownCompleted(false);
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
        <ProgressBar progress={progress} />
        {!allCompleted ? (
          <StepComponent step={currentStep} onComplete={handleStepComplete} />
        ) : (
          <div className={styles.completionMessage}>
            <h2>🎉 Harika İş Çıkardın Yağmur! 🎉</h2>
            <p>Tüm adımları tamamladın! Sen gerçekten harika birisin!</p>
            <button className={styles.restartButton} onClick={handleRestart}>
              Tekrar Oyna
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
