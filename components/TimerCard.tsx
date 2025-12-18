'use client';

import { Timer } from '@/types/timer';
import { useTimers } from '@/contexts/TimerContext';
import { useState } from 'react';

interface TimerCardProps {
  timer: Timer;
  showControls?: boolean;
}

export default function TimerCard({ timer, showControls = true }: TimerCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editHours, setEditHours] = useState(0);
  const [editMinutes, setEditMinutes] = useState(0);
  const [editSeconds, setEditSeconds] = useState(0);

  // Only use context if controls are shown
  const context = showControls ? useTimers() : null;
  const { startTimer, pauseTimer, resetTimer, removeTimer, updateTimer } = context || {
    startTimer: () => {},
    pauseTimer: () => {},
    resetTimer: () => {},
    removeTimer: () => {},
    updateTimer: () => {},
  };

  const openEditModal = () => {
    const absSeconds = Math.abs(timer.remainingSeconds);
    const h = Math.floor(absSeconds / 3600);
    const m = Math.floor((absSeconds % 3600) / 60);
    const s = absSeconds % 60;
    setEditHours(h);
    setEditMinutes(m);
    setEditSeconds(s);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    const totalSeconds = editHours * 3600 + editMinutes * 60 + editSeconds;
    await updateTimer(timer.id, totalSeconds);
    setIsEditing(false);
  };

  const formatTime = (seconds: number) => {
    const isNegative = seconds < 0;
    const absSeconds = Math.abs(seconds);
    const h = Math.floor(absSeconds / 3600);
    const m = Math.floor((absSeconds % 3600) / 60);
    const s = absSeconds % 60;
    const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return isNegative ? `-${time}` : time;
  };

  const getStatusColor = () => {
    if (timer.remainingSeconds < 0) return 'bg-red-600'; // Vermelho escuro para negativo
    if (timer.status === 'finished') return 'bg-red-500';
    if (timer.status === 'running') return 'bg-green-500';
    return 'bg-gray-500';
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${
      timer.remainingSeconds < 0 ? 'border-red-600 bg-red-100' :
      timer.status === 'finished' ? 'border-red-500 bg-red-50' : 
      'border-gray-300 bg-white'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{timer.name}</h3>
        <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor()}`}>
          {timer.status}
        </span>
      </div>
      
      <div className="text-5xl font-mono font-bold text-center my-6 text-gray-900">
        {formatTime(timer.remainingSeconds)}
      </div>

      {showControls && (
        <>
          <div className="flex gap-2 mt-4">
            {timer.status === 'running' ? (
              <button
                onClick={() => pauseTimer(timer.id)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Pausar
              </button>
            ) : (
              <button
                onClick={() => startTimer(timer.id)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                disabled={timer.status === 'finished'}
              >
                Iniciar
              </button>
            )}
            <button
              onClick={() => resetTimer(timer.id)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Reiniciar
            </button>
            <button
              onClick={openEditModal}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            >
              ✏️
            </button>
            <button
              onClick={() => removeTimer(timer.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Remover
            </button>
          </div>

          {/* Modal de Edição */}
          {isEditing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96">
                <h3 className="text-xl font-bold mb-4">Editar Tempo</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Horas</label>
                    <input
                      type="number"
                      min="0"
                      value={editHours}
                      onChange={(e) => setEditHours(parseInt(e.target.value) || 0)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Minutos</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={editMinutes}
                      onChange={(e) => setEditMinutes(parseInt(e.target.value) || 0)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Segundos</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={editSeconds}
                      onChange={(e) => setEditSeconds(parseInt(e.target.value) || 0)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
