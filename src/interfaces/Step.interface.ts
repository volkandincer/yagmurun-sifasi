export interface Step {
  id: number;
  title: string;
  description: string;
  type: 'message' | 'game' | 'puzzle' | 'surprise' | 'influenza' | 'spotify' | 'meeting' | 'chat' | 'recovery' | 'movies' | 'memories' | 'voice' | 'cinema';
  content: string;
  completed: boolean;
}

export interface StepProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
}

