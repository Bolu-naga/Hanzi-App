import prisma from '@/lib/prisma';
import { addVocab, deleteVocab, registerStudent, deleteStudent } from '../../actions';

export default async function TeacherDashboard(props: { searchParams: Promise<{ error?: string, success?: string, name?: string }> }) {
  const params = await props.searchParams;
  
  // Ambil semua data Hanzi & Murid dari database
  const allVocab = await prisma.vocab.findMany({ orderBy: { session: 'asc' } });
  const allStudents = await prisma.student.findMany({ orderBy: { name: 'asc' } });

  return (
    <main className="min-h-screen bg-slate-100 p-8 font-sans pb-24">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER DASHBOARD */}
        <header className="mb-10 flex justify-between items-center bg-white p-8 rounded-[30px] shadow-sm border-2 border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic">Halo, {params.name || 'Laoshi'}! 🍎</h1>
            <p className="text-slate-500 font-medium mt-1">Selamat datang di pusat kendali Mandarin Center.</p>
          </div>
          <button className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all border border-red-100">
            <a href="/">Logout</a>
          </button>
        </header>

        {/* NOTIFIKASI */}
        {params.error === 'email_exists' && (
          <div className="mb-8 p-4 bg-red-100 text-red-700 font-bold rounded-2xl border-2 border-red-200 animate-shake">
            ❌ Gagal! Email tersebut sudah terdaftar untuk murid lain.
          </div>
        )}
        {params.success === 'student_added' && (
          <div className="mb-8 p-4 bg-emerald-100 text-emerald-700 font-bold rounded-2xl border-2 border-emerald-200">
            ✅ Berhasil mendaftarkan akun murid baru!
          </div>
        )}

        {/* ========================================= */}
        {/* BAGIAN 1: MANAJEMEN MURID (BARU)          */}
        {/* ========================================= */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-3xl">🐼</span>
          <h2 className="text-2xl font-black text-slate-800">Manajemen Akun Murid</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* FORM TAMBAH MURID */}
          <div className="lg:col-span-1 bg-white p-6 rounded-[30px] shadow-xl border-4 border-white h-fit">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="bg-emerald-100 p-2 rounded-lg text-emerald-800">➕</span> Daftarkan Murid
            </h3>
            <form action={registerStudent} className="flex flex-col gap-4">
              <input name="name" placeholder="Nama Panggilan (ex: Budi)" required className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-emerald-500 font-bold" />
              <input name="email" type="email" placeholder="Email Murid" required className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-emerald-500 font-bold" />
              <input name="password" type="text" placeholder="Buat Password" required className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-emerald-500 font-bold" />
              
              <button type="submit" className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 shadow-[0_5px_0_rgb(5,150,105)] active:translate-y-1 active:shadow-none transition-all mt-2">
                BUAT AKUN
              </button>
            </form>
          </div>

          {/* LIST MURID */}
          <div className="lg:col-span-2 space-y-4">
            {allStudents.length === 0 ? (
              <div className="text-center p-10 bg-white rounded-[30px] border-4 border-dashed border-slate-300 text-slate-500 font-bold">
                Belum ada murid yang terdaftar.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allStudents.map((s: any) => (
                  <div key={s.id} className="bg-white p-5 rounded-3xl shadow-md border-2 border-slate-100 flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-lg text-slate-900">{s.name}</h4>
                      <p className="text-sm font-bold text-slate-500">{s.email}</p>
                      <p className="text-xs font-bold text-slate-400 mt-1 bg-slate-100 px-2 py-1 rounded inline-block">Pass: {s.password}</p>
                    </div>
                    <form action={deleteStudent.bind(null, s.id)}>
                      <button type="submit" className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold text-sm">
                        Hapus
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* GARIS PEMBATAS */}
        <hr className="border-t-4 border-dashed border-slate-200 mb-16" />

        {/* ========================================= */}
        {/* BAGIAN 2: MANAJEMEN HANZI (YANG LAMA)     */}
        {/* ========================================= */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-3xl">🀄</span>
          <h2 className="text-2xl font-black text-slate-800">Manajemen Materi Hanzi</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM INPUT GURU */}
          <div className="lg:col-span-1 bg-white p-6 rounded-[30px] shadow-xl border-4 border-white h-fit sticky top-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="bg-sky-100 p-2 rounded-lg text-sky-800">➕</span> Tambah Hanzi
            </h3>
            <form action={addVocab} className="flex flex-col gap-4">
              <input name="hanzi" placeholder="Ketik Hanzi (ex: 我)" required className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-black text-lg" />
              <input name="pinyin" placeholder="Pinyin (ex: wǒ)" required className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-bold" />
              <input name="meaning" placeholder="Arti (ex: Saya)" required className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-bold" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-700 ml-1 mb-1 block">Sesi</label>
                  <input name="session" type="number" defaultValue="1" className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-black text-center" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-700 ml-1 mb-1 block">Level HSK</label>
                  <input name="level" type="number" defaultValue="1" className="w-full p-3 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-black text-center" />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-sky-600 text-white rounded-2xl font-black text-lg hover:bg-sky-700 shadow-[0_5px_0_rgb(3,105,161)] active:translate-y-1 active:shadow-none transition-all mt-4">
                SIMPAN HANZI 🚀
              </button>
            </form>
          </div>

          {/* DAFTAR HANZI */}
          <div className="lg:col-span-2 space-y-4">
            {allVocab.length === 0 ? (
              <div className="text-center p-20 bg-white rounded-[30px] border-4 border-dashed border-slate-300 text-slate-600 font-bold text-lg">
                Belum ada data materi Hanzi.
              </div>
            ) : (
              allVocab.map((v: any) => (
                <div key={v.id} className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between border-2 border-slate-100 hover:border-sky-200 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center text-4xl font-black text-sky-900 border-2 border-sky-200">{v.hanzi}</div>
                    <div>
                      <h4 className="font-black text-xl text-slate-900">{v.meaning} <span className="text-slate-600 font-bold text-base ml-2">({v.pinyin})</span></h4>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-900 rounded-md font-black shadow-sm border border-yellow-300">SESI {v.session}</span>
                        <span className="text-xs px-2 py-1 bg-purple-200 text-purple-900 rounded-md font-black shadow-sm border border-purple-300">HSK {v.level}</span>
                      </div>
                    </div>
                  </div>
                  <form action={deleteVocab.bind(null, v.id)}>
                    <button type="submit" className="p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all font-bold border border-red-100">🗑️ Hapus</button>
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