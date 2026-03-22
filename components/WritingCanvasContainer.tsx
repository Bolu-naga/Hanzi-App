'use client';

import { useState } from 'react';
import WritingCanvas from './WritingCanvas';
import PracticePaper from './PracticePaper';
import { saveProgress } from '@/app/actions';

interface Vocab {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
}

interface Props {
  vocabs: Vocab[];
  studentName: string;
  studentId: string; // Tambahan properti baru
}

export default function WritingCanvasContainer({ vocabs, studentName, studentId }: Props) {
  const [vocabIndex, setVocabIndex] = useState(0);
  const [level, setLevel] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  const currentVocab = vocabs[vocabIndex];

  const handleLevelComplete = () => {
    if (level < 3) {
      setLevel(level + 1);
    } else {
      // ✅ SIMPAN KE DATABASE KARENA 1 HANZI SELESAI
      if (studentId) {
        saveProgress(studentId, currentVocab.id);
      }
      handleNextVocab();
    }
  };

  const handleNextVocab = () => {
    if (vocabIndex < vocabs.length - 1) {
      setVocabIndex(vocabIndex + 1);
      setLevel(1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="w-full flex flex-col items-center animate-in fade-in duration-700">
        <div className="bg-emerald-100 text-emerald-800 px-8 py-4 rounded-3xl font-black text-xl border-4 border-emerald-200 mb-6 text-center shadow-sm">
          🎉 Hebat {studentName}! Semua tahap selesai! <br/>
          <span className="text-sm font-bold text-emerald-600">Ini lembar latihan tambahan buat kamu.</span>
        </div>
        <PracticePaper vocabs={vocabs} />
        
        <button 
          onClick={() => window.location.href = `/sessions?name=${encodeURIComponent(studentName)}&studentId=${studentId}`}
          className="mt-8 px-10 py-4 bg-sky-500 text-white rounded-2xl font-black text-xl hover:bg-sky-600 shadow-[0_5px_0_rgb(2,132,199)] active:translate-y-1 active:shadow-none transition-all"
        >
          KEMBALI KE MENU UTAMA
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl flex flex-col items-center">
      <div className="w-full bg-slate-200 h-3 rounded-full mb-8 overflow-hidden border-2 border-white shadow-inner">
        <div 
          className="bg-sky-400 h-full transition-all duration-500"
          style={{ width: `${((vocabIndex) / vocabs.length) * 100}%` }}
        />
      </div>

      <div className="mb-6 text-center">
        <p className="text-sky-500 font-black uppercase tracking-widest text-sm">
          Hanzi {vocabIndex + 1} dari {vocabs.length}
        </p>
        <h2 className="text-5xl font-black text-slate-800 mt-1">{currentVocab.meaning}</h2>
        <p className="text-2xl text-slate-500 font-bold italic mb-2">{currentVocab.pinyin}</p>
      </div>

      <WritingCanvas 
        key={`${currentVocab.id}-${level}`}
        hanzi={currentVocab.hanzi} 
        level={level}
        onComplete={handleLevelComplete}
      />

      <div className="mt-10 flex items-center gap-6">
        <button 
          onClick={() => { if (vocabIndex > 0) { setVocabIndex(vocabIndex - 1); setLevel(1); } }}
          className="text-slate-400 font-bold hover:text-slate-600 transition-colors"
        >
          &larr; Kata Sebelumnya
        </button>
      </div>
    </div>
  );
}