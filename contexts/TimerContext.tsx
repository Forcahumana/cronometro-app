'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Timer, TimerDB } from '@/types/timer';
import { supabase } from '@/lib/supabase';

interface TimerContextType {
  timers: Timer[];
  addTimer: (name: string, totalSeconds: number) => Promise<void>;
  removeTimer: (id: string) => Promise<void>;
  startTimer: (id: string) => Promise<void>;
  pauseTimer: (id: string) => Promise<void>;
  resetTimer: (id: string) => Promise<void>;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

// Converter de DB para App
const dbToTimer = (dbTimer: TimerDB): Timer => ({
  id: dbTimer.id,
  name: dbTimer.name,
  totalSeconds: dbTimer.total_seconds,
  remainingSeconds: dbTimer.remaining_seconds,
  status: dbTimer.status,
  created_at: dbTimer.created_at,
  updated_at: dbTimer.updated_at,
});

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timers, setTimers] = useState<Timer[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar timers do Supabase
  const loadTimers = async () => {
    try {
      const { data, error } = await supabase
        .from('timers')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar cronómetros:', error);
        console.error('Detalhes do erro:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return;
      }

      if (data) {
        console.log('Cronómetros carregados:', data.length);
        setTimers(data.map(dbToTimer));
      }
    } catch (err) {
      console.error('Erro ao conectar com Supabase:', err);
    }
  };

  useEffect(() => {
    loadTimers();

    // Subscrever a mudanças em tempo real
    const channel = supabase
      .channel('timers-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'timers' },
        () => {
          loadTimers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      setTimers((prevTimers) => {
        const updatedTimers = prevTimers.map((timer) => {
          if (timer.status === 'running') {
            const newRemaining = timer.remainingSeconds - 1;
            const newStatus: Timer['status'] = 'running'; // Mantém sempre 'running', não muda para 'finished'
            
            // Atualizar no Supabase
            supabase
              .from('timers')
              .update({
                remaining_seconds: newRemaining,
                status: newStatus,
              })
              .eq('id', timer.id)
              .then(({ error }) => {
                if (error) console.error('Erro ao atualizar:', error);
              });

            return { ...timer, remainingSeconds: newRemaining, status: newStatus };
          }
          return timer;
        });
        return updatedTimers;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const addTimer = async (name: string, totalSeconds: number) => {
    const newTimer = {
      name,
      total_seconds: totalSeconds,
      remaining_seconds: totalSeconds,
      status: 'paused' as const,
    };

    const { data: inserted, error } = await supabase
      .from('timers')
      .insert([newTimer])
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar:', error);
      return;
    }

    if (inserted) {
      setTimers((prev) => [...prev, dbToTimer(inserted)]);
    }
  };

  const removeTimer = async (id: string) => {
    const { error } = await supabase
      .from('timers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar:', error);
      return;
    }

    setTimers((prev) => prev.filter((timer) => timer.id !== id));
  };

  const startTimer = async (id: string) => {
    const { error } = await supabase
      .from('timers')
      .update({ status: 'running' })
      .eq('id', id);

    if (error) {
      console.error('Erro ao iniciar:', error);
      return;
    }

    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id ? { ...timer, status: 'running' as const } : timer
      )
    );
  };

  const pauseTimer = async (id: string) => {
    const { error } = await supabase
      .from('timers')
      .update({ status: 'paused' })
      .eq('id', id);

    if (error) {
      console.error('Erro ao pausar:', error);
      return;
    }

    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id ? { ...timer, status: 'paused' as const } : timer
      )
    );
  };

  const resetTimer = async (id: string) => {
    const timer = timers.find((t) => t.id === id);
    if (!timer) return;

    const { error } = await supabase
      .from('timers')
      .update({
        remaining_seconds: timer.totalSeconds,
        status: 'paused',
      })
      .eq('id', id);

    if (error) {
      console.error('Erro ao resetar:', error);
      return;
    }

    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, remainingSeconds: t.totalSeconds, status: 'paused' as const }
          : t
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
