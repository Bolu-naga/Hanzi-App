import prisma from '@/lib/prisma';
import Link from 'next/link';
import StudentSidebar from '@/components/StudentSidebar';

export default async function SessionsPage(props: { searchParams: Promise<{ name?: string, studentId?: string, tab?: string }> }) {
  const params = await props.searchParams;
  const name = params.name || 'Teman';
  const studentId = params.studentId || '';
  const activeTab = params.tab || 'home'; 

  // 1. Ambil data sesi
  const sessionsGroup = await prisma.vocab.groupBy({
    by: ['session'],
    orderBy: { session: 'asc' },
  });

  // 2. Hitung Progress & Total Hanzi
  let progressCount = await prisma.progress.count({ where: { studentId: studentId } });
  const totalVocab = await prisma.vocab.count();
  progressCount = Math.min(progressCount, totalVocab);
  const percentage = totalVocab === 0 ? 0 : Math.round((progressCount / totalVocab) * 100);

  // 3. Logika Rank/Pangkat Dinamis
  let rankIcon = '🥉';
  let rankName = 'Pemula Hanzi';
  let rankColor = 'text-amber-600';
  
  if (percentage >= 30) { rankIcon = '🥈'; rankName = 'Pelajar Giat'; rankColor = 'text-slate-500'; }
  if (percentage >= 70) { rankIcon = '🥇'; rankName = 'Hanzi Jagoan'; rankColor = 'text-yellow-500'; }
  if (percentage === 100) { rankIcon = '👑'; rankName = 'Suhu Mandarin'; rankColor = 'text-purple-600'; }

  // 4. Ambil 5 Riwayat Absen Terakhir Murid Ini
  const recentAttendance = await prisma.attendance.findMany({
    where: { studentId: studentId },
    orderBy: { date: 'desc' },
    take: 5
  });

  // 5. Ambil Pesan Laoshi
  const teacherData = await prisma.teacher.findFirst();
  const customMessage = teacherData?.dailyNote || `"Halo ${name}! Terus berlatih ya. Pilih menu Ruang Kelas di samping untuk mulai belajar dan menambah poin Hanzi-mu hari ini!"`;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans flex-col md:flex-row">
      <StudentSidebar activeTab={activeTab} studentName={name} studentId={studentId} />

      <main className="flex-1 p-6 md:p-12 overflow-y-auto pb-24">
        
        {/* ===================================== */}
        {/* TAB 1: DASHBOARD LAPORAN (DIROMBAK)   */}
        {/* ===================================== */}
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard Progress 📈</h1>
              <p className="text-slate-500 mt-2 text-lg font-medium">Pantau perkembangan belajarmu di sini.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* KOTAK 1: KATA DIKUASAI + PROGRESS BAR */}
              <div className="bg-white p-8 rounded-[30px] shadow-sm border-2 border-slate-200 flex flex-col items-center text-center hover:border-sky-300 transition-all">
                <span className="text-6xl mb-4">🏆</span>
                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-1">Hanzi Dikuasai</h3>
                <p className="text-5xl font-black text-sky-500 mb-4">{progressCount} <span className="text-xl text-slate-400">/ {totalVocab}</span></p>
                
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner mt-auto">
                  <div className="bg-sky-500 h-full rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
                </div>
                <p className="text-xs font-bold text-slate-400 mt-2">{percentage}% Selesai</p>
              </div>
              
              {/* KOTAK 2: PANGKAT/RANK DINAMIS */}
              <div className="bg-white p-8 rounded-[30px] shadow-sm border-2 border-slate-200 flex flex-col items-center text-center hover:border-emerald-300 transition-all justify-center">
                <span className="text-6xl mb-4 animate-bounce">{rankIcon}</span>
                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-1">Status Peringkat</h3>
                <p className={`text-3xl font-black mt-2 ${rankColor}`}>{rankName}</p>
                <p className="text-sm font-medium text-slate-500 mt-3">Selesaikan sesi untuk naik pangkat!</p>
              </div>
            </div>

            {/* KOTAK 3: PESAN LAOSHI */}
            <div className="bg-sky-50 p-6 rounded-[30px] border-2 border-sky-200 flex gap-4 items-start shadow-sm">
              <span className="text-4xl drop-shadow-sm">🧑‍🏫</span>
              <div className="w-full">
                <h3 className="text-lg font-black text-sky-900 mb-2">Pesan dari Laoshi:</h3>
                <p className="text-sky-800 font-medium leading-relaxed whitespace-pre-wrap">
                  {customMessage}
                </p>
              </div>
            </div>

            {/* KOTAK 4: RIWAYAT ABSEN (MENGISI KEKOSONGAN BAWAH) */}
            <div className="bg-white p-6 md:p-8 rounded-[30px] shadow-sm border-2 border-slate-200">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">📅 Riwayat Kehadiran Terakhir</h3>
              
              {recentAttendance.length === 0 ? (
                <div className="text-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">
                  Belum ada catatan kehadiran dari Laoshi.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  {recentAttendance.map((record: any) => {
                    const statusColors: any = {
                      'Hadir': 'bg-emerald-100 text-emerald-700 border-emerald-200',
                      'Izin': 'bg-blue-100 text-blue-700 border-blue-200',
                      'Sakit': 'bg-amber-100 text-amber-700 border-amber-200',
                      'Alpa': 'bg-red-100 text-red-700 border-red-200'
                    };
                    const colorClass = statusColors[record.status] || 'bg-slate-100 text-slate-500 border-slate-200';

                    return (
                      <div key={record.id} className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-1 ${colorClass}`}>
                        <span className="text-xs font-bold opacity-70 uppercase tracking-widest">{record.date}</span>
                        <span className="text-lg font-black">{record.status}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ===================================== */}
        {/* TAB 2: RUANG KELAS (TETAP SAMA)       */}
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
                    className="bg-white p-8 rounded-[35px] shadow-sm border-2 border-slate-200 hover:border-sky-400 hover:-translate-y-2 active:scale-95 transition-all group w-full block text-center"
                  >
                    <span className="text-7xl mb-4 block group-hover:scale-110 transition-transform drop-shadow-sm">🀄</span>
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