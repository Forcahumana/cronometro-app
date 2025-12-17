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
    if (timer.status === 'finished') return 'from-rose-500 to-pink-600';
    if (timer.status === 'running') return 'from-cyan-500 to-blue-600';
    return 'from-slate-600 to-slate-800';
  };

  const getTimerBorder = (timer: Timer) => {
    if (timer.status === 'finished') return 'border-rose-400 shadow-rose-400/50';
    if (timer.status === 'running') return 'border-cyan-400 shadow-cyan-400/50 animate-pulse';
    return 'border-slate-500';
  };

  const getStatusIcon = (status: Timer['status']) => {
    if (status === 'finished') return '⏹️';
    if (status === 'running') return '▶️';
    return '⏸️';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-8 relative overflow-hidden">
      {/* Background animated circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 mb-2">
              Cronómetros
            </h1>
            <p className="text-gray-400 text-base md:text-lg">Apresentação em Tempo Real</p>
          </div>
          <div className="text-center lg:text-right">
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-mono">
              {currentTime.toLocaleTimeString('pt-PT')}
            </div>
            <div className="text-gray-400 text-xs md:text-sm whitespace-nowrap">
              {currentTime.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full"></div>
      </div>

      {/* Timers Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {timers.map((timer) => (
          <div
            key={timer.id}
            className={`relative backdrop-blur-sm bg-gradient-to-br ${getTimerColor(timer)} p-6 rounded-2xl border-2 ${getTimerBorder(timer)} shadow-2xl transition-all duration-300 hover:scale-105`}
          >
            {/* Timer Header */}
            <div className="flex items-start justify-between mb-4 gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-2xl md:text-3xl flex-shrink-0">{getStatusIcon(timer.status)}</span>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white truncate">{timer.name}</h2>
              </div>
              <div className="flex flex-col items-end flex-shrink-0">
                <span className="text-xs text-gray-300 uppercase tracking-wider">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                  timer.status === 'finished' ? 'bg-rose-500' :
                  timer.status === 'running' ? 'bg-cyan-500' :
                  'bg-slate-500'
                } text-white`}>
                  {timer.status === 'finished' ? 'TERMINADO' :
                   timer.status === 'running' ? 'A DECORRER' :
                   'PAUSADO'}
                </span>
              </div>
            </div>

            {/* Timer Display */}
            <div className="relative">
              <div className="text-5xl md:text-6xl lg:text-7xl font-black text-white text-center font-mono tracking-wider mb-4 drop-shadow-2xl break-all">
                {formatTime(timer.remainingSeconds)}
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-2 md:h-3 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm mb-3">
                <div
                  className={`h-full transition-all duration-1000 ease-linear ${
                    timer.status === 'finished' ? 'bg-gradient-to-r from-rose-400 to-pink-500' :
                    timer.status === 'running' ? 'bg-gradient-to-r from-cyan-400 to-blue-500' :
                    'bg-gradient-to-r from-slate-400 to-slate-500'
                  }`}
                  style={{
                    width: `${((timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds) * 100}%`
                  }}
                >
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>

              {/* Time Info */}
              <div className="flex justify-between text-xs md:text-sm text-gray-300">
                <span className="truncate">Total: {formatTime(timer.totalSeconds)}</span>
                <span className="truncate ml-2">Resta: {formatTime(timer.remainingSeconds)}</span>
              </div>
            </div>

            {/* Glow Effect for Running Timers */}
            {timer.status === 'running' && (
              <div className="absolute inset-0 rounded-2xl bg-cyan-500/20 blur-xl -z-10 animate-pulse"></div>
            )}
            
            {/* Glow Effect for Finished Timers */}
            {timer.status === 'finished' && (
              <div className="absolute inset-0 rounded-2xl bg-rose-500/20 blur-xl -z-10 animate-pulse"></div>
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
