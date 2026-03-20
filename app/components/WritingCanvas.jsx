'use client';

import { useRef, useEffect, useState } from 'react';
import HanziWriter from 'hanzi-writer';

export default function WritingCanvas({ character = '我', level = 1, onFinishCharacter }) {
  const containerRef = useRef(null);
  const writerRef = useRef(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('neutral'); // neutral, success, error

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    let showOutline = true;
    let hintConfig = 1; 

    if (level === 1) {
      showOutline = true;
      hintConfig = 1;
      setMessage('🌟 Ikuti garis bayangannya ya!');
    } else if (level === 2) {
      showOutline = true;
      hintConfig = 3;
      setMessage('🤔 Coba ingat urutan garisnya...');
    } else if (level === 3) {
      showOutline = false;
      hintConfig = false; 
      setMessage('💪 Hebat! Sekarang tulis sendiri tanpa bantuan!');
    }

    // RESPONSIVE FIX: Mendapatkan ukuran kontainer induk
    const parentWidth = containerRef.current.parentElement.clientWidth;
    // Gunakan ukuran parent tapi batasi maksimal 300px agar tidak terlalu besar di tablet
    const canvasSize = Math.min(parentWidth - 16, 300); 

    writerRef.current = HanziWriter.create(containerRef.current, character, {
      width: canvasSize,
      height: canvasSize,
      padding: 15, // Padding sedikit dikurangi agar Hanzi lebih besar
      showOutline: showOutline,
      strokeAnimationSpeed: 2,
      delayBetweenStrokes: 500,
      strokeColor: '#0f172a', // Tinta Hitam Pekat
      outlineColor: '#e2e8f0', // Bayangan Abu-abu Terang
      showHintAfterMisses: hintConfig,
    });

    writerRef.current.quiz({
      onMistake: () => {
        setStatus('error');
        setTimeout(() => setStatus('neutral'), 600);
      },
      onSuccess: () => {
        setStatus('success');
      },
      onComplete: () => {
        setStatus('success');
        setMessage('🎉 Sempurna! Kamu pintar!');
        if (onFinishCharacter) onFinishCharacter();
      }
    });

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [character, level]);

  const resetQuiz = () => {
    if (writerRef.current) {
      writerRef.current.quiz();
      setStatus('neutral');
    }
  };

  // Warna border dinamis ceria
  const borderColor = 
    status === 'error' ? 'border-red-400 shadow-red-100' :
    status === 'success' ? 'border-emerald-400 shadow-emerald-100' :
    'border-slate-200 shadow-inner';

  // Warna label level ceria
  const levelBadgeColor = 
    level === 1 ? 'bg-sky-100 text-sky-700 border-sky-200' : 
    level === 2 ? 'bg-amber-100 text-amber-700 border-amber-200' : 
    'bg-purple-100 text-purple-700 border-purple-200';

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto gap-3">
      
      {/* Label Level Berbentuk Pil Ceria */}
      <div className={`px-4 py-1.5 text-xs font-extrabold rounded-full border-2 ${levelBadgeColor} shadow-sm tracking-wide`}>
        TAHAP {level} / 3
      </div>

      {/* Pesan Feedback dengan Warna Menarik */}
      <div className={`text-sm font-bold transition-colors duration-300 h-6 text-center ${status === 'error' ? 'text-red-500' : 'text-slate-600'}`}>
        {message}
      </div>

      {/* Kanvas dengan Background Kertas Mandarin (Grid Merah Lembut) */}
      {/* RESPONSIVE FIX: w-full dan max-w */}
      <div 
        className={`relative bg-white border-4 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl w-full aspect-square max-w-75px ${borderColor} ${status === 'error' ? 'animate-pulse' : ''}`}
        style={{ touchAction: 'none' }} 
      >
        {/* Desain Garis Putus-putus ala Kertas Mandarin (Warna dibuat lebih lembut) */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
           <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-red-200"></div>
           <div className="absolute left-1/2 top-0 h-full border-l-2 border-dashed border-red-200"></div>
           <div className="absolute inset-0 border-2 border-red-100 rounded-2xl"></div>
        </div>

        {/* Elemen HanziWriter di atas grid */}
        <div ref={containerRef} className="absolute inset-0 cursor-crosshair z-10 flex items-center justify-center" />
      </div>

      <button
        onClick={resetQuiz}
        className="px-5 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-full hover:bg-slate-200 active:scale-95 transition-all mt-1 border border-slate-200"
      >
        🔄 Hapus & Ulangi
      </button>
    </div>
  );
}