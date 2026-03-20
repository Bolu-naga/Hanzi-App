import { PrismaClient } from '@prisma/client';

// KITA PAKSA MASUKKIN URL LANGSUNG DI SINI. 
// GAK USAH PAKE .ENV DULU BIAR GAK ADA ALASAN PRISMA GAK BISA BACA.
const DATABASE_URL_LANGSUNG = "postgresql://postgres.qzqhyyfjyifbnxrfduvs:Denpasar72920306_@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL_LANGSUNG,
    },
  },
} as any);

async function main() {
  console.log('🚀 PAKSA SEEDING KE SUPABASE...');

  // 1. Masukkan Partner
  await prisma.partner.upsert({
    where: { accessCode: 'LESMANDARIN' },
    update: {},
    create: {
      name: 'Mandarin Center Indonesia',
      accessCode: 'LESMANDARIN',
    },
  });

  // 2. Masukkan Hanzi
  const vocabs = [
    { id: 's1', hanzi: '一', pinyin: 'yī', meaning: 'Satu', level: 1, session: 1 },
    { id: 's2', hanzi: '二', pinyin: 'èr', meaning: 'Dua', level: 1, session: 1 },
    { id: 's3', hanzi: '三', pinyin: 'sān', meaning: 'Tiga', level: 1, session: 1 },
  ];

  for (const v of vocabs) {
    await prisma.vocab.upsert({
      where: { id: v.id },
      update: {},
      create: v
    });
  }

  console.log('✅ BERHASIL! DATA SUDAH MASUK.');
}

main()
  .catch((e) => { 
    console.error("❌ MASIH ERROR:", e); 
    process.exit(1); 
  })
  .finally(async () => { 
    await prisma.$disconnect(); 
  });