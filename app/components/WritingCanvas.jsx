'use client';

import { useRef, useEffect, useState } from 'react';
import HanziWriter from 'hanzi-writer';

// Tambahkan prop "level" (1 = Mudah, 2 = Sedang, 3 = Sulit/Mandiri)
export default function WritingCanvas({ character = '我', level = 1, onFinishCharacter }) {
  const containerRef = useRef(null);
  const writerRef = useRef(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('neutral');

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    // LOGIKA LEVEL KESULITAN
    let showOutline = true;
    let hintConfig = 1; // Default: Muncul hint setelah 1x salah

    if (level === 1) {
      // Level 1: Garis bantu terlihat jelas, hint langsung muncul kalau salah
      showOutline = true;
      hintConfig = 1;
      setMessage('Level 1: Ikuti garis bayangan.');
    } else if (level === 2) {
      // Level 2: Garis bantu terlihat, tapi hint baru muncul kalau salah 3x (menguji ingatan)
      showOutline = true;
      hintConfig = 3;
      setMessage('Level 2: Coba ingat urutannya.');
    } else if (level === 3) {
      // Level 3: Kotak kosong! Tidak ada garis bantu, tidak ada hint otomatis. Murni hafalan.
      showOutline = false;
      hintConfig = false; 
      setMessage('Level 3: Ujian Mandiri. Tulis tanpa bantuan!');
    }

    writerRef.current = HanziWriter.create(containerRef.current, character, {
      width: 300,
      height: 300,
      padding: 20,
      showOutline: showOutline,
      strokeAnimationSpeed: 2,
      delayBetweenStrokes: 500,
      strokeColor: '#334155', // Warna tinta
      outlineColor: '#cbd5e1', // Warna bayangan (jika showOutline true)
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
        setMessage('Sempurna!');
        if (onFinishCharacter) onFinishCharacter();
      }
    });

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [character, level]); // Effect ini akan dipanggil ulang setiap kali karakter ATAU level berubah

  const resetQuiz = () => {
    if (writerRef.current) {
      writerRef.current.quiz();
      setStatus('neutral');
    }
  };

  const borderColor = 
    status === 'error' ? 'border-red-500 shadow-red-200' :
    status === 'success' ? 'border-green-500 shadow-green-200' :
    'border-slate-300 shadow-sm';

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto gap-4">
      
      {/* Label Level Kesulitan */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${level === 1 ? 'bg-blue-100 text-blue-600' : level === 2 ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
          Tahap {level} / 3
        </span>
      </div>

      <div className={`text-sm font-bold transition-colors duration-300 ${status === 'error' ? 'text-red-500' : 'text-slate-600'} h-6 text-center`}>
        {message}
      </div>

      {/* Kanvas dengan Background TIANZI GE (Kertas Latihan Mandarin) */}
      <div 
        className={`relative bg-white border-4 rounded-xl overflow-hidden transition-all duration-300 ${borderColor} ${status === 'error' ? 'animate-pulse' : ''}`}
        style={{ touchAction: 'none', width: '300px', height: '300px' }} 
      >
        {/* Desain Garis Putus-putus ala Kertas Mandarin */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
           {/* Garis Horizontal Tengah */}
           <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-red-300"></div>
           {/* Garis Vertikal Tengah */}
           <div className="absolute left-1/2 top-0 h-full border-l-2 border-dashed border-red-300"></div>
           {/* Opsional: Border merah kotak (bisa diaktifkan jika ingin gaya buku tulis banget) */}
           <div className="absolute inset-0 border-2 border-red-200"></div>
        </div>

        {/* Elemen HanziWriter di atas grid */}
        <div ref={containerRef} className="absolute inset-0 cursor-crosshair z-10" />
      </div>

      <button
        onClick={resetQuiz}
        className="px-6 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 active:scale-95 transition-all mt-2"
      >
        Hapus & Ulangi Level Ini
      </button>
    </div>
  );
}