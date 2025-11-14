import { useState, useCallback, useMemo } from 'react';
import { Step } from './interfaces/Step.interface';
import { StepProgress } from './interfaces/Step.interface';
import ProgressBar from './components/ProgressBar';
import StepComponent from './components/StepComponent';
import styles from './styles/App.module.css';

const INITIAL_STEPS: Step[] = [
  {
    id: 1,
    title: 'Hoş Geldin Yağmur! 💙',
    description: 'Senin için özel bir yolculuk hazırladık',
    type: 'message',
    content: 'Merhaba Yağmur! Seni çok özledik ve senin için özel bir şeyler hazırladık. Her adımda seni gülümsetecek sürprizler var!',
    completed: false,
  },
  {
    id: 2,
    title: 'Pozitif Enerji Toplama 🌟',
    description: 'Bu butona bas ve pozitif enerji topla!',
    type: 'game',
    content: 'Aşağıdaki butona bas ve pozitif enerji topla! Her tıklamada daha güçlü olacaksın!',
    completed: false,
  },
  {
    id: 3,
    title: 'Şifa Mesajları 💐',
    description: 'Senin için özel mesajlar',
    type: 'message',
    content: 'Çok güçlüsün Yağmur! Bu zorlu günleri atlatacak ve daha güçlü olacaksın. Seni seven herkes yanında!',
    completed: false,
  },
  {
    id: 4,
    title: 'Renkli Bulmaca 🎨',
    description: 'Renkleri eşleştir ve puan kazan!',
    type: 'puzzle',
    content: 'Renkleri eşleştirerek puan kazan! Her eşleşme seni bir adım daha ileri götürecek.',
    completed: false,
  },
  {
    id: 5,
    title: 'Sürpriz Mesaj 🎁',
    description: 'Son adımda özel bir sürpriz seni bekliyor!',
    type: 'surprise',
    content: 'Tebrikler Yağmur! Tüm adımları tamamladın! Sen harika birisin ve çok seviliyorsun. Hızlıca iyileşmen dileğiyle! 💙',
    completed: false,
  },
];

function App() {
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

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

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Yağmur'un Şifası 💙</h1>
        <ProgressBar progress={progress} />
        {!allCompleted ? (
          <StepComponent
            step={currentStep}
            onComplete={handleStepComplete}
          />
        ) : (
          <div className={styles.completionMessage}>
            <h2>🎉 Harika İş Çıkardın Yağmur! 🎉</h2>
            <p>Tüm adımları tamamladın! Sen gerçekten harika birisin!</p>
            <button
              className={styles.restartButton}
              onClick={() => {
                setSteps(INITIAL_STEPS);
                setCurrentStepIndex(0);
              }}
            >
              Tekrar Oyna
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

