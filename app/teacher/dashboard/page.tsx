import prisma from '@/lib/prisma';
import { addVocab, deleteVocab } from '../../actions';

export default async function TeacherDashboard() {
  const allVocab = await prisma.vocab.findMany({
    orderBy: { session: 'asc' },
  });

  return (
    <main className="min-h-screen bg-slate-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic">Teacher Dashboard 🍎</h1>
            <p className="text-slate-700 font-medium mt-1">Kelola kurikulum Hanzi per sesi di sini.</p>
          </div>
          <span className="text-4xl">🧑‍🏫</span>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FORM INPUT GURU */}
          <div className="lg:col-span-1 bg-white p-6 rounded-[30px] shadow-xl border-4 border-white h-fit sticky top-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="bg-sky-100 p-2 rounded-lg text-sky-800">➕</span> Tambah Hanzi
            </h2>
            <form action={addVocab} className="flex flex-col gap-4">
              <input 
                name="hanzi" 
                placeholder="Ketik Hanzi (ex: 我)" 
                required 
                className="w-full p-3 bg-slate-50 text-slate-900 placeholder:text-slate-500 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 focus:bg-white font-black text-lg" 
              />
              <input 
                name="pinyin" 
                placeholder="Pinyin (ex: wǒ)" 
                required 
                className="w-full p-3 bg-slate-50 text-slate-900 placeholder:text-slate-500 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 focus:bg-white font-bold" 
              />
              <input 
                name="meaning" 
                placeholder="Arti (ex: Saya)" 
                required 
                className="w-full p-3 bg-slate-50 text-slate-900 placeholder:text-slate-500 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 focus:bg-white font-bold" 
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-700 ml-1 mb-1 block">Sesi</label>
                  <input 
                    name="session" 
                    type="number" 
                    defaultValue="1" 
                    className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 focus:bg-white font-black text-center" 
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-700 ml-1 mb-1 block">Level HSK</label>
                  <input 
                    name="level" 
                    type="number" 
                    defaultValue="1" 
                    className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 focus:bg-white font-black text-center" 
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-sky-600 text-white rounded-2xl font-black text-lg hover:bg-sky-700 shadow-[0_5px_0_rgb(3,105,161)] active:translate-y-1 active:shadow-none transition-all mt-4">
                SIMPAN HANZI 🚀
              </button>
            </form>
          </div>

          {/* DAFTAR HANZI YANG SUDAH ADA */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Daftar Hanzi Saat Ini</h2>
            {allVocab.length === 0 ? (
              <div className="text-center p-20 bg-white rounded-[30px] border-4 border-dashed border-slate-300 text-slate-600 font-bold text-lg">
                Belum ada data. Silakan isi form di samping!
              </div>
            ) : (
              allVocab.map((v: any) => (
                <div key={v.id} className="bg-white p-5 rounded-3xl shadow-md flex items-center justify-between border-2 border-slate-100 hover:border-sky-200 transition-all">
                  <div className="flex items-center gap-5">
                    {/* Kotak Hanzi dipertajam warnanya */}
                    <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center text-4xl font-black text-sky-900 border-2 border-sky-200">
                      {v.hanzi}
                    </div>
                    <div>
                      {/* Arti dan Pinyin dipertajam */}
                      <h4 className="font-black text-xl text-slate-900">
                        {v.meaning} <span className="text-slate-600 font-bold text-base ml-2">({v.pinyin})</span>
                      </h4>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-900 rounded-md font-black shadow-sm border border-yellow-300">SESI {v.session}</span>
                        <span className="text-xs px-2 py-1 bg-purple-200 text-purple-900 rounded-md font-black shadow-sm border border-purple-300">HSK {v.level}</span>
                      </div>
                    </div>
                  </div>
                  
                  <form action={deleteVocab.bind(null, v.id)}>
                    <button type="submit" className="p-4 bg-red-100 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all cursor-pointer font-bold border border-red-200 hover:border-red-600">
                      🗑️ Hapus
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </main>
  );
}