'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Timer } from '@/types/timer';

interface TimerContextType {
  timers: Timer[];
  addTimer: (name: string, totalSeconds: number) => void;
  removeTimer: (id: string) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  resetTimer: (id: string) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timers, setTimers] = useState<Timer[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('timers');
    if (saved) {
      setTimers(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(timers));
  }, [timers]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          if (timer.status === 'running' && timer.remainingSeconds > 0) {
            const newRemaining = timer.remainingSeconds - 1;
            return {
              ...timer,
              remainingSeconds: newRemaining,
              status: newRemaining === 0 ? 'finished' : 'running',
            };
          }
          return timer;
        })
      );
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const addTimer = (name: string, totalSeconds: number) => {
    const newTimer: Timer = {
      id: Date.now().toString(),
      name,
      totalSeconds,
      remainingSeconds: totalSeconds,
      status: 'paused',
    };
    setTimers((prev) => [...prev, newTimer]);
  };

  const removeTimer = (id: string) => {
    setTimers((prev) => prev.filter((timer) => timer.id !== id));
  };

  const startTimer = (id: string) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id ? { ...timer, status: 'running' as const } : timer
      )
    );
  };

  const pauseTimer = (id: string) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id ? { ...timer, status: 'paused' as const } : timer
      )
    );
  };

  const resetTimer = (id: string) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id
          ? { ...timer, remainingSeconds: timer.totalSeconds, status: 'paused' as const }
          : timer
      )
    );
  };

  return (
    <TimerContext.Provider
      value={{ timers, addTimer, removeTimer, startTimer, pauseTimer, resetTimer }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimers() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimers must be used within TimerProvider');
  }
  return context;
}
