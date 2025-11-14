export interface EnergyType {
  name: string;
  emoji: string;
  color: string;
}

export const ENERGY_TYPES: readonly EnergyType[] = [
  { name: 'Pozitif', emoji: '✨', color: '#667eea' },
  { name: 'Güç', emoji: '💪', color: '#764ba2' },
  { name: 'Umut', emoji: '🌟', color: '#f093fb' },
  { name: 'Sevgi', emoji: '💙', color: '#4facfe' },
] as const;

