'use client';

import { useState, useEffect } from 'react';
import { Timer } from '@/types/timer';

export default function ProjectionPage() {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (timer: Timer) => {
    if (timer.status === 'finished') return 'from-red-600 to-red-800';
    if (timer.status === 'running') return 'from-emerald-600 to-green-700';
    return 'from-gray-600 to-gray-800';
  };

  const getTimerBorder = (timer: Timer) => {
    if (timer.status === 'finished') return 'border-red-500 shadow-red-500/50';
    if (timer.status === 'running') return 'border-green-500 shadow-green-500/50 animate-pulse';
    return 'border-gray-600';
  };

  const getStatusIcon = (status: Timer['status']) => {
    if (status === 'finished') return '⏹️';
    if (status === 'running') return '▶️';
    return '⏸️';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8 relative overflow-hidden">
      {/* Background animated circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-2">
              Cronómetros
            </h1>
            <p className="text-gray-400 text-lg">Apresentação em Tempo Real</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-white font-mono">
              {currentTime.toLocaleTimeString('pt-PT')}
            </div>
            <div className="text-gray-400 text-sm">
              {currentTime.toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full"></div>
      </div>

      {/* Timers Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {timers.map((timer) => (
          <div
            key={timer.id}
            className={`relative backdrop-blur-sm bg-gradient-to-br ${getTimerColor(timer)} p-8 rounded-3xl border-2 ${getTimerBorder(timer)} shadow-2xl transition-all duration-300 hover:scale-105`}
          >
            {/* Timer Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{getStatusIcon(timer.status)}</span>
                <h2 className="text-3xl font-bold text-white truncate">{timer.name}</h2>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-300 uppercase tracking-wider">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  timer.status === 'finished' ? 'bg-red-500' :
                  timer.status === 'running' ? 'bg-green-500' :
                  'bg-gray-500'
                } text-white`}>
                  {timer.status === 'finished' ? 'TERMINADO' :
                   timer.status === 'running' ? 'EM EXECUÇÃO' :
                   'PAUSADO'}
                </span>
              </div>
            </div>

            {/* Timer Display */}
            <div className="relative">
              <div className="text-8xl font-black text-white text-center font-mono tracking-wider mb-4 drop-shadow-2xl">
                {formatTime(timer.remainingSeconds)}
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-3 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className={`h-full transition-all duration-1000 ease-linear ${
                    timer.status === 'finished' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                    timer.status === 'running' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                    'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}
                  style={{
                    width: `${((timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds) * 100}%`
                  }}
                >
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>

              {/* Time Info */}
              <div className="flex justify-between mt-4 text-sm text-gray-300">
                <span>Início: {formatTime(timer.totalSeconds)}</span>
                <span>Restante: {formatTime(timer.remainingSeconds)}</span>
              </div>
            </div>

            {/* Glow Effect for Running Timers */}
            {timer.status === 'running' && (
              <div className="absolute inset-0 rounded-3xl bg-green-500/20 blur-xl -z-10 animate-pulse"></div>
            )}
            
            {/* Glow Effect for Finished Timers */}
            {timer.status === 'finished' && (
              <div className="absolute inset-0 rounded-3xl bg-red-500/20 blur-xl -z-10 animate-pulse"></div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {timers.length === 0 && (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-9xl mb-8 animate-bounce">⏱️</div>
          <h2 className="text-4xl font-bold text-gray-400 mb-4">Nenhum Cronómetro Ativo</h2>
          <p className="text-xl text-gray-500">Adicione cronómetros na página de controlo para começar</p>
        </div>
      )}
    </div>
  );
}
