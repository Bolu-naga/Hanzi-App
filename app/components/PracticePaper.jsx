'use client';

import { useRef, useEffect, useState } from 'react';

export default function PracticePaper({ characterList, onFinish }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [isDrawingMode, setIsDrawingMode] = useState(true);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    canvas.width = container.scrollWidth;
    canvas.height = container.scrollHeight;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3; // Sedikit lebih tipis agar rapi
    ctx.strokeStyle = '#0f172a';
  };

  useEffect(() => {
    setTimeout(setupCanvas, 100);
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, [characterList]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e) => {
    if (!isDrawingMode) return;
    canvasRef.current.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    lastPos.current = getCoordinates(e);
  };

  const draw = (e) => {
    if (!isDrawingMode || !isDrawing.current) return;
    const currentPos = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.stroke();
    lastPos.current = currentPos;
  };

  const stopDrawing = (e) => {
    isDrawing.current = false;
    if (isDrawingMode) canvasRef.current.releasePointerCapture(e.pointerId);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setupCanvas();
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Kontrol Kertas - UI Lebih Menarik */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-3xl shadow-lg border-2 border-slate-100">
        <div className="flex gap-3 w-full md:w-auto bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner">
          <button
            onClick={() => setIsDrawingMode(true)}
            className={`flex-1 md:flex-none px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${isDrawingMode ? 'bg-sky-500 text-white shadow-md' : 'text-slate-500 hover:text-sky-600'}`}
          >
            ✏️ Mode Tulis
          </button>
          <button
            onClick={() => setIsDrawingMode(false)}
            className={`flex-1 md:flex-none px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${!isDrawingMode ? 'bg-sky-500 text-white shadow-md' : 'text-slate-500 hover:text-sky-600'}`}
          >
            🖐️ Mode Geser
          </button>
        </div>
        <button onClick={clearCanvas} className="w-full md:w-auto px-6 py-3 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-100 text-sm active:scale-95 transition-all">
          🗑️ Hapus Kertas
        </button>
      </div>

      {/* Petunjuk Ceria */}
      <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-100 text-sm text-amber-800 text-center font-medium animate-pulse-slow">
        💡 Tulis setiap karakter sebanyak 10 kali ya! Gunakan <strong>Mode Geser</strong> untuk melihat kotak di sebelah kanan.
      </div>

      {/* Pembungkus Scroll Horizontal Responsif */}
      <div className="w-full overflow-x-auto bg-white border-4 border-slate-200 rounded-3xl shadow-inner relative group">
        
        {/* Kontainer Grid Kertas & Kanvas */}
        <div ref={containerRef} className="relative w-max p-6 select-none touch-none">
          
          {/* Layer 1: Garis Grid (Background Kertas Mandarin Lembut) */}
          <div className="flex flex-col gap-3 pointer-events-none">
            {characterList.map((char, rowIndex) => (
              <div key={rowIndex} className="flex gap-3">
                {/* Kolom Referensi (Karakter Contoh) */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-red-200 rounded-xl relative flex items-center justify-center bg-red-50 shadow-sm overflow-hidden">
                   {/* Grid putus-putus samar di contoh */}
                   <div className="absolute inset-0 border-t-2 border-dashed border-red-100 top-1/2 -translate-y-1/2" />
                   <div className="absolute inset-0 border-l-2 border-dashed border-red-100 left-1/2 -translate-x-1/2" />
                  <span className="relative z-10 text-6xl text-slate-900/30 font-serif">{char}</span>
                </div>
                
                {/* 10 Kolom Kosong untuk Latihan - Grid Lebih Lembut */}
                {Array(10).fill(0).map((_, colIndex) => (
                  <div key={colIndex} className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-red-100 rounded-xl relative flex items-center justify-center bg-white shadow-inner">
                    <div className="absolute inset-0 border-t-2 border-dashed border-red-50 top-1/2 -translate-y-1/2" />
                    <div className="absolute inset-0 border-l-2 border-dashed border-red-50 left-1/2 -translate-x-1/2" />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Layer 2: Kanvas untuk Menggambar */}
          <canvas
            ref={canvasRef}
            className={`absolute top-6 left-6 z-20 ${isDrawingMode ? 'cursor-crosshair' : 'pointer-events-none'}`}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerOut={stopDrawing}
            onPointerCancel={stopDrawing}
            style={{ touchAction: isDrawingMode ? 'none' : 'auto' }}
          />
        </div>
        
        {/* Indikator Scroll samar untuk mobile */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl text-slate-300 opacity-50 group-hover:opacity-100 animate-bounce-horizontal md:hidden">👉</div>
      </div>

      {/* Tombol Kumpulkan - UI Ceria ala Duolingo */}
      <button
        onClick={onFinish}
        className="mt-6 w-full py-5 bg-emerald-500 text-white rounded-3xl font-extrabold text-xl hover:bg-emerald-600 transition-all shadow-[0_6px_0_rgb(5,150,105)] hover:translate-y-0.5 hover:shadow-[0_4px_0_rgb(5,150,105)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-3"
      >
        <span>✅ TUGAS SELESAI (KUMPULKAN)</span>
      </button>
    </div>
  );
}