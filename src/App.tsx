import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Step } from "./interfaces/Step.interface";
import { StepProgress } from "./interfaces/Step.interface";
import ProgressBar from "./components/ProgressBar";
import StepComponent from "./components/StepComponent";
import Countdown from "./components/Countdown";
import styles from "./styles/App.module.css";
import { saveUserSession, updateUserSession } from "./lib/supabase";

const CONFETTI_COLORS = [
  "#667eea",
  "#764ba2",
  "#f093fb",
  "#4facfe",
  "#43e97b",
  "#fa709a",
];

const SPOTIFY_PLAYLIST_URL =
  "https://open.spotify.com/playlist/1dCuwsILd6q5vB9Mb32UNO?si=b4fd2824c0614162&pt=0e79c72f8ee647749eeae09b70c04cfd";

const INITIAL_STEPS: Step[] = [
  {
    id: 1,
    title: "Hoş Geldin Yağmur! 💙",
    description: "İyileşmeni dört gözle bekliyoruzzzzz",
    type: "message",
    content:
      "umarım keyfin yerine gelir. Her adımda karşına çıkacak küçük sürprizlerin yüzünde bir gülümseme bırakması dileğiyle…",
    completed: false,
  },
  {
    id: 2,
    title: "İyileşme Takibi 📊",
    description: "Bugün nasıl hissediyorsun?",
    type: "recovery",
    content:
      "İyileşme sürecini takip edelim. Bugün nasıl hissediyorsun? Öksürük, halsizlik, hapşırma, koku ve tat durumunu paylaş 💙",
    completed: false,
  },
  {
    id: 3,
    title: "Film & Dizi Önerileri 🎬📺",
    description: "Zamanında izlediklerim... belki izlememişsindir umuduyla :D",
    type: "movies",
    content:
      "Durumunu öğrendik, şimdi iyileşme sürecinde izleyebileceğin özel önerilerim var! 💙",
    completed: false,
  },
  {
    id: 4,
    title: "Sinemaya Gidelim 🎬",
    description: "Birlikte film izleyelim",
    type: "cinema",
    content:
      "Sinemaya gidecektin ama hastalandığın için gidemedin. Hala gitmediysen, birlikte gidebiliriz! Film ve seans seçimi yapalım 💙",
    completed: false,
  },
  {
    id: 5,
    title: "Gidemediğimiz yerlere hala gidemiyoruz 🎨",
    description: "O yüzden mekanları eşleştiriyoruz laksfşalsfş",
    type: "puzzle",
    content:
      "Gidemediğimiz yerlere hala gidemiyoruz. Mekanları eşleştir! Her eşleşme seni bir adım daha ileri götürecek.",
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
];

function App() {
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [countdownCompleted, setCountdownCompleted] = useState<boolean>(false);
  const [confetti, setConfetti] = useState<
    Array<{ id: number; x: number; color: string }>
  >([]);
  const sessionIdRef = useRef<string | null>(null);

  const progress: StepProgress = useMemo(() => {
    const completedSteps = steps.filter((step) => step.completed).length;
    const allCompleted = steps.every((step) => step.completed);
    return {
      currentStep: currentStepIndex + 1,
      totalSteps: steps.length,
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

      // Session'ı güncelle
      if (sessionIdRef.current) {
        const completedStepIds = newSteps
          .filter((step) => step.completed)
          .map((step) => step.id);
        updateUserSession(sessionIdRef.current, completedStepIds);
      }

      return newSteps;
    });

    if (currentIndex < steps.length - 1) {
      setTimeout(() => {
        setCurrentStepIndex((prev) => {
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

  const handleCountdownComplete = useCallback(async () => {
    setCountdownCompleted(true);

    // İlk session'ı oluştur
    const sessionId = `session-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    sessionIdRef.current = sessionId;

    await saveUserSession({
      session_id: sessionId,
      completed_steps: [],
      total_steps: INITIAL_STEPS.length,
    });
  }, []);

  if (!countdownCompleted) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>bakalım yüzde kaç daha iyisin...</h1>
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
              <div className={styles.completionIcon}>✨</div>
              <h2>
                Bir ilerleme daha kaydettin! 😄🎉 Kendini tebrik edebilirsin. 🎉
              </h2>
              <p className={styles.completionMainText}>
                Tüm adımları tamamladığın için tebrikler! Artık tamamen
                iyileştin ve birlikte harika şeyler yapmaya hazırız.
              </p>
              <a
                href={SPOTIFY_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.spotifyButton}
              >
                <span className={styles.spotifyIcon}>🎵</span>
                Spotify'da Aç
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
