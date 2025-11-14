import { memo } from 'react';
import { GameProps } from '../../interfaces/GameProps.interface';
import styles from '../../styles/MessageStep.module.css';

const MessageStep = memo(({ step, onComplete }: GameProps) => {
  return (
    <div className={styles.messageContainer}>
      <p className={styles.messageText}>{step.content}</p>
      <button className={styles.continueButton} onClick={onComplete}>
        Devam Et →
      </button>
    </div>
  );
});

MessageStep.displayName = 'MessageStep';

export default MessageStep;

