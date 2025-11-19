import { memo } from 'react';
import { Step } from '../interfaces/Step.interface';
import { GameProps } from '../interfaces/GameProps.interface';
import MessageStep from './steps/MessageStep';
import GameStep from './steps/GameStep';
import PuzzleStep from './steps/PuzzleStep';
import SurpriseStep from './steps/SurpriseStep';
import InfluenzaStep from './steps/InfluenzaStep';
import SpotifyStep from './steps/SpotifyStep';
import MeetingStep from './steps/MeetingStep';
import ChatStep from './steps/ChatStep';
import RecoveryStep from './steps/RecoveryStep';
import MoviesStep from './steps/MoviesStep';
import MemoriesStep from './steps/MemoriesStep';
import VoiceStep from './steps/VoiceStep';
import CinemaStep from './steps/CinemaStep';
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
      case 'influenza':
        return <InfluenzaStep {...stepProps} />;
      case 'spotify':
        return <SpotifyStep {...stepProps} />;
      case 'meeting':
        return <MeetingStep {...stepProps} />;
      case 'chat':
        return <ChatStep {...stepProps} />;
      case 'recovery':
        return <RecoveryStep {...stepProps} />;
      case 'movies':
        return <MoviesStep {...stepProps} />;
      case 'memories':
        return <MemoriesStep {...stepProps} />;
      case 'voice':
        return <VoiceStep {...stepProps} />;
      case 'cinema':
        return <CinemaStep {...stepProps} />;
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

