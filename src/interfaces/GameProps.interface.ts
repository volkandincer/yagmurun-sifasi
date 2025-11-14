import { Step } from './Step.interface';

export interface GameProps {
  step: Step;
  onComplete: () => void;
}

