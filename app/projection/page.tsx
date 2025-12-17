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
