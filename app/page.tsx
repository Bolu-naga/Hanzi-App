import { loginStudent } from './actions';

// Definisi tipe supaya TypeScript tidak komplain "implicitly any"
interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // Tunggu searchParams karena di Next.js terbaru ini adalah Promise
  const params = await searchParams;
  const error = params.error;

  return (
    <main className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-sky-200/50 max-w-md w-full border-8 border-white text-center relative overflow-hidden">
        
        <div className="relative z-10">
          <span className="text-7xl mb-6 block animate-bounce">🐼</span>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Halo!</h1>
          <p className="text-slate-500 mb-8 font-medium">Siap belajar menulis Hanzi hari ini?</p>

          {/* Menampilkan pesan error jika ada di URL */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm border-2 border-red-100 animate-shake">
              {error === 'wrong' ? '❌ Kode akses salah!' : '⚠️ Isi nama dan kode ya!'}
            </div>
          )}

          <form action={loginStudent} className="flex flex-col gap-4">
            <input 
              name="studentName"
              type="text" 
              placeholder="Tulis Namamu..."
              required
              className="w-full p-5 bg-slate-50 rounded-3xl border-4 border-transparent focus:border-sky-400 focus:bg-white outline-none font-bold text-center text-xl transition-all placeholder:text-slate-300 text-slate-900"
            />
            <input 
              name="accessCode"
              type="text" 
              placeholder="Kode Akses..."
              required
              className="w-full p-5 bg-slate-50 rounded-3xl border-4 border-transparent focus:border-sky-400 focus:bg-white outline-none font-bold text-center text-xl tracking-[0.2em] transition-all placeholder:text-slate-300 text-slate-900"
            />
            
            <button 
              type="submit"
              className="w-full py-5 bg-sky-500 text-white rounded-3xl font-black text-2xl hover:bg-sky-600 shadow-[0_8px_0_rgb(2,132,199)] active:translate-y-2 active:shadow-none transition-all mt-4"
            >
              MASUK &rarr;
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}