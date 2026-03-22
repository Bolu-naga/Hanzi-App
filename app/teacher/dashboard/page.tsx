import prisma from '@/lib/prisma';
import Link from 'next/link';
import { addVocab, deleteVocab, registerStudent, deleteStudent } from '../../actions';

export default async function TeacherDashboard(props: { searchParams: Promise<{ tab?: string, error?: string, success?: string, name?: string }> }) {
  const params = await props.searchParams;
  // Deteksi tab mana yang lagi aktif (default ke vocab)
  const activeTab = params.tab || 'vocab';
  
  const allVocab = await prisma.vocab.findMany({ orderBy: { session: 'asc' } });
  const allStudents = await prisma.student.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* ========================================= */}
      {/* SIDEBAR NAVIGATION                        */}
      {/* ========================================= */}
        <aside className="w-72 bg-white border-r-2 border-slate-200 flex-col sticky top-0 h-screen hidden md:flex">
        <div className="p-8 border-b-2 border-slate-100">
          <h2 className="text-3xl font-black text-sky-600 italic tracking-tight">Laoshi Panel.</h2>
          {params.name && <p className="text-slate-400 font-bold mt-1 text-sm">Hi, {params.name}</p>}
        </div>
        
        <nav className="flex-1 p-6 space-y-3">
          <Link 
            href="/teacher/dashboard?tab=vocab" 
            className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'vocab' ? 'bg-sky-100 text-sky-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <span className="text-2xl">🀄</span> Materi Hanzi
          </Link>
          
          <Link 
            href="/teacher/dashboard?tab=students" 
            className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'students' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <span className="text-2xl">🐼</span> Data Murid
          </Link>

          <div className="flex items-center gap-4 p-4 rounded-2xl font-bold text-slate-300 cursor-not-allowed">
            <span className="text-2xl opacity-50">📊</span> Report (Segera)
          </div>
        </nav>

        <div className="p-6 border-t-2 border-slate-100">
          <Link href="/" className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-all w-full">
            🚪 Keluar
          </Link>
        </div>
      </aside>

      {/* ========================================= */}
      {/* MAIN CONTENT AREA                         */}
      {/* ========================================= */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        
        {/* TAMPILAN TAB: MATERI HANZI */}
        {activeTab === 'vocab' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-slate-900">Manajemen Materi 🀄</h1>
              <p className="text-slate-500 mt-2 text-lg">Kelola daftar kosakata Hanzi untuk setiap sesi belajar.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* FORM TAMBAH HANZI */}
              <div className="lg:col-span-1 bg-white p-6 rounded-[30px] shadow-xl border-4 border-white h-fit">
                <h3 className="text-lg font-bold text-slate-900 mb-4">➕ Tambah Kosakata</h3>
                <form action={addVocab} className="flex flex-col gap-4">
                  <input name="hanzi" placeholder="Ketik Hanzi (ex: 我)" required className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-black text-lg" />
                  <input name="pinyin" placeholder="Pinyin (ex: wǒ)" required className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-bold" />
                  <input name="meaning" placeholder="Arti (ex: Saya)" required className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-bold" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase text-slate-500 ml-1 mb-1 block">Sesi</label>
                      <input name="session" type="number" defaultValue="1" className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-black text-center" />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase text-slate-500 ml-1 mb-1 block">Level</label>
                      <input name="level" type="number" defaultValue="1" className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-black text-center" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-4 bg-sky-600 text-white rounded-2xl font-black text-lg hover:bg-sky-700 shadow-[0_5px_0_rgb(3,105,161)] active:translate-y-1 active:shadow-none transition-all mt-4">
                    SIMPAN HANZI
                  </button>
                </form>
              </div>

              {/* LIST HANZI */}
              <div className="lg:col-span-2 space-y-4">
                {allVocab.length === 0 ? (
                  <div className="text-center p-20 bg-white rounded-[30px] border-4 border-dashed border-slate-300 text-slate-400 font-bold">Belum ada materi.</div>
                ) : (
                  allVocab.map((v: any) => (
                    <div key={v.id} className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between border-2 border-slate-100 hover:border-sky-200 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center text-4xl font-black text-sky-900 border-2 border-sky-200">{v.hanzi}</div>
                        <div>
                          <h4 className="font-black text-xl text-slate-900">{v.meaning} <span className="text-slate-500 font-bold text-base ml-1">({v.pinyin})</span></h4>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md font-black">SESI {v.session}</span>
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-md font-black">HSK {v.level}</span>
                          </div>
                        </div>
                      </div>
                      <form action={deleteVocab.bind(null, v.id)}>
                        <button type="submit" className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold">🗑️</button>
                      </form>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAMPILAN TAB: DATA MURID */}
        {activeTab === 'students' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-slate-900">Data Murid 🐼</h1>
              <p className="text-slate-500 mt-2 text-lg">Daftarkan dan kelola akun akses murid untuk belajar.</p>
            </div>

            {params.error === 'email_exists' && <div className="mb-6 p-4 bg-red-100 text-red-700 font-bold rounded-2xl border-2 border-red-200">❌ Email sudah terdaftar!</div>}
            {params.success === 'student_added' && <div className="mb-6 p-4 bg-emerald-100 text-emerald-700 font-bold rounded-2xl border-2 border-emerald-200">✅ Murid berhasil didaftarkan!</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* FORM TAMBAH MURID */}
              <div className="lg:col-span-1 bg-white p-6 rounded-[30px] shadow-xl border-4 border-white h-fit">
                <h3 className="text-lg font-bold text-slate-900 mb-4">➕ Daftarkan Akun</h3>
                <form action={registerStudent} className="flex flex-col gap-4">
                  <input name="name" placeholder="Nama Lengkap" required className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-emerald-500 font-bold" />
                  <input name="email" type="email" placeholder="Email Murid" required className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-emerald-500 font-bold" />
                  <input name="password" type="text" placeholder="Buat Password" required className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-emerald-500 font-bold" />
                  <button type="submit" className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 shadow-[0_5px_0_rgb(5,150,105)] active:translate-y-1 active:shadow-none transition-all mt-4">
                    BUAT AKUN
                  </button>
                </form>
              </div>

              {/* LIST MURID */}
              <div className="lg:col-span-2 space-y-4">
                {allStudents.length === 0 ? (
                  <div className="text-center p-20 bg-white rounded-[30px] border-4 border-dashed border-slate-300 text-slate-400 font-bold">Belum ada murid.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allStudents.map((s: any) => (
                      <div key={s.id} className="bg-white p-6 rounded-3xl shadow-sm border-2 border-slate-100 flex justify-between items-start">
                        <div>
                          <h4 className="font-black text-xl text-slate-900">{s.name}</h4>
                          <p className="text-sm font-bold text-slate-500 mb-2">{s.email}</p>
                          <span className="text-xs font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                            🔑 {s.password}
                          </span>
                        </div>
                        <form action={deleteStudent.bind(null, s.id)}>
                          <button type="submit" className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold text-xs border border-red-100">
                            Hapus
                          </button>
                        </form>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}