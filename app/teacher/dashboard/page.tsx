import prisma from "@/lib/prisma";
import TeacherSidebar from "@/components/TeacherSidebar";
import {
  addVocab,
  deleteVocab,
  registerStudent,
  deleteStudent,
  markAttendance,
  updateDailyNote,
  updateStudentClass,
} from "../../actions";

import ClassDropdown from "@/components/ClassDropdown";

export default async function TeacherDashboard(props: {
  searchParams: Promise<{
    tab?: string;
    error?: string;
    success?: string;
    name?: string;
    date?: string;
  }>;
}) {
  const params = await props.searchParams;
  const activeTab = params.tab || "vocab";
  const teacherName = params.name || "Laoshi";

  const allVocab = await prisma.vocab.findMany({ orderBy: { session: "asc" } });
  const allStudents = await prisma.student.findMany({
    orderBy: { name: "asc" },
  });
  const teacherData = await prisma.teacher.findFirst();

  // 👇 LOGIKA MENGELOMPOKKAN MURID BERDASARKAN KELAS
  const studentsByClass = allStudents.reduce((acc: any, student: any) => {
    const cName = student.className || "Kelas Umum";
    if (!acc[cName]) acc[cName] = [];
    acc[cName].push(student);
    return acc;
  }, {});

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans">
      <TeacherSidebar activeTab={activeTab} teacherName={teacherName} />

      <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto pb-24 md:pb-12 w-full">
        {/* ========================================= */}
        {/* TAB 1: MATERI HANZI                       */}
        {/* ========================================= */}
        {activeTab === "vocab" && (
          // ... (BAGIAN INI TETAP SAMA SEPERTI SEBELUMNYA)
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-6xl mx-auto">
            <div className="mb-6 md:mb-8 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Manajemen Materi 🀄
              </h1>
              <p className="text-slate-500 mt-2 text-base md:text-lg">
                Kelola daftar kosakata Hanzi untuk setiap sesi belajar.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-1 bg-white p-6 rounded-[30px] shadow-xl border-4 border-white h-fit md:sticky md:top-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="bg-sky-100 p-2 rounded-lg text-sky-800">
                    ➕
                  </span>{" "}
                  Tambah Kosakata
                </h3>
                <form action={addVocab} className="flex flex-col gap-4">
                  <input
                    name="hanzi"
                    placeholder="Ketik Hanzi (ex: 我)"
                    required
                    className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-black text-xl"
                  />
                  <input
                    name="pinyin"
                    placeholder="Pinyin (ex: wǒ)"
                    required
                    className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-bold"
                  />
                  <input
                    name="meaning"
                    placeholder="Arti (ex: Saya)"
                    required
                    className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-bold"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase text-slate-500 ml-1 mb-1 block">
                        Sesi
                      </label>
                      <input
                        name="session"
                        type="number"
                        defaultValue="1"
                        className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-black text-center"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase text-slate-500 ml-1 mb-1 block">
                        Level
                      </label>
                      <input
                        name="level"
                        type="number"
                        defaultValue="1"
                        className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-black text-center"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-sky-600 text-white rounded-2xl font-black text-lg hover:bg-sky-700 shadow-[0_5px_0_rgb(3,105,161)] active:translate-y-1 active:shadow-none transition-all mt-4"
                  >
                    SIMPAN HANZI
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-4">
                {allVocab.length === 0 ? (
                  <div className="text-center p-12 md:p-20 bg-white rounded-[30px] border-4 border-dashed border-slate-300 text-slate-400 font-bold">
                    Belum ada materi.
                  </div>
                ) : (
                  allVocab.map((v: any) => (
                    <div
                      key={v.id}
                      className="bg-white p-4 md:p-5 rounded-3xl shadow-sm flex items-center justify-between border-2 border-slate-100 hover:border-sky-200 transition-all"
                    >
                      <div className="flex items-center gap-4 md:gap-5">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-sky-100 rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-black text-sky-900 border-2 border-sky-200 shrink-0">
                          {v.hanzi}
                        </div>
                        <div>
                          <h4 className="font-black text-lg md:text-xl text-slate-900">
                            {v.meaning}{" "}
                            <span className="text-slate-500 font-bold text-sm md:text-base ml-1">
                              ({v.pinyin})
                            </span>
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-[10px] md:text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md font-black">
                              SESI {v.session}
                            </span>
                            <span className="text-[10px] md:text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-md font-black">
                              HSK {v.level}
                            </span>
                          </div>
                        </div>
                      </div>
                      <form action={deleteVocab.bind(null, v.id)}>
                        <button
                          type="submit"
                          className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold"
                        >
                          🗑️
                        </button>
                      </form>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 2: DATA MURID (DENGAN KELAS)          */}
        {/* ========================================= */}
        {activeTab === "students" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-6xl mx-auto">
            <div className="mb-6 md:mb-8 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Data Murid 🐼
              </h1>
              <p className="text-slate-500 mt-2 text-base md:text-lg">
                Daftarkan akun dan atur pengumuman dashboard murid.
              </p>
            </div>

            {params.success === "note_updated" && (
              <div className="mb-6 p-4 bg-sky-100 text-sky-700 font-bold rounded-2xl border-2 border-sky-200">
                ✅ Pengumuman berhasil diubah!
              </div>
            )}
            {params.success === "class_updated" && (
              <div className="mb-6 p-4 bg-purple-100 text-purple-700 font-bold rounded-2xl border-2 border-purple-200">
                ✅ Murid berhasil dipindah kelas!
              </div>
            )}

            {/* 👇 INI TAMBAHANNYA: Daftar Pilihan Kelas Biar Laoshi Tinggal Klik 👇 */}
            <datalist id="class-suggestions">
              {Object.keys(studentsByClass).map(cName => (
                <option key={cName} value={cName} />
              ))}
            </datalist>

            <div className="mb-8 bg-white p-6 md:p-8 rounded-[30px] shadow-sm border-2 border-slate-200">
              <h3 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2">
                📢 Pesan Dashboard Murid
              </h3>
              <form
                action={updateDailyNote}
                className="flex flex-col md:flex-row gap-4 mt-4"
              >
                <textarea
                  name="note"
                  defaultValue={teacherData?.dailyNote || ""}
                  rows={2}
                  className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-sky-500 font-medium resize-none"
                  placeholder="Ketik pesan untuk murid di sini..."
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 shadow-[0_5px_0_rgb(15,23,42)] active:translate-y-1 active:shadow-none transition-all shrink-0"
                >
                  UPDATE
                  <br />
                  PESAN
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-1 bg-white p-6 rounded-[30px] shadow-xl border-4 border-white h-fit md:sticky md:top-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="bg-emerald-100 p-2 rounded-lg text-emerald-800">
                    ➕
                  </span>{" "}
                  Daftarkan Akun
                </h3>
<form action={registerStudent} className="flex flex-col gap-4" autoComplete="off">
                  <input 
                    name="name" 
                    placeholder="Nama Panggilan" 
                    required 
                    autoComplete="off" 
                    spellCheck="false"
                    className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-emerald-500 font-bold" 
                  />
                  <input 
                    name="email" 
                    type="email" 
                    placeholder="Email Murid" 
                    required 
                    autoComplete="off" 
                    spellCheck="false"
                    className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-emerald-500 font-bold" 
                  />
                  <input 
                    name="password" 
                    type="text" 
                    placeholder="Buat Password" 
                    required 
                    autoComplete="new-password" 
                    spellCheck="false"
                    className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 outline-none focus:border-emerald-500 font-bold" 
                  />
                  
                  {/* Dropdown Kelas yang udah cantik */}
                  <ClassDropdown 
                    existingClasses={Object.keys(studentsByClass)} 
                    customClass="w-full p-4 bg-emerald-50 text-emerald-900 rounded-2xl border-2 border-emerald-200 outline-none focus:border-emerald-500 font-black placeholder:text-emerald-500 transition-all"
                  />

                  <button type="submit" className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 shadow-[0_5px_0_rgb(5,150,105)] active:translate-y-1 active:shadow-none transition-all mt-4">
                    BUAT AKUN
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-6">
                {Object.keys(studentsByClass).length === 0 ? (
                  <div className="text-center p-20 bg-white rounded-[30px] border-4 border-dashed border-slate-300 text-slate-400 font-bold">
                    Belum ada murid.
                  </div>
                ) : (
                  Object.entries(studentsByClass).map(
                    ([className, classStudents]: [string, any]) => (
                      <div
                        key={className}
                        className="bg-slate-100 p-2 rounded-[30px] border-2 border-slate-200 shadow-sm"
                      >
                        <div className="px-6 py-4 flex justify-between items-center">
                          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            📁 {className}
                          </h2>
                          <span className="text-xs font-black bg-white px-3 py-1 rounded-full text-slate-500 border border-slate-200">
                            {classStudents.length} Murid
                          </span>
                        </div>

                        <div className="space-y-2 p-2 pt-0">
                          {classStudents.map((s: any) => (
                            <div
                              key={s.id}
                              className="bg-white p-5 rounded-3xl border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 hover:shadow-md transition-all"
                            >
                              <div className="overflow-hidden pr-2">
                                <h4 className="font-black text-lg text-slate-900 truncate">
                                  {s.name}
                                </h4>
                                <p className="text-xs font-bold text-slate-500 mb-2 truncate">
                                  {s.email}
                                </p>
                                <span className="text-[10px] font-black text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
                                  🔑 {s.password}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-2 xl:justify-end">
                              <form action={updateStudentClass} className="flex gap-2 items-center">
                                <input type="hidden" name="id" value={s.id} />
                                
                                {/* Panggil Custom Component yang barusan kita buat */}
                                <ClassDropdown existingClasses={Object.keys(studentsByClass)} />

                                <button type="submit" className="p-2.5 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all font-bold text-xs shadow-sm">Pindah</button>
                              </form>
                                <form action={deleteStudent.bind(null, s.id)}>
                                  <button
                                    type="submit"
                                    className="p-2.5 px-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold text-xs border border-red-100 h-full"
                                  >
                                    Hapus
                                  </button>
                                </form>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 3: REPORT PROGRESS (DIKELOMPOKKAN)    */}
        {/* ========================================= */}
        {activeTab === "report" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-6xl mx-auto">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Laporan & Rekap 📊
              </h1>
              <p className="text-slate-500 mt-2 text-base md:text-lg">
                Pantau pencapaian materi dan rincian riwayat kehadiran murid per
                kelas.
              </p>
            </div>

            <div className="space-y-6">
              {Object.keys(studentsByClass).length === 0 ? (
                <div className="bg-white p-20 rounded-[40px] border-4 border-dashed border-slate-200 text-center text-slate-400 font-bold">
                  Belum ada data murid.
                </div>
              ) : (
                Object.entries(studentsByClass).map(
                  ([className, classStudents]: [string, any]) => (
                    <details
                      key={className}
                      className="group bg-white rounded-[40px] shadow-sm border-2 border-slate-200 overflow-hidden"
                      open
                    >
                      <summary className="cursor-pointer p-6 bg-slate-50 hover:bg-slate-100 transition-colors flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                          📁 {className}{" "}
                          <span className="text-sm font-bold bg-white px-3 py-1 rounded-full text-slate-500 border border-slate-200">
                            {classStudents.length} Murid
                          </span>
                        </h2>
                        <span className="text-2xl group-open:rotate-180 transition-transform text-slate-400">
                          ▼
                        </span>
                      </summary>

                      <div className="p-6 space-y-6 border-t-2 border-slate-100 bg-slate-50/50">
                        {classStudents.map(async (student: any) => {
                          const studentProgress = await prisma.progress.count({
                            where: { studentId: student.id },
                          });
                          const totalVocab = allVocab.length;
                          const percentage =
                            totalVocab === 0
                              ? 0
                              : Math.round(
                                  (studentProgress / totalVocab) * 100,
                                );
                          const attendances = await prisma.attendance.findMany({
                            where: { studentId: student.id },
                            orderBy: { date: "desc" },
                          });

                          const stats = {
                            Hadir: attendances.filter(
                              (a: any) => a.status === "Hadir",
                            ).length,
                            Izin: attendances.filter(
                              (a: any) => a.status === "Izin",
                            ).length,
                            Sakit: attendances.filter(
                              (a: any) => a.status === "Sakit",
                            ).length,
                            Alpa: attendances.filter(
                              (a: any) => a.status === "Alpa",
                            ).length,
                          };

                          return (
                            <div
                              key={student.id}
                              className="bg-white p-6 md:p-8 rounded-[30px] shadow-sm border-2 border-white hover:border-purple-200 transition-all flex flex-col gap-6"
                            >
                              {/* Card Content persis sama kayak sebelumnya */}
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner border-2 border-purple-200">
                                    🐼
                                  </div>
                                  <div>
                                    <h3 className="text-2xl font-black text-slate-800">
                                      {student.name}
                                    </h3>
                                    <p className="text-sm font-bold text-slate-400">
                                      {student.email}
                                    </p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
                                  <div className="bg-emerald-50 border-2 border-emerald-100 p-3 rounded-2xl text-center min-w-20">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase">
                                      Hadir
                                    </p>
                                    <p className="text-xl font-black text-emerald-700">
                                      {stats.Hadir}
                                    </p>
                                  </div>
                                  <div className="bg-blue-50 border-2 border-blue-100 p-3 rounded-2xl text-center min-w-20">
                                    <p className="text-[10px] font-black text-blue-600 uppercase">
                                      Izin
                                    </p>
                                    <p className="text-xl font-black text-blue-700">
                                      {stats.Izin}
                                    </p>
                                  </div>
                                  <div className="bg-amber-50 border-2 border-amber-100 p-3 rounded-2xl text-center min-w-20">
                                    <p className="text-[10px] font-black text-amber-600 uppercase">
                                      Sakit
                                    </p>
                                    <p className="text-xl font-black text-amber-700">
                                      {stats.Sakit}
                                    </p>
                                  </div>
                                  <div className="bg-red-50 border-2 border-red-100 p-3 rounded-2xl text-center min-w-20">
                                    <p className="text-[10px] font-black text-red-600 uppercase">
                                      Alpa
                                    </p>
                                    <p className="text-xl font-black text-red-700">
                                      {stats.Alpa}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <details className="group mt-2 outline-none">
                                <summary className="cursor-pointer text-sm font-black text-sky-700 bg-sky-50 border-2 border-sky-100 px-5 py-3 rounded-xl inline-flex items-center gap-3 hover:bg-sky-100 transition-all select-none list-none [&::-webkit-details-marker]:hidden">
                                  <span>📋 Lihat Riwayat Absen Lengkap</span>
                                  <span className="group-open:rotate-180 transition-transform text-lg">
                                    ▼
                                  </span>
                                </summary>
                                <div className="mt-4 bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-inner max-h-64 overflow-y-auto">
                                  <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-100 text-slate-600 sticky top-0">
                                      <tr>
                                        <th className="p-4 font-black border-b-2 border-slate-200">
                                          Tanggal Kelas
                                        </th>
                                        <th className="p-4 font-black border-b-2 border-slate-200">
                                          Status Kehadiran
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {attendances.length === 0 ? (
                                        <tr>
                                          <td
                                            colSpan={2}
                                            className="p-6 text-center text-slate-400 font-bold border-t border-slate-100"
                                          >
                                            Belum ada riwayat.
                                          </td>
                                        </tr>
                                      ) : (
                                        attendances.map((record: any) => (
                                          <tr
                                            key={record.id}
                                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                                          >
                                            <td className="p-4 font-bold text-slate-700">
                                              📅 {record.date}
                                            </td>
                                            <td className="p-4">
                                              <span
                                                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-black text-white ${record.status === "Hadir" ? "bg-emerald-500" : record.status === "Alpa" ? "bg-red-500" : record.status === "Sakit" ? "bg-amber-500" : "bg-blue-500"}`}
                                              >
                                                {record.status}
                                              </span>
                                            </td>
                                          </tr>
                                        ))
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </details>

                              <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 mt-2">
                                <div className="flex justify-between items-end mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">🀄</span>
                                    <span className="font-black text-slate-700">
                                      Pencapaian Hanzi
                                    </span>
                                  </div>
                                  <span className="text-sm font-black text-purple-600 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                                    {studentProgress} / {totalVocab} Kata (
                                    {percentage}%)
                                  </span>
                                </div>
                                <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden shadow-inner">
                                  <div
                                    className="bg-linear-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-1000 shadow-lg"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  ),
                )
              )}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 4: ABSENSI HARIAN (DIKELOMPOKKAN)     */}
        {/* ========================================= */}
        {activeTab === "attendance" &&
          (() => {
            const today = new Date(
              new Date().getTime() - new Date().getTimezoneOffset() * 60000,
            )
              .toISOString()
              .split("T")[0];
            const selectedDate = params.date || today;

            return (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-5xl mx-auto">
                <div className="mb-6 md:mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                      Absensi Harian 📅
                    </h1>
                    <p className="text-slate-500 mt-2 text-base md:text-lg">
                      Catat kehadiran murid untuk tanggal yang dipilih.
                    </p>
                  </div>
                  <form
                    method="GET"
                    className="bg-white p-2 rounded-2xl border-4 border-amber-100 shadow-sm flex items-center"
                  >
                    <input type="hidden" name="tab" value="attendance" />
                    <input type="hidden" name="name" value={teacherName} />
                    <label className="font-bold text-amber-700 mx-3 hidden md:block">
                      Pilih Tanggal:
                    </label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={selectedDate}
                      className="p-3 bg-amber-50 text-amber-900 rounded-xl outline-none font-black cursor-pointer border-2 border-transparent focus:border-amber-300 w-full md:w-auto"
                    />
                    <button
                      type="submit"
                      className="ml-3 px-6 py-3 bg-amber-500 text-white font-black rounded-xl hover:bg-amber-600 shadow-[0_4px_0_rgb(217,119,6)] active:translate-y-1 active:shadow-none transition-all"
                    >
                      CEK
                    </button>
                  </form>
                </div>

                <div className="space-y-6">
                  {Object.keys(studentsByClass).length === 0 ? (
                    <div className="bg-white p-20 rounded-[40px] border-4 border-dashed border-slate-200 text-center text-slate-400 font-bold">
                      Belum ada data murid.
                    </div>
                  ) : (
                    Object.entries(studentsByClass).map(
                      ([className, classStudents]: [string, any]) => (
                        <details
                          key={className}
                          className="group bg-white rounded-[40px] shadow-sm border-2 border-slate-200 overflow-hidden"
                          open
                        >
                          <summary className="cursor-pointer p-6 bg-amber-50 hover:bg-amber-100 transition-colors flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                            <h2 className="text-2xl font-black text-amber-900 flex items-center gap-3">
                              📁 {className}{" "}
                              <span className="text-sm font-bold bg-white px-3 py-1 rounded-full text-amber-600 border border-amber-200">
                                {classStudents.length} Murid
                              </span>
                            </h2>
                            <span className="text-2xl group-open:rotate-180 transition-transform text-amber-700">
                              ▼
                            </span>
                          </summary>

                          <div className="p-6 space-y-4 border-t-2 border-amber-100 bg-amber-50/30">
                            {classStudents.map(async (student: any) => {
                              const attendance =
                                await prisma.attendance.findUnique({
                                  where: {
                                    studentId_date: {
                                      studentId: student.id,
                                      date: selectedDate,
                                    },
                                  },
                                });
                              const currentStatus =
                                attendance?.status || "Belum Absen";
                              const statusColors: any = {
                                Hadir:
                                  "bg-emerald-500 text-white shadow-[0_4px_0_rgb(5,150,105)]",
                                Izin: "bg-blue-500 text-white shadow-[0_4px_0_rgb(37,99,235)]",
                                Sakit:
                                  "bg-amber-500 text-white shadow-[0_4px_0_rgb(217,119,6)]",
                                Alpa: "bg-red-500 text-white shadow-[0_4px_0_rgb(220,38,38)]",
                                "Belum Absen":
                                  "bg-white text-slate-500 border-2 border-slate-200 hover:bg-slate-50",
                              };

                              return (
                                <div
                                  key={student.id}
                                  className="bg-white p-5 border-2 border-slate-100 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-amber-200 transition-all shadow-sm"
                                >
                                  <div>
                                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                      {student.name}{" "}
                                      {currentStatus !== "Belum Absen" && (
                                        <span className="text-sm">✅</span>
                                      )}
                                    </h3>
                                    <p className="text-sm font-bold text-slate-400">
                                      {student.email}
                                    </p>
                                  </div>
                                  <form
                                    action={markAttendance}
                                    className="flex flex-wrap gap-2"
                                  >
                                    <input
                                      type="hidden"
                                      name="studentId"
                                      value={student.id}
                                    />
                                    <input
                                      type="hidden"
                                      name="date"
                                      value={selectedDate}
                                    />
                                    <input
                                      type="hidden"
                                      name="teacherName"
                                      value={teacherName}
                                    />
                                    {["Hadir", "Izin", "Sakit", "Alpa"].map(
                                      (status) => (
                                        <button
                                          key={status}
                                          type="submit"
                                          name="status"
                                          value={status}
                                          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all active:translate-y-1 active:shadow-none ${currentStatus === status ? statusColors[status] : statusColors["Belum Absen"]}`}
                                        >
                                          {status}
                                        </button>
                                      ),
                                    )}
                                  </form>
                                </div>
                              );
                            })}
                          </div>
                        </details>
                      ),
                    )
                  )}
                </div>
              </div>
            );
          })()}
      </main>
    </div>
  );
}
