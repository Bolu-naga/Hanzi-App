import pg from 'pg';

// Pake URL yang port 5432 (Direct Connection)
const connectionString = "postgresql://postgres.qzqhyyfjyifbnxrfduvs:Denpasar72920306_@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";

const client = new pg.Client({ connectionString });

async function run() {
  try {
    console.log("🚀 Menghubungkan langsung ke Postgres...");
    await client.connect();

    // 1. Masukin Partner (Kode Akses)
    console.log("📝 Menyiapkan Partner...");
    await client.query(`
      INSERT INTO "Partner" (id, name, "accessCode") 
      VALUES ('p1', 'Mandarin Center Indonesia', 'LESMANDARIN')
      ON CONFLICT ("accessCode") DO UPDATE SET name = EXCLUDED.name;
    `);

    // 2. Masukin Hanzi
    console.log("📝 Menyiapkan Daftar Hanzi...");
    const vocabs = [
      ['s1', 1, 1, '一', 'yī', 'Satu'],
      ['s2', 1, 1, '二', 'èr', 'Dua'],
      ['s3', 1, 1, '三', 'sān', 'Tiga']
    ];

    for (const v of vocabs) {
      await client.query(`
        INSERT INTO "Vocab" (id, level, session, hanzi, pinyin, meaning)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET hanzi = EXCLUDED.hanzi;
      `, v);
    }

    console.log("✅ DATA BERHASIL MASUK SEMUA!");
  } catch (err) {
    console.error("❌ ERROR GAGAL TOTAL:", err.message);
  } finally {
    await client.end();
  }
}

run();