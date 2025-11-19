import { memo, useState, useCallback } from 'react';
import { GameProps } from '../../interfaces/GameProps.interface';
import styles from '../../styles/VoiceStep.module.css';

const VoiceStep = memo(({ onComplete }: GameProps) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [hasRecorded, setHasRecorded] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);

  const handleStartRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Simüle edilmiş kayıt (gerçek ses kaydı için MediaRecorder API kullanılabilir)
    const interval = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 10) {
          clearInterval(interval);
          setIsRecording(false);
          setHasRecorded(true);
          return 10;
        }
        return prev + 1;
      });
    }, 1000);

    // 3 saniye sonra otomatik durdur (test için)
    setTimeout(() => {
      clearInterval(interval);
      setIsRecording(false);
      setHasRecorded(true);
      setRecordingTime(3);
    }, 3000);
  }, []);

  const handleSend = useCallback(() => {
    setTimeout(() => {
      onComplete();
    }, 1000);
  }, [onComplete]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.introText}>
          Öksürüğün varsa yazmak zor olabilir. Burada sesli mesaj gönderebilirsin
          (şimdilik simüle edilmiş) 💙
        </p>

        <div className={styles.voiceContainer}>
          {!hasRecorded ? (
            <>
              <div className={styles.recordingArea}>
                <button
                  className={`${styles.recordButton} ${
                    isRecording ? styles.recording : ''
                  }`}
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  type="button"
                >
                  {isRecording ? (
                    <>
                      <span className={styles.recordingDot}></span>
                      <span>Kaydediliyor... {recordingTime}s</span>
                    </>
                  ) : (
                    <>
                      <span className={styles.micIcon}>🎤</span>
                      <span>Sesli Mesaj Kaydet</span>
                    </>
                  )}
                </button>
              </div>
              {isRecording && (
                <p className={styles.recordingHint}>
                  Kayıt yapılıyor... (Test için 3 saniye sonra otomatik durur)
                </p>
              )}
            </>
          ) : (
            <div className={styles.recordedMessage}>
              <div className={styles.recordedIcon}>✅</div>
              <p className={styles.recordedText}>
                Sesli mesaj kaydedildi! ({recordingTime} saniye)
              </p>
              <button
                className={styles.sendButton}
                onClick={handleSend}
                type="button"
              >
                Gönder 💙
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

VoiceStep.displayName = 'VoiceStep';

export default VoiceStep;

