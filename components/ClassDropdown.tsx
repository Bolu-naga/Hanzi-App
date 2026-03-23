'use client';

import { useState, useRef, useEffect } from 'react';

export default function ClassDropdown({ existingClasses }: { existingClasses: string[] }) {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fungsi untuk menutup dropdown saat Laoshi klik di luar kotak
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter pilihan kelas biar otomatis nyari yang diketik Laoshi
  const filteredClasses = existingClasses.filter(c => c.toLowerCase().includes(value.toLowerCase()));

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        name="className"
        value={value}
        onChange={(e) => { setValue(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        placeholder="Pilih/Ketik Kelas..."
        required
        autoComplete="off"
        className="w-36 p-2.5 text-xs font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 placeholder:text-slate-500 shadow-sm transition-all"
      />
      
      {/* POP-UP DROPDOWN CUSTOM (Cantik & Elegan) */}
      {isOpen && filteredClasses.length > 0 && (
        <ul className="absolute z-50 w-full min-w-40px mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto right-0 xl:left-0 animate-in fade-in slide-in-from-top-2">
          {filteredClasses.map(cName => (
            <li
              key={cName}
              onClick={() => { setValue(cName); setIsOpen(false); }}
              className="px-4 py-3 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600 cursor-pointer border-b border-slate-100 last:border-0 transition-colors flex items-center gap-2"
            >
              📁 {cName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}