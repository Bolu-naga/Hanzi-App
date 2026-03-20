'use client';

import { useRef, useEffect, useState } from 'react';
import HanziWriter from 'hanzi-writer';

interface WritingCanvasProps {
  hanzi: string;
  level?: number;
  onComplete?: () => void;
}

export default function WritingCanvas({ hanzi = '我', level = 1, onComplete }: WritingCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'neutral' | 'success' | 'error'>('neutral');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    let showOutline = true;
    let hintConfig: number | boolean = 1; 

    if (level === 1) {
      showOutline = true;
      hintConfig = 1;
      setMessage('👀 Perhatikan urutan goresannya, lalu ikuti!');
    } else if (level === 2) {
      showOutline = true;
      hintConfig = 3;
      setMessage('🤔 Coba ingat urutan garisnya...');
    } else if (level === 3) {
      showOutline = false;
      hintConfig = false; 
      setMessage('💪 Hebat! Sekarang tulis sendiri tanpa bantuan!');
    }

    const parentWidth = containerRef.current.parentElement?.clientWidth || 300;
    const canvasSize = Math.min(parentWidth - 16, 300); 

    writerRef.current = HanziWriter.create(containerRef.current, hanzi, {
      width: canvasSize,
      height: canvasSize,
      padding: 15,
      showOutline: showOutline,
      strokeAnimationSpeed: 1.5, // Kecepatan animasi goresan pas diputar
      delayBetweenStrokes: 300,
      strokeColor: '#0f172a',
      outlineColor: '#e2e8f0',
      showHintAfterMisses: hintConfig as any,
    });

    // Opsi untuk Kuis
    const quizOptions = {
      onMistake: () => {
        setStatus('error');
        setTimeout(() => setStatus('neutral'), 600);
      },
      onSuccess: () => setStatus('success'),
      onComplete: () => {
        setStatus('success');
        setMessage('🎉 Sempurna! Kamu pintar!');
        setTimeout(() => { if (onComplete) onComplete(); }, 1000);
      }
    };

    // LOGIC ANIMASI UNTUK LEVEL 1
    if (level === 1) {
      setIsAnimating(true);
      writerRef.current.animateCharacter({
        onComplete: () => {
          setIsAnimating(false);
          setMessage('🌟 Sekarang giliranmu, ikuti garisnya!');
          writerRef.current.quiz(quizOptions); // Mulai kuis SETELAH animasi selesai
        }
      });
    } else {
      // Level 2 & 3 langsung mulai kuis tanpa animasi
      writerRef.current.quiz(quizOptions);
    }

    return () => { if (containerRef.current) containerRef.current.innerHTML = ''; };
  }, [hanzi, level]);

  const resetQuiz = () => {
    if (writerRef.current && !isAnimating) {
      writerRef.current.quiz();
      setStatus('neutral');
    }
  };

  const playAnimation = () => {
    if (writerRef.current && !isAnimating) {
      setIsAnimating(true);
      writerRef.current.animateCharacter({
        onComplete: () => {
          setIsAnimating(false);
          writerRef.current.quiz(); // Aktifkan lagi kanvasnya setelah animasi kelar
        }
      });
    }
  };

  const borderColor = status === 'error' ? 'border-red-400 shadow-red-100' :
                      status === 'success' ? 'border-emerald-400 shadow-emerald-100' :
                      'border-slate-200 shadow-inner';

  const levelBadgeColor = level === 1 ? 'bg-sky-100 text-sky-700 border-sky-200' : 
                          level === 2 ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                          'bg-purple-100 text-purple-700 border-purple-200';

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto gap-3">
      <div className={`px-4 py-1.5 text-xs font-extrabold rounded-full border-2 ${levelBadgeColor} shadow-sm tracking-wide`}>
        TAHAP {level} / 3
      </div>

      <div className={`text-sm font-bold transition-colors duration-300 h-6 text-center ${status === 'error' ? 'text-red-500' : 'text-slate-600'}`}>
        {message}
      </div>

      <div className={`relative bg-white border-4 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl w-full aspect-square max-w-75px ${borderColor} ${status === 'error' ? 'animate-pulse' : ''}`} style={{ touchAction: 'none' }}>
        <div className="absolute inset-0 pointer-events-none opacity-30">
           <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-red-300"></div>
           <div className="absolute left-1/2 top-0 h-full border-l-2 border-dashed border-red-300"></div>
           <div className="absolute inset-0 border-2 border-red-100 rounded-2xl"></div>
        </div>
        <div ref={containerRef} className={`absolute inset-0 z-10 flex items-center justify-center ${isAnimating ? 'pointer-events-none' : 'cursor-crosshair'}`} />
      </div>

      <div className="flex gap-2 mt-1">
        {level < 3 && (
          <button onClick={playAnimation} disabled={isAnimating} className="px-4 py-2 text-xs font-bold text-sky-600 bg-sky-50 rounded-full hover:bg-sky-100 active:scale-95 transition-all border border-sky-200 disabled:opacity-50">
            ▶️ Putar Animasi
          </button>
        )}
        <button onClick={resetQuiz} disabled={isAnimating} className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-full hover:bg-slate-200 active:scale-95 transition-all border border-slate-200 disabled:opacity-50">
          🔄 Ulangi
        </button>
      </div>
    </div>
  );
}