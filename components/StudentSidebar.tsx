'use client';

import { useState } from 'react';
import Link from 'next/link';
import { logoutUser } from '@/app/actions';

export default function StudentSidebar({ activeTab, studentName, studentId }: { activeTab: string, studentName: string, studentId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: '📊' },
    { id: 'learn', label: 'Ruang Kelas', icon: '🏫' },
  ];

  return (
    <>
      {/* HEADER MOBILE & BURGER ICON */}
      <div className="md:hidden flex items-center justify-between bg-white p-5 border-b-2 border-slate-200 sticky top-0 z-50 shadow-sm">
        <h2 className="text-2xl font-black text-sky-600 italic tracking-tight">Halo, {studentName}!</h2>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 bg-slate-50 border-2 border-slate-200 rounded-xl active:scale-95 transition-all text-slate-700"
        >
          {/* Ikon Burger / Silang menggunakan SVG */}
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* SIDEBAR (Desktop & Mobile Panel) */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r-2 border-slate-200 flex flex-col z-40 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="p-8 border-b-2 border-slate-100 hidden md:block">
          <h2 className="text-3xl font-black text-sky-600 italic tracking-tight">Halo,</h2>
          <p className="text-slate-800 font-black mt-1 text-2xl truncate">{studentName}</p>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          {menuItems.map(item => (
            <Link
              key={item.id}
              href={`/sessions?tab=${item.id}&name=${studentName}&studentId=${studentId}`}
              onClick={() => setIsOpen(false)} // Tutup menu kalau di HP habis diklik
              className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-sky-100 text-sky-700 shadow-sm border-2 border-sky-200' : 'text-slate-500 hover:bg-slate-50 border-2 border-transparent'}`}
            >
              <span className="text-2xl">{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>

        <form action={logoutUser} className="p-6 border-t-2 border-slate-100 bg-white">
          <button type="submit" className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-all w-full border border-red-100 cursor-pointer">
            🚪 Keluar Akun
          </button>
        </form>
      </aside>

      {/* OVERLAY GELAP UNTUK MOBILE (Kalau menu lagi kebuka) */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden animate-in fade-in" />
      )}
    </>
  );
}