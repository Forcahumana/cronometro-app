export type TimerStatus = 'paused' | 'running' | 'finished';

export interface Timer {
  id: string;
  name: string;
  totalSeconds: number;
  remainingSeconds: number;
  status: TimerStatus;
}

export interface TimerFormData {
  name: string;
  hours: number;
  minutes: number;
  seconds: number;
}
