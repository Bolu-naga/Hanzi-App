import prisma from '@/lib/prisma';
import WritingCanvasContainer from '@/components/WritingCanvasContainer';

interface LearnPageProps {
  searchParams: Promise<{ session: string; name: string }>;
}

export default async function LearnPage({ searchParams }: LearnPageProps) {
  const params = await searchParams;
  const session = parseInt(params.session || '1');
  const name = params.name || 'Murid';

  // Ambil data Hanzi asli dari database
  const vocabs = await prisma.vocab.findMany({
    where: { session: session },
    orderBy: { id: 'asc' }
  });

  if (vocabs.length === 0) {
    return <div className="p-10 text-center">Waduh, sesi ini belum ada soalnya!</div>;
  }

  return (
    <main className="min-h-screen bg-sky-50 flex flex-col items-center py-10 px-4 font-sans">
      <WritingCanvasContainer 
        vocabs={vocabs} 
        studentName={name} 
      />
    </main>
  );
}