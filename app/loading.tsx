export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      
      <div className="bg-white p-8 rounded-[30px] shadow-2xl flex flex-col items-center border-2 border-slate-100 transform scale-100 animate-in zoom-in-95 duration-300">
        
        <div className="relative flex items-center justify-center w-20 h-20 mb-4">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-sky-500 rounded-full border-t-transparent animate-spin"></div>
          <span className="text-3xl animate-pulse">🀄</span>
        </div>

        {/* Teks Loading */}
        <h2 className="text-xl font-black text-slate-800 tracking-widest animate-pulse">
          MEMUAT...
        </h2>
        <p className="text-xs font-bold text-slate-400 mt-2">
          Menyiapkan data kelas
        </p>
        
      </div>
    </div>
  );
}