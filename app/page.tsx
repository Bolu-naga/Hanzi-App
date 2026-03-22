import { loginUser } from './actions';

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params.error;
  const activeRole = params.role === 'teacher' ? 'teacher' : 'student';

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl max-w-md w-full border-8 border-white text-center relative overflow-hidden transition-all">
        
        <div className="relative z-10">
          <span className="text-7xl mb-6 block animate-bounce">
            {activeRole === 'teacher' ? '🧑‍🏫' : '🐼'}
          </span>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
            {activeRole === 'teacher' ? 'Halo, Laoshi!' : 'Halo, Teman!'}
          </h1>
          <p className="text-slate-500 mb-8 font-medium">
            {activeRole === 'teacher' ? 'Masuk untuk kelola kelas.' : 'Siap belajar Hanzi hari ini?'}
          </p>

          <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 relative">
            <a href="/?role=student" className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all z-10 ${activeTab(activeRole, 'student')}`}>Murid</a>
            <a href="/?role=teacher" className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all z-10 ${activeTab(activeRole, 'teacher')}`}>Guru (Laoshi)</a>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm border-2 border-red-100 animate-shake">
              {error === 'wrong' ? '❌ Email atau Password salah!' : '⚠️ Harap isi semua kolom!'}
            </div>
          )}

          {/* FORM DENGAN AUTOCOMPLETE DIMATIKAN */}
          <form action={loginUser} className="flex flex-col gap-4" autoComplete="off">
            <input type="hidden" name="role" value={activeRole} />

            <input 
              name="email"
              type="email" 
              placeholder="Email..."
              required
              // Trik mematikan history dropdown email
              autoComplete="off" 
              spellCheck="false"
              className="w-full p-5 bg-slate-50 rounded-3xl border-4 border-transparent focus:border-sky-400 focus:bg-white outline-none font-bold text-center text-lg transition-all placeholder:text-slate-400 text-slate-900"
            />
            <input 
              name="password"
              type="password" 
              placeholder="Password..."
              required
              // Trik "new-password" ampuh buat ngusir pop-up "Suggest Strong Password" dari Google Chrome
              autoComplete="new-password" 
              spellCheck="false"
              className="w-full p-5 bg-slate-50 rounded-3xl border-4 border-transparent focus:border-sky-400 focus:bg-white outline-none font-bold text-center text-lg transition-all placeholder:text-slate-400 text-slate-900"
            />
            
            <button 
              type="submit"
              className="w-full py-5 bg-sky-500 text-white rounded-3xl font-black text-xl hover:bg-sky-600 shadow-[0_8px_0_rgb(2,132,199)] active:translate-y-2 active:shadow-none transition-all mt-4"
            >
              MASUK &rarr;
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

// Helper function biar kodenya rapi
function activeTab(currentRole: string, tabRole: string) {
  return currentRole === tabRole ? 'bg-white shadow-sm text-sky-600' : 'text-slate-400 hover:text-slate-600';
}