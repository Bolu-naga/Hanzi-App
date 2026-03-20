'use client';

import { useState } from 'react';
import FreeDrawCanvas from './FreeDrawCanvas';

interface Vocab {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export default function PracticePaper({ vocabs }: { vocabs: Vocab[] }) {
  const columns = Array.from({ length: 10 });
  const [isEraserMode, setIsEraserMode] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-[40px] shadow-2xl border-8 border-white mt-4 transition-all">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">Kertas Latihan (田字格)</h2>
        <p className="text-slate-500 font-medium mt-2 text-lg">Gunakan jarimu atau stylus untuk berlatih menulis di kotak kosong!</p>
      </div>

      <div className="w-full overflow-x-auto pb-6 no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="min-w-max flex flex-col gap-6">
          {vocabs.map((vocab) => (
            <div key={vocab.id} className="flex gap-3 items-center">
              
              {/* Kolom Pinyin Diperbesar */}
              <div className="w-28 shrink-0 flex flex-col justify-center items-end pr-4 border-r-2 border-slate-100 select-none">
                <span className="text-2xl font-black text-slate-800">{vocab.pinyin}</span>
                <span className="text-sm font-bold text-slate-400">{vocab.meaning}</span>
              </div>

              <div className="flex gap-2 shrink-0">
                {columns.map((_, index) => (
                  <div 
                    key={index} 
                    // KOTAK DIPERBESAR: w-20 h-20 (sekitar 80x80 pixels)
                    className={`relative w-20 h-20 shrink-0 border-2 ${index === 0 ? 'border-red-400 bg-red-50' : 'border-red-200 bg-white'} flex items-center justify-center select-none rounded-md overflow-hidden`}
                  >
                    <div className="absolute inset-0 pointer-events-none opacity-40">
                      <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-red-300"></div>
                      <div className="absolute left-1/2 top-0 h-full border-l border-dashed border-red-300"></div>
                    </div>
                    
                    {index === 0 ? (
                      // HANZI DIPERBESAR ke text-5xl
                      <span className="relative z-10 text-5xl font-black text-slate-800 opacity-90 pointer-events-none">
                        {vocab.hanzi}
                      </span>
                    ) : (
                      // Kanvas dilempar prop isEraser
                      <FreeDrawCanvas isEraser={isEraserMode} />
                    )}
                  </div>
                ))}
              </div>
              
            </div>
          ))}
        </div>
      </div>

      {/* Tombol Toggle Penghapus yang Elegan */}
      <div className="mt-8 flex justify-center gap-4">
        <button 
          onClick={() => setIsEraserMode(!isEraserMode)}
          className={`px-8 py-4 font-black rounded-2xl active:scale-95 transition-all flex items-center gap-3 border-4 ${
            isEraserMode 
              ? 'bg-sky-500 text-white border-sky-600 shadow-[0_5px_0_rgb(2,132,199)]' 
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
          }`}
        >
          <span className="text-2xl">{isEraserMode ? '✏️' : '🧹'}</span>
          {isEraserMode ? 'KEMBALI KE PENA' : 'MODE PENGHAPUS'}
        </button>
      </div>
    </div>
  );
}