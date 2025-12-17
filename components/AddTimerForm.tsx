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
