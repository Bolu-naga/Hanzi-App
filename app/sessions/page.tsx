import prisma from '@/lib/prisma';
import Link from 'next/link';

// 1. Definisi tipe untuk TypeScript agar tidak komplain
interface SessionsPageProps {
  searchParams: Promise<{ name: string; partnerId: string }>;
}

// 2. Gunakan async Server Component
export default async function SessionsPage({ searchParams }: SessionsPageProps) {
  // 3. Tunggu params karena Next.js terbaru mengharuskannya
  const params = await searchParams;
  const name = params.name;
  const partnerId = params.partnerId;

  // 4. Ambil daftar sesi UNIK yang ada di database
  const sessionsGroup = await prisma.vocab.groupBy({
    by: ['session'],
    orderBy: {
      session: 'asc',
    },
  });

  return (
    <main className="min-h-screen bg-sky-50 p-8 flex flex-col items-center font-sans">
      <div className="max-w-2xl w-full">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-black text-slate-900"> Halo, {name || 'Teman Kecil'}! 👋</h1>
          <p className="text-slate-600 font-medium">Pilih sesi belajarmu hari ini ya:</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {sessionsGroup.map((s: { session: number }) => (
  <Link 
    key={s.session}
    href={`/learn?session=${s.session}&name=${encodeURIComponent(name || '')}&partnerId=${partnerId || ''}`}
    className="bg-white p-8 rounded-[35px] shadow-xl shadow-sky-100/50 border-4 border-white hover:border-sky-400 hover:-translate-y-2 active:scale-95 active:shadow-none transition-all group w-full block"
            >
              <div className="flex flex-col items-center">
                <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">📚</span>
                <h3 className="text-2xl font-black text-slate-900">Sesi {s.session}</h3>
                <p className="text-slate-400 font-bold mt-1 text-sm uppercase tracking-widest">Klik untuk Mulai</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}