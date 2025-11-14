import { memo, useState } from 'react';
import { GameProps } from '../../interfaces/GameProps.interface';
import styles from '../../styles/MessageStep.module.css';

const MessageStep = memo(({ step, onComplete }: GameProps) => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const isFirstStep = step.id === 1;

  const handleContinueClick = () => {
    if (isFirstStep && !showConfirmation) {
      setShowConfirmation(true);
    } else {
      onComplete();
    }
  };

  if (isFirstStep && showConfirmation) {
    return (
      <div className={styles.messageContainer}>
        <p className={styles.confirmationQuestion}>Emin misin?</p>
        <div className={styles.confirmationButtons}>
          <button
            className={styles.confirmButtonRed}
            onClick={handleContinueClick}
          >
            Evet
          </button>
          <button
            className={styles.confirmButtonGreen}
            onClick={handleContinueClick}
          >
            Evet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.messageContainer}>
      <p className={styles.messageText}>{step.content}</p>
      <button className={styles.continueButton} onClick={handleContinueClick}>
        Devam Et →
      </button>
    </div>
  );
});

MessageStep.displayName = 'MessageStep';

export default MessageStep;

