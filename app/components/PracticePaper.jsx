'use client';

import { useRef, useEffect, useState } from 'react';

export default function PracticePaper({ characterList, onFinish }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Karena 10 kolom akan melebihi layar HP, kita butuh tombol toggle
  // agar murid bisa menggeser (scroll) kertasnya tanpa mencoret secara tidak sengaja.
  const [isDrawingMode, setIsDrawingMode] = useState(true);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Sesuaikan resolusi kanvas dengan ukuran penuh kertas (termasuk yang ter-scroll)
    canvas.width = container.scrollWidth;
    canvas.height = container.scrollHeight;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4; // Tinta pena lebih tipis agar rapi di kotak kecil
    ctx.strokeStyle = '#0f172a'; // Warna tinta hitam pekat
  };

  useEffect(() => {
    // Beri sedikit jeda agar DOM selesai merender grid kotak-kotaknya
    setTimeout(setupCanvas, 100);
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, [characterList]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    // Menggunakan clientX/Y dikurangi posisi rect kanvas di layar
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
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
    setupCanvas(); // Setup ulang tinta
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Kontrol Kertas */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsDrawingMode(true)}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all ${isDrawingMode ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}
          >
            ✍️ Mode Tulis
          </button>
          <button
            onClick={() => setIsDrawingMode(false)}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all ${!isDrawingMode ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}
          >
            🖐️ Mode Geser
          </button>
        </div>
        <button onClick={clearCanvas} className="w-full sm:w-auto px-4 py-2 bg-red-100 text-red-600 font-bold rounded-lg hover:bg-red-200 text-sm">
          Hapus Semua Kertas
        </button>
      </div>

      <div className="bg-orange-50 p-2 rounded-md border border-orange-200 text-xs text-orange-700 text-center">
        Tulis setiap karakter sebanyak 10 kali. Gunakan <strong>Mode Geser</strong> untuk melihat sisa kolom di sebelah kanan.
      </div>

      {/* Pembungkus Scroll Horizontal */}
      <div className="w-full overflow-x-auto bg-white border-2 border-slate-300 rounded-xl shadow-inner custom-scrollbar relative">
        
        {/* Kontainer Grid Kertas & Kanvas */}
        <div ref={containerRef} className="relative w-max p-4 select-none touch-none">
          
          {/* Layer 1: Garis Grid (Background) */}
          <div className="flex flex-col gap-2 pointer-events-none">
            {characterList.map((char, rowIndex) => (
              <div key={rowIndex} className="flex gap-2">
                {/* Kolom Referensi (Karakter yang dicetak) */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-red-500 relative flex items-center justify-center bg-red-50">
                  <span className="relative z-10 text-4xl text-black/40 font-serif">{char}</span>
                </div>
                
                {/* 10 Kolom Kosong untuk Latihan */}
                {Array(10).fill(0).map((_, colIndex) => (
                  <div key={colIndex} className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-red-400 relative flex items-center justify-center bg-white">
                    {/* Garis putus-putus tengah */}
                    <div className="absolute inset-0 border-t-2 border-dashed border-red-200 top-1/2 -translate-y-1/2" />
                    <div className="absolute inset-0 border-l-2 border-dashed border-red-200 left-1/2 -translate-x-1/2" />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Layer 2: Kanvas untuk Menggambar */}
          <canvas
            ref={canvasRef}
            className={`absolute top-4 left-4 z-20 ${isDrawingMode ? 'cursor-crosshair' : 'pointer-events-none'}`}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerOut={stopDrawing}
            onPointerCancel={stopDrawing}
            style={{ touchAction: isDrawingMode ? 'none' : 'auto' }}
          />
        </div>
      </div>

      <button
        onClick={onFinish}
        className="mt-4 w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-all shadow-[0_4px_0_rgb(34,197,94)] hover:translate-y-1 hover:shadow-none"
      >
        TUGAS SELESAI (KUMPULKAN KE GURU)
      </button>
    </div>
  );
}