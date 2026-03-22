import prisma from '@/lib/prisma';
import TeacherSidebar from '@/components/TeacherSidebar';
import { addVocab, deleteVocab, registerStudent, deleteStudent } from '../../actions';

export default async function TeacherDashboard(props: { searchParams: Promise<{ tab?: string, error?: string, success?: string, name?: string }> }) {
  const params = await props.searchParams;
  const activeTab = params.tab || 'vocab';
  const teacherName = params.name || 'Laoshi';
  
  const allVocab = await prisma.vocab.findMany({ orderBy: { session: 'asc' } });
  const allStudents = await prisma.student.findMany({ orderBy: { name: 'asc' } });

  return (
    // Tambahkan flex-col untuk HP, dan flex-row untuk Desktop
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans">
      
      {/* Panggil Sidebar Responsive Laoshi */}
      <TeacherSidebar activeTab={activeTab} teacherName={teacherName} />

      {/* ========================================= */}
      {/* MAIN CONTENT AREA                         */}
      {/* ========================================= */}
      <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto pb-24 md:pb-12 w-full">
        
        {/* TAB 1: MATERI HANZI */}
        {activeTab === 'vocab' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-6xl mx-auto">
            <div className="mb-6 md:mb-8 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Manajemen Materi 🀄</h1>
              <p className="text-slate-500 mt-2 text-base md:text-lg">Kelola daftar kosakata Hanzi untuk setiap sesi belajar.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* FORM TAMBAH HANZI */}
              <div className="lg:col-span-1 bg-white p-6 rounded-[30px] shadow-xl border-4 border-white h-fit md:sticky md:top-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="bg-sky-100 p-2 rounded-lg text-sky-800">➕</span> Tambah Kosakata
                </h3>
                <form action={addVocab} className="flex flex-col gap-4">
                  <input name="hanzi" placeholder="Ketik Hanzi (ex: 我)" required className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-black text-xl text-center md:text-left" />
                  <input name="pinyin" placeholder="Pinyin (ex: wǒ)" required className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-bold text-center md:text-left" />
                  <input name="meaning" placeholder="Arti (ex: Saya)" required className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-bold text-center md:text-left" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase text-slate-500 ml-1 mb-1 block">Sesi</label>
                      <input name="session" type="number" defaultValue="1" className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-black text-center" />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase text-slate-500 ml-1 mb-1 block">Level</label>
                      <input name="level" type="number" defaultValue="1" className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-black text-center" />
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
                  <div className="text-center p-12 md:p-20 bg-white rounded-[30px] border-4 border-dashed border-slate-300 text-slate-400 font-bold">Belum ada materi.</div>
                ) : (
                  allVocab.map((v: any) => (
                    <div key={v.id} className="bg-white p-4 md:p-5 rounded-3xl shadow-sm flex items-center justify-between border-2 border-slate-100 hover:border-sky-200 transition-all">
                      <div className="flex items-center gap-4 md:gap-5">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-sky-100 rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-black text-sky-900 border-2 border-sky-200 shrink-0">
                          {v.hanzi}
                        </div>
                        <div>
                          <h4 className="font-black text-lg md:text-xl text-slate-900">{v.meaning} <span className="text-slate-500 font-bold text-sm md:text-base ml-1">({v.pinyin})</span></h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-[10px] md:text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md font-black">SESI {v.session}</span>
                            <span className="text-[10px] md:text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-md font-black">HSK {v.level}</span>
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

        {/* TAB 2: DATA MURID */}
        {activeTab === 'students' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-6xl mx-auto">
            <div className="mb-6 md:mb-8 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Data Murid 🐼</h1>
              <p className="text-slate-500 mt-2 text-base md:text-lg">Daftarkan dan kelola akun akses murid untuk belajar.</p>
            </div>

            {params.error === 'email_exists' && <div className="mb-6 p-4 bg-red-100 text-red-700 font-bold rounded-2xl border-2 border-red-200">❌ Email sudah terdaftar!</div>}
            {params.success === 'student_added' && <div className="mb-6 p-4 bg-emerald-100 text-emerald-700 font-bold rounded-2xl border-2 border-emerald-200">✅ Murid berhasil didaftarkan!</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* FORM TAMBAH MURID */}
              <div className="lg:col-span-1 bg-white p-6 rounded-[30px] shadow-xl border-4 border-white h-fit md:sticky md:top-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="bg-emerald-100 p-2 rounded-lg text-emerald-800">➕</span> Daftarkan Akun
                </h3>
                <form action={registerStudent} className="flex flex-col gap-4">
                  <input name="name" placeholder="Nama Panggilan" required className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-emerald-500 font-bold text-center md:text-left" />
                  <input name="email" type="email" placeholder="Email Murid" required className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-emerald-500 font-bold text-center md:text-left" />
                  <input name="password" type="text" placeholder="Buat Password" required className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-emerald-500 font-bold text-center md:text-left" />
                  <button type="submit" className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 shadow-[0_5px_0_rgb(5,150,105)] active:translate-y-1 active:shadow-none transition-all mt-4">
                    BUAT AKUN
                  </button>
                </form>
              </div>

              {/* LIST MURID */}
              <div className="lg:col-span-2 space-y-4">
                {allStudents.length === 0 ? (
                  <div className="text-center p-12 md:p-20 bg-white rounded-[30px] border-4 border-dashed border-slate-300 text-slate-400 font-bold">Belum ada murid.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allStudents.map((s: any) => (
                      <div key={s.id} className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border-2 border-slate-100 flex justify-between items-start">
                        <div className="overflow-hidden pr-2">
                          <h4 className="font-black text-lg md:text-xl text-slate-900 truncate">{s.name}</h4>
                          <p className="text-xs md:text-sm font-bold text-slate-500 mb-3 truncate">{s.email}</p>
                          <span className="text-[10px] md:text-xs font-black text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 break-all">
                            🔑 {s.password}
                          </span>
                        </div>
                        <form action={deleteStudent.bind(null, s.id)}>
                          <button type="submit" className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold text-xs border border-red-100 shrink-0">
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