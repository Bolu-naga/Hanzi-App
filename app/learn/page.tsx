import prisma from '@/lib/prisma';
import WritingCanvasContainer from '@/components/WritingCanvasContainer';
import Link from 'next/link';

export default async function LearnPage(props: { searchParams: Promise<{ session?: string; name?: string; studentId?: string }> }) {
  const params = await props.searchParams;
  const session = parseInt(params.session || '1');
  const name = params.name || 'Murid';
  const studentId = params.studentId || '';

  const vocabs = await prisma.vocab.findMany({
    where: { session: session },
    orderBy: { id: 'asc' }
  });

  if (vocabs.length === 0) {
    return (
      <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-10 font-sans">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center border-4 border-white">
          <p className="text-2xl font-black text-slate-800 mb-4">Waduh, Sesi {session} belum ada materi!</p>
          <Link href={`/sessions?name=${encodeURIComponent(name)}&studentId=${studentId}`} className="px-6 py-3 bg-sky-500 text-white font-bold rounded-xl hover:bg-sky-600 transition-all inline-block">
            &larr; Kembali ke Kelas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-sky-50 flex flex-col items-center py-10 px-4 font-sans">
      <WritingCanvasContainer 
        vocabs={vocabs} 
        studentName={name}
        studentId={studentId} 
      />
    </main>
  );
}