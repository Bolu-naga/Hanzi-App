import { loginUser } from './actions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // 1. CEK TIKET COOKIE (TANPA MENJEBAK REDIRECT)
  const cookieStore = await cookies();
  const session = cookieStore.get('hanzi_session');
  let bypassUrl = ''; // Siapkan variabel penampung URL
  
  if (session) {
    try {
      const user = JSON.parse(session.value);
      // Jangan langsung redirect di sini, tampung dulu URL-nya
      if (user.role === 'teacher') {
        bypassUrl = `/teacher/dashboard?tab=vocab&name=${encodeURIComponent(user.name)}`;
      } else {
        bypassUrl = `/sessions?name=${encodeURIComponent(user.name)}&studentId=${user.id}`;
      }
    } catch (e) {
      // Abaikan kalau tiket rusak
    }
  }

  // 2. JALANKAN REDIRECT DI LUAR TRY-CATCH
  if (bypassUrl !== '') {
    redirect(bypassUrl);
  }

  // 3. KALAU BELUM LOGIN, TAMPILKAN FORM
  const params = await searchParams;
  const error = params.error;
  const activeRole = params.role === 'teacher' ? 'teacher' : 'student';

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 font-sans">
// ... (biarkan sisa kode UI form ke bawahnya tetap sama)
      <div className="bg-white p-10 rounded-[40px] shadow-2xl max-w-md w-full border-8 border-white text-center relative overflow-hidden transition-all">
        <div className="relative z-10">
          <span className="text-7xl mb-6 block animate-bounce">{activeRole === 'teacher' ? '🧑‍🏫' : '🐼'}</span>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
            {activeRole === 'teacher' ? 'Halo, Laoshi!' : 'Halo, Teman!'}
          </h1>
          <p className="text-slate-500 mb-8 font-medium">
            {activeRole === 'teacher' ? 'Masuk untuk kelola kelas.' : 'Siap belajar Hanzi hari ini?'}
          </p>

          <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 relative">
            <a href="/?role=student" className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all z-10 ${activeRole === 'student' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}>Murid</a>
            <a href="/?role=teacher" className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all z-10 ${activeRole === 'teacher' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}>Guru (Laoshi)</a>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm border-2 border-red-100 animate-shake">
              {error === 'wrong' ? '❌ Email atau Password salah!' : '⚠️ Harap isi semua kolom!'}
            </div>
          )}

          <form action={loginUser} className="flex flex-col gap-4" autoComplete="off">
            <input type="hidden" name="role" value={activeRole} />
            <input name="email" type="email" placeholder="Email..." required autoComplete="off" spellCheck="false" className="w-full p-5 bg-slate-50 rounded-3xl border-4 border-transparent focus:border-sky-400 focus:bg-white outline-none font-bold text-center text-lg transition-all placeholder:text-slate-400 text-slate-900" />
            <input name="password" type="password" placeholder="Password..." required autoComplete="new-password" spellCheck="false" className="w-full p-5 bg-slate-50 rounded-3xl border-4 border-transparent focus:border-sky-400 focus:bg-white outline-none font-bold text-center text-lg transition-all placeholder:text-slate-400 text-slate-900" />
            
            {/* 👇 CHECKBOX INGAT SAYA 👇 */}
            <div className="flex items-center gap-2 px-2 mt-2">
              <input type="checkbox" name="remember" id="remember" className="w-5 h-5 accent-sky-500 rounded cursor-pointer" />
              <label htmlFor="remember" className="text-sm font-bold text-slate-600 cursor-pointer select-none">Ingat saya di perangkat ini</label>
            </div>

            <button type="submit" className="w-full py-5 bg-sky-500 text-white rounded-3xl font-black text-xl hover:bg-sky-600 shadow-[0_8px_0_rgb(2,132,199)] active:translate-y-2 active:shadow-none transition-all mt-4">
              MASUK &rarr;
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}