'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TeacherDashboard() {
  const [inputChars, setInputChars] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const handleGenerate = () => {
    if (!inputChars.trim()) return;
    const cleanChars = inputChars.replace(/\s/g, '');
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/learn?chars=${encodeURIComponent(cleanChars)}`;
    setGeneratedLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    alert('Link berhasil di-copy! Bagikan ke murid.');
  };

  return (
    // Background Ceria (Sky Blue)
    <main className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-4 sm:p-6">
      
      {/* Kartu Utama dengan Sudut Sangat Bulat dan Bayangan Lembut */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-sky-100 max-w-lg w-full border-4 border-white relative overflow-hidden">
        
        {/* Dekorasi Latar Belakang Lingkaran Pastel */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-100 rounded-full opacity-60"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-pink-100 rounded-full opacity-60"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <span className="text-5xl mb-3 block">👩‍🏫</span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Dasbor <span className="text-sky-600">Guru Les</span>
            </h1>
            <p className="text-slate-600 mt-2 text-base">
              Ketik Hanzi untuk tugas hari ini, lalu bagikan link-nya ke murid.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2 ml-1">
                Karakter Hanzi (Contoh: 你好吗)
              </label>
              {/* INPUT FIXED: Lebih Bold, Tidak Transparan, Teks Gelap */}
              <input 
                type="text" 
                value={inputChars}
                onChange={(e) => setInputChars(e.target.value)}
                placeholder="Ketuk di sini untuk menulis..."
                className="w-full p-4 sm:p-5 bg-white text-slate-950 font-bold border-4 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-200 text-3xl tracking-widest shadow-inner placeholder:text-slate-400 placeholder:text-lg placeholder:tracking-normal transition-all"
              />
            </div>

            <button 
              onClick={handleGenerate}
              className="w-full py-4 bg-sky-500 text-white rounded-2xl font-bold text-lg hover:bg-sky-600 transition-all shadow-[0_5px_0_rgb(2,132,199)] hover:translate-y-0.5 hover:shadow-[0_3px_0_rgb(2,132,199)] active:translate-y-1 active:shadow-none"
            >
              🎉 BUAT TUGAS MURID
            </button>

            {generatedLink && (
              <div className="mt-6 p-6 bg-slate-50 rounded-2xl border-2 border-slate-100 animate-fade-in">
                <p className="text-xs font-bold text-slate-500 mb-2 ml-1 uppercase tracking-wider">Link Pelajaran (Bagikan ini):</p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input 
                    type="text" 
                    readOnly 
                    value={generatedLink}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 shadow-inner"
                  />
                  <button 
                    onClick={copyToClipboard}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 whitespace-nowrap active:scale-95 transition-all"
                  >
                    📋 Copy
                  </button>
                </div>
                <div className="mt-5 text-center bg-white p-3 rounded-lg border border-slate-100">
                   <Link href={`/learn?chars=${encodeURIComponent(inputChars.replace(/\s/g, ''))}`} className="text-sky-600 text-sm font-semibold hover:underline">
                      Coba Tes Tampilan Murid &rarr;
                   </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}