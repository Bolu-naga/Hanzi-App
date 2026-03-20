'use client';

import { useRef } from 'react';

interface Vocab {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export default function PracticePaper({ vocabs }: { vocabs: Vocab[] }) {
  const columns = Array.from({ length: 10 });
  
  // Ref untuk menempelkan fungsi drag-to-scroll ke bungkus kertas
  const paperRef = useRef<HTMLDivElement>(null);

  // Variabel bantuan untuk mendeteksi gerakan mouse
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown = true;
    if (paperRef.current) {
      paperRef.current.classList.add('cursor-grabbing');
      startX = e.pageX - paperRef.current.offsetLeft;
      scrollLeft = paperRef.current.scrollLeft;
    }
  };

  const handleMouseLeave = () => {
    isDown = false;
    if (paperRef.current) paperRef.current.classList.remove('cursor-grabbing');
  };

  const handleMouseUp = () => {
    isDown = false;
    if (paperRef.current) paperRef.current.classList.remove('cursor-grabbing');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !paperRef.current) return;
    e.preventDefault();
    const x = e.pageX - paperRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Angka 1.5 ini kecepatan gesernya
    paperRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-[40px] shadow-2xl border-8 border-white mt-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-800">Kertas Latihan (田字格)</h2>
        <p className="text-slate-500 font-medium mt-2">Geser kertasnya, print, atau gunakan stylus untuk berlatih!</p>
      </div>

      {/* BUNGKUS SCROLL: Semua baris dibungkus di sini biar gesernya barengan */}
      <div 
        ref={paperRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="w-full overflow-x-auto pb-6 cursor-grab no-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="min-w-max flex flex-col gap-4">
          {vocabs.map((vocab) => (
            <div key={vocab.id} className="flex gap-2 items-center">
              
              {/* Kolom Informasi Pinyin & Arti */}
              <div className="w-24 shrink-0 flex flex-col justify-center items-end pr-3 border-r-2 border-slate-100 select-none">
                <span className="text-lg font-black text-slate-800">{vocab.pinyin}</span>
                <span className="text-xs font-bold text-slate-400">{vocab.meaning}</span>
              </div>

              {/* Grid Tianzi Ge 10 Kolom */}
              <div className="flex gap-1 shrink-0">
                {columns.map((_, index) => (
                  <div 
                    key={index} 
                    className={`relative w-14 h-14 shrink-0 border-2 ${index === 0 ? 'border-red-400 bg-red-50' : 'border-red-200'} flex items-center justify-center select-none`}
                  >
                    {/* Garis Putus-putus */}
                    <div className="absolute inset-0 pointer-events-none opacity-40">
                      <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-red-300"></div>
                      <div className="absolute left-1/2 top-0 h-full border-l border-dashed border-red-300"></div>
                    </div>
                    
                    {/* Hanzi (Hanya di kotak pertama) */}
                    {index === 0 && (
                      <span className="relative z-10 text-3xl font-black text-slate-800 opacity-90 pointer-events-none">
                        {vocab.hanzi}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              
            </div>
          ))}
        </div>
      </div>

      {/* Tombol Cetak */}
      <div className="mt-6 flex justify-center gap-4">
        <button 
          onClick={() => window.print()}
          className="px-8 py-3 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-900 shadow-lg active:scale-95 transition-all flex items-center gap-2"
        >
          🖨️ Print Kertas Ini
        </button>
      </div>
    </div>
  );
}