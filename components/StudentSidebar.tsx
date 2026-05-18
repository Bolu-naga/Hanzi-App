'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { logoutUser } from '@/app/actions';
import SubmitButton from '@/components/SubmitButton';

export default function StudentSidebar({ activeTab, studentName, studentId }: { activeTab: string, studentName: string, studentId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // State pengunci untuk anti-double click
  const [loadingTab, setLoadingTab] = useState<string | null>(null);

  // Otomatis buka kunci kalau halaman udah sukses dimuat
  useEffect(() => {
    setLoadingTab(null);
  }, [activeTab]);

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: '📊', colorClass: 'sky' },
    { id: 'learn', label: 'Ruang Kelas', icon: '🏫', colorClass: 'emerald' },
  ];

  return (
    <>
      {/* HEADER MOBILE */}
      <div className="md:hidden flex items-center justify-between bg-white p-5 border-b-2 border-slate-200 sticky top-0 z-50 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-sky-600 italic tracking-tight">Halo,</h2>
          <p className="text-slate-900 font-black text-lg truncate">{studentName}</p>
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
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r-2 border-slate-200 flex flex-col z-40 transition-transform transform ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-8 border-b-2 border-slate-100 hidden md:block">
          <h2 className="text-3xl font-black text-sky-600 italic tracking-tight">Halo,</h2>
          <p className="text-slate-900 font-black mt-1 text-xl truncate">{studentName}</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto pt-28 md:pt-6">
          {menuItems.map(item => {
            const isActive = activeTab === item.id;
            const isLoading = loadingTab === item.id; // Cek status loading
            
            let activeStyle = '';
            if (item.id === 'home') activeStyle = 'bg-sky-100 text-sky-700 border-sky-200 shadow-sm';
            else if (item.id === 'learn') activeStyle = 'bg-slate-100 text-slate-700 border-slate-200 shadow-sm';
              
            return (
              <Link 
                key={item.id}
                href={`/sessions?tab=${item.id}&name=${encodeURIComponent(studentName)}&studentId=${studentId}`}
                onClick={(e) => {
                  // Kunci rapat-rapat kalau ada proses loading jalan
                  if (loadingTab) {
                    e.preventDefault();
                    return;
                  }
                  
                  // Kalau mencet tombol yang baru, nyalakan spinner muternya
                  if (!isActive) {
                    setLoadingTab(item.id);
                  }
                  setIsOpen(false);
                }}
                className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all border-2 
                  ${isActive ? activeStyle : 'border-transparent text-slate-500 hover:bg-slate-50'}
                  ${loadingTab && !isLoading ? 'opacity-50 pointer-events-none' : ''} 
                `}
              >
                {/* Ganti ikon jadi animasi spinner pas lagi mikir */}
                {isLoading ? (
                  <svg className="animate-spin h-6 w-6 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span className="text-2xl">{item.icon}</span>
                )}
                
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Tombol Logout pake SubmitButton biar elegan */}
        <form action={logoutUser} className="p-6 border-t-2 border-slate-100 bg-white">
          <SubmitButton 
            text="🚪 Keluar Akun"
            loadingText="Keluar..."
            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-all w-full border border-red-100"
          />
        </form>
      </aside>

      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30 md:hidden animate-in fade-in" />
      )}
    </>
  );
}