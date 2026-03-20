'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import WritingCanvas from '../components/WritingCanvas';
import PracticePaper from '../components/PracticePaper'; // IMPORT KOMPONEN BARU

function QuizMachine() {
  const searchParams = useSearchParams();
  const charsQuery = searchParams.get('chars') || '我爱你'; 
  const characterList = charsQuery.split('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1); 
  const [isCurrentCharDone, setIsCurrentCharDone] = useState(false);
  
  // STATE BARU: Mengontrol apakah murid sedang di tahap kertas ujian
  const [isExamMode, setIsExamMode] = useState(false);
  // STATE BARU: Mengontrol apakah tugas sudah benar-benar dinilai guru
  const [isFullyComplete, setIsFullyComplete] = useState(false);

  const currentCharacter = characterList[currentIndex];
  const progressPercentage = (currentIndex / characterList.length) * 100;

  const handleCharacterFinish = () => setIsCurrentCharDone(true);

  const handleNext = () => {
    if (currentLevel < 3) {
      setCurrentLevel(currentLevel + 1);
      setIsCurrentCharDone(false);
    } else {
      if (currentIndex < characterList.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setCurrentLevel(1); 
        setIsCurrentCharDone(false);
      } else {
        // JIKA SEMUA KARAKTER SELESAI, MASUK KE MODE UJIAN
        setIsExamMode(true);
      }
    }
  };

  // TAMPILAN 3: LAYAR FINAL (Setelah dinilai guru)
  if (isFullyComplete) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-sm w-full border-2 border-green-100">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Nilai: A+</h2>
        <p className="text-slate-600">Kerja bagus! Gurumu telah menyetujui hasil tulisanmu.</p>
      </div>
    );
  }

  // TAMPILAN 2: KERTAS UJIAN KOTAK-KOTAK
  if (isExamMode) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Ujian Praktik Kerapian</h1>
          <p className="text-slate-500">Tulis ulang karakter di bawah ini tanpa bantuan.</p>
        </div>
        
        {/* Panggil komponen PracticePaper dan berikan daftar karakternya */}
        <PracticePaper 
          characterList={characterList} 
          onFinish={() => setIsFullyComplete(true)} 
        />
      </div>
    );
  }

  // TAMPILAN 1: KUIS INTERAKTIF (3 LEVEL)
  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      {/* (KODE KUIS SAMA SEPERTI SEBELUMNYA...) */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }} />
        </div>
        <span className="text-sm font-bold text-slate-400 whitespace-nowrap">
          {currentIndex + 1} / {characterList.length}
        </span>
      </div>

      <div className="text-center mt-2">
        <h1 className="text-6xl font-bold text-slate-800 mb-2">{currentCharacter}</h1>
      </div>

      <WritingCanvas 
        key={`${currentCharacter}-level-${currentLevel}`} 
        character={currentCharacter} 
        level={currentLevel}
        onFinishCharacter={handleCharacterFinish}
      />

      <div className="mt-2">
        <button
          onClick={handleNext}
          disabled={!isCurrentCharDone}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            isCurrentCharDone 
              ? 'bg-green-500 text-white shadow-[0_4px_0_rgb(34,197,94)] hover:translate-y-1 hover:shadow-none' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isCurrentCharDone 
            ? (currentLevel < 3 ? 'LANJUT KE TAHAP BERIKUTNYA' : (currentIndex < characterList.length - 1 ? 'KARAKTER SELANJUTNYA' : 'MULAI UJIAN KERTAS')) 
            : 'SELESAIKAN GORESAN'}
        </button>
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-6 px-4 justify-center">
      <Suspense fallback={<div className="text-slate-500">Memuat ruang kelas...</div>}>
        <QuizMachine />
      </Suspense>
    </main>
  );
}