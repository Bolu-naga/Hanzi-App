'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TeacherSidebar({ activeTab, teacherName }: { activeTab: string, teacherName: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'vocab', label: 'Materi Hanzi', icon: '🀄', colorClass: 'sky' },
    { id: 'students', label: 'Data Murid', icon: '🐼', colorClass: 'emerald' },
  ];

  return (
    <>
      {/* HEADER MOBILE & BURGER ICON */}
      <div className="md:hidden flex items-center justify-between bg-white p-5 border-b-2 border-slate-200 sticky top-0 z-50 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-sky-600 italic tracking-tight">Laoshi Panel.</h2>
          <p className="text-slate-400 font-bold text-xs truncate">Hi, {teacherName}</p>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 bg-slate-50 border-2 border-slate-200 rounded-xl active:scale-95 transition-all text-slate-700"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* SIDEBAR DESKTOP & SLIDE MOBILE */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r-2 border-slate-200 flex flex-col z-40 transition-transform transform ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="p-8 border-b-2 border-slate-100 hidden md:block">
          <h2 className="text-3xl font-black text-sky-600 italic tracking-tight">Laoshi Panel.</h2>
          <p className="text-slate-400 font-bold mt-1 text-sm truncate">Hi, {teacherName}</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
          {menuItems.map(item => {
            // Logika pewarnaan tab aktif yang dinamis (Sky untuk Hanzi, Emerald untuk Murid)
            const isActive = activeTab === item.id;
            const activeStyle = item.id === 'vocab' 
              ? 'bg-sky-100 text-sky-700 border-sky-200 shadow-sm' 
              : 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm';
              
            return (
              <Link 
                key={item.id}
                href={`/teacher/dashboard?tab=${item.id}&name=${encodeURIComponent(teacherName)}`}
                onClick={() => setIsOpen(false)} // Tutup otomatis di HP
                className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all border-2 ${isActive ? activeStyle : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
              >
                <span className="text-2xl">{item.icon}</span> {item.label}
              </Link>
            )
          })}

          <div className="flex items-center gap-4 p-4 rounded-2xl font-bold text-slate-300 cursor-not-allowed border-2 border-transparent">
            <span className="text-2xl opacity-50">📊</span> Report (Segera)
          </div>
        </nav>

        <div className="p-6 border-t-2 border-slate-100 bg-white">
          <Link href="/" className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-all w-full border border-red-100">
            🚪 Keluar Akun
          </Link>
        </div>
      </aside>

      {/* OVERLAY GELAP UNTUK MOBILE */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30 md:hidden animate-in fade-in" />
      )}
    </>
  );
}