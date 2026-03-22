import prisma from '@/lib/prisma';
import Link from 'next/link';
import StudentSidebar from '@/components/StudentSidebar';

export default async function SessionsPage(props: { searchParams: Promise<{ name?: string, studentId?: string, tab?: string }> }) {
  const params = await props.searchParams;
  const name = params.name || 'Teman';
  const studentId = params.studentId || '';
  const activeTab = params.tab || 'home'; // Tab default adalah 'home' (Dashboard)

  // Ambil daftar Sesi yang tersedia
  const sessionsGroup = await prisma.vocab.groupBy({
    by: ['session'],
    orderBy: { session: 'asc' },
  });

  // Hitung jumlah Hanzi yang sudah diselesaikan murid (Persiapan Sprint 4)
  const progressCount = await prisma.progress.count({
    where: { studentId: studentId }
  });

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans flex-col md:flex-row">
      
      {/* Panggil Sidebar Keren Kita */}
      <StudentSidebar activeTab={activeTab} studentName={name} studentId={studentId} />

      {/* AREA KONTEN UTAMA */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto pb-24">
        
        {/* ===================================== */}
        {/* TAB 1: DASHBOARD LAPORAN              */}
        {/* ===================================== */}
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard Progress 📈</h1>
              <p className="text-slate-500 mt-2 text-lg font-medium">Pantau perkembangan belajarmu di sini.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-8 rounded-[30px] shadow-lg border-4 border-white flex flex-col items-center text-center hover:border-sky-100 transition-all">
                <span className="text-6xl mb-4">🏆</span>
                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-1">Hanzi Dikuasai</h3>
                <p className="text-5xl font-black text-sky-500">{progressCount} <span className="text-xl text-slate-400">kata</span></p>
              </div>
              
              <div className="bg-white p-8 rounded-[30px] shadow-lg border-4 border-white flex flex-col items-center text-center hover:border-emerald-100 transition-all">
                <span className="text-6xl mb-4">🔥</span>
                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-1">Status Belajar</h3>
                <p className="text-3xl font-black text-emerald-500 mt-2">Semangat!</p>
              </div>
            </div>

            <div className="bg-sky-50 p-6 rounded-3xl border-2 border-sky-200 shadow-inner flex gap-4 items-start">
              <span className="text-4xl">🧑‍🏫</span>
              <div>
                <h3 className="text-xl font-bold text-sky-900 mb-1">Pesan dari Laoshi:</h3>
                <p className="text-sky-700 font-medium leading-relaxed">"Halo {name}! Terus berlatih ya. Pilih menu <b className="text-sky-900">Ruang Kelas</b> di samping untuk mulai belajar dan menambah poin Hanzi-mu hari ini!"</p>
              </div>
            </div>
          </div>
        )}

        {/* ===================================== */}
        {/* TAB 2: RUANG KELAS (PILIH SESI)       */}
        {/* ===================================== */}
        {activeTab === 'learn' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Ruang Kelas 🏫</h1>
              <p className="text-slate-500 mt-2 text-lg font-medium">Pilih sesi belajarmu hari ini ya!</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {sessionsGroup.length === 0 ? (
                 <div className="col-span-full text-center p-10 bg-white rounded-3xl border-2 border-dashed border-slate-300 text-slate-500 font-bold">
                   Belum ada sesi yang dibuka Laoshi.
                 </div>
              ) : (
                sessionsGroup.map((s: any) => (
                  <Link
                    key={s.session}
                    href={`/learn?session=${s.session}&name=${encodeURIComponent(name)}&studentId=${studentId}`}
                    className="bg-white p-8 rounded-[35px] shadow-lg border-4 border-white hover:border-sky-400 hover:-translate-y-2 active:scale-95 transition-all group w-full block text-center"
                  >
                    <span className="text-7xl mb-4 block group-hover:scale-110 transition-transform">🀄</span>
                    <h3 className="text-2xl font-black text-slate-900">Sesi {s.session}</h3>
                    <p className="text-sky-600 font-black mt-3 text-sm uppercase tracking-widest bg-sky-50 py-3 rounded-xl border border-sky-100 group-hover:bg-sky-500 group-hover:text-white transition-all">
                      Mulai Belajar 🚀
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}