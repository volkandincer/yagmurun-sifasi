import { memo } from 'react';
import { StepProgress } from '../interfaces/Step.interface';
import styles from '../styles/ProgressBar.module.css';

interface ProgressBarProps {
  progress: StepProgress;
}

const ProgressBar = memo(({ progress }: ProgressBarProps) => {
  // Progress: tamamlanan adımlar / toplam adım
  const percentage = (progress.completedSteps / progress.totalSteps) * 100;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressInfo}>
        <span className={styles.progressText}>
          Adım {progress.currentStep} / {progress.totalSteps}
        </span>
        <span className={styles.progressPercentage}>{Math.round(percentage)}%</span>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;

