'use client';

import { TimerProvider, useTimers } from '@/contexts/TimerContext';
import TimerCard from '@/components/TimerCard';
import AddTimerForm from '@/components/AddTimerForm';
import Link from 'next/link';

function ControlPage() {
  const { timers } = useTimers();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Controlo de Cronómetros</h1>
          <Link 
            href="/projection"
            target="_blank"
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded font-semibold"
          >
            Abrir Projeção
          </Link>
        </div>

        <div className="mb-8">
          <AddTimerForm />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {timers.map((timer) => (
            <TimerCard key={timer.id} timer={timer} showControls={true} />
          ))}
        </div>

        {timers.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <p className="text-xl">Nenhum cronómetro adicionado ainda.</p>
            <p className="mt-2">Utilize o formulário acima para adicionar um novo cronómetro.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <TimerProvider>
      <ControlPage />
    </TimerProvider>
  );
}
