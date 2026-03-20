'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TeacherDashboard() {
  const [inputChars, setInputChars] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const handleGenerate = () => {
    if (!inputChars.trim()) return;
    
    // Menghilangkan spasi dan karakter non-hanzi (opsional, tapi bagus untuk keamanan)
    const cleanChars = inputChars.replace(/\s/g, '');
    
    // Membuat URL (dalam mode produksi, ini akan otomatis menjadi domain aslimu)
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/learn?chars=${encodeURIComponent(cleanChars)}`;
    
    setGeneratedLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    alert('Link berhasil di-copy! Bagikan ke murid.');
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Dashboard Guru</h1>
        <p className="text-slate-500 mb-6 text-sm">
          Masukkan Hanzi yang ingin diajarkan hari ini. Sistem akan membuatkan link khusus untuk murid.
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Karakter Hanzi (Tanpa spasi)
            </label>
            <input 
              type="text" 
              value={inputChars}
              onChange={(e) => setInputChars(e.target.value)}
              placeholder="Contoh: 你好吗"
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl tracking-widest"
            />
          </div>

          <button 
            onClick={handleGenerate}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Buat Tugas (Generate Link)
          </button>

          {generatedLink && (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Link Pelajaran Murid:</p>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={generatedLink}
                  className="w-full p-2 bg-white border border-slate-300 rounded text-sm text-slate-600"
                />
                <button 
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-slate-800 text-white rounded text-sm font-semibold hover:bg-slate-700"
                >
                  Copy
                </button>
              </div>
              <div className="mt-4 text-center">
                 <Link href={`/learn?chars=${encodeURIComponent(inputChars.replace(/\s/g, ''))}`} className="text-blue-500 text-sm font-semibold hover:underline">
                    Coba Tes Link Sendiri &rarr;
                 </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}