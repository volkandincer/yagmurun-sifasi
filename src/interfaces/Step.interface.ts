export interface Step {
  id: number;
  title: string;
  description: string;
  type: 'message' | 'game' | 'puzzle' | 'surprise';
  content: string;
  completed: boolean;
}

export interface StepProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
}

