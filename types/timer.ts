export type TimerStatus = 'paused' | 'running' | 'finished';

export interface Timer {
  id: string;
  name: string;
  totalSeconds: number;
  remainingSeconds: number;
  status: TimerStatus;
  created_at?: string;
  updated_at?: string;
}

export interface TimerFormData {
  name: string;
  hours: number;
  minutes: number;
  seconds: number;
}

// Interface para o Supabase (snake_case)
export interface TimerDB {
  id: string;
  name: string;
  total_seconds: number;
  remaining_seconds: number;
  status: TimerStatus;
  created_at?: string;
  updated_at?: string;
}
