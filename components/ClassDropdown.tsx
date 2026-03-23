'use client';

import { useState, useRef, useEffect } from 'react';

export default function ClassDropdown({ existingClasses, customClass }: { existingClasses: string[], customClass?: string }) {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredClasses = existingClasses.filter(c => c.toLowerCase().includes(value.toLowerCase()));

  // Kalau customClass diisi, pakai itu (buat form besar). Kalau kosong, pakai default (buat form kecil).
  const inputStyle = customClass || "w-32 p-2.5 text-xs font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 placeholder:text-slate-500 shadow-sm transition-all";

  return (
    <div className={`relative ${customClass ? 'w-full' : ''}`} ref={wrapperRef}>
      <input
        name="className"
        value={value}
        onChange={(e) => { setValue(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        placeholder="Pilih/Ketik Kelas..."
        required
        autoComplete="off"
        className={inputStyle}
      />
      
      {isOpen && filteredClasses.length > 0 && (
        <ul className="absolute z-50 w-full min-w-40px mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto left-0 animate-in fade-in slide-in-from-top-2">
          {filteredClasses.map(cName => (
            <li
              key={cName}
              onClick={() => { setValue(cName); setIsOpen(false); }}
              className="px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer border-b border-slate-100 last:border-0 transition-colors flex items-center gap-2"
            >
              📁 {cName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}