export type TabType = 'healing' | 'meeting' | 'chat' | 'recovery' | 'memories';

export interface Tab {
  id: TabType;
  label: string;
  icon: string;
}

