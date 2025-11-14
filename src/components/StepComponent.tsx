import { memo } from 'react';
import { Step } from '../interfaces/Step.interface';
import { GameProps } from '../interfaces/GameProps.interface';
import MessageStep from './steps/MessageStep';
import GameStep from './steps/GameStep';
import PuzzleStep from './steps/PuzzleStep';
import SurpriseStep from './steps/SurpriseStep';
import styles from '../styles/StepComponent.module.css';

interface StepComponentProps {
  step: Step;
  onComplete: () => void;
}

const StepComponent = memo(({ step, onComplete }: StepComponentProps) => {
  const renderStepContent = () => {
    const stepProps: GameProps = {
      step,
      onComplete,
    };

    switch (step.type) {
      case 'message':
        return <MessageStep {...stepProps} />;
      case 'game':
        return <GameStep {...stepProps} />;
      case 'puzzle':
        return <PuzzleStep {...stepProps} />;
      case 'surprise':
        return <SurpriseStep {...stepProps} />;
      default:
        return <MessageStep {...stepProps} />;
    }
  };

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>{step.title}</h2>
      <p className={styles.stepDescription}>{step.description}</p>
      <div className={styles.stepContent}>{renderStepContent()}</div>
    </div>
  );
});

StepComponent.displayName = 'StepComponent';

export default StepComponent;

