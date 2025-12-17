# Código Completo - Sistema de Cronómetros

## IMPORTANTE
Os ficheiros `contexts/TimerContext.tsx`, `components/AddTimerForm.tsx` e `app/projection/page.tsx` estão corrompidos.

Apague-os e recrie manualmente copiando o código abaixo.

## 1. contexts/TimerContext.tsx

```tsx
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
```

## 2. components/AddTimerForm.tsx

```tsx
'use client';

import { useState } from 'react';
import { useTimers } from '@/contexts/TimerContext';
import { TimerFormData } from '@/types/timer';

export default function AddTimerForm() {
  const { addTimer } = useTimers();
  const [formData, setFormData] = useState<TimerFormData>({
    name: '',
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSeconds = formData.hours * 3600 + formData.minutes * 60 + formData.seconds;
    
    if (totalSeconds > 0 && formData.name.trim()) {
      addTimer(formData.name, totalSeconds);
      setFormData({ name: '', hours: 0, minutes: 0, seconds: 0 });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border-2 border-gray-300">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Adicionar Cronómetro</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Nome:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border rounded text-gray-900"
          placeholder="Nome do cronómetro"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">Horas:</label>
          <input
            type="number"
            min="0"
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border rounded text-gray-900"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Minutos:</label>
          <input
            type="number"
            min="0"
            max="59"
            value={formData.minutes}
            onChange={(e) => setFormData({ ...formData, minutes: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border rounded text-gray-900"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Segundos:</label>
          <input
            type="number"
            min="0"
            max="59"
            value={formData.seconds}
            onChange={(e) => setFormData({ ...formData, seconds: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border rounded text-gray-900"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold"
      >
        Adicionar
      </button>
    </form>
  );
}
```

## 3. app/projection/page.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Timer } from '@/types/timer';
import TimerCard from '@/components/TimerCard';

export default function ProjectionPage() {
  const [timers, setTimers] = useState<Timer[]>([]);

  useEffect(() => {
    const loadTimers = () => {
      const saved = localStorage.getItem('timers');
      if (saved) {
        setTimers(JSON.parse(saved));
      }
    };

    loadTimers();
    const interval = setInterval(loadTimers, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-8 text-center">Cronómetros</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timers.map((timer) => (
            <TimerCard key={timer.id} timer={timer} showControls={false} />
          ))}
        </div>

        {timers.length === 0 && (
          <div className="text-center text-gray-400 mt-12">
            <p className="text-2xl">Nenhum cronómetro disponível</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Como corrigir:

1. Abra o VS Code
2. Apague os 3 ficheiros corrompidos manualmente
3. Crie ficheiros novos com os mesmos nomes
4. Copie e cole o código acima
5. Guarde tudo
6. Execute `npm run dev`
7. Abra `http://localhost:3000`

Os outros ficheiros (types/timer.ts, components/TimerCard.tsx, app/layout.tsx, app/page.tsx) estão correctos!
