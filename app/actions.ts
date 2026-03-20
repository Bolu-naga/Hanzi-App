'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

// ==========================================
// FUNGSI UNTUK MURID (JANGAN DIHAPUS)
// ==========================================
export async function loginStudent(formData: FormData) {
  const accessCode = formData.get('accessCode')?.toString().toUpperCase();
  const studentName = formData.get('studentName')?.toString();

  if (!accessCode || !studentName) {
    redirect('/?error=missing');
  }

  const partner = await prisma.partner.findUnique({
    where: { accessCode },
  });

  if (!partner) {
    redirect('/?error=wrong');
  }

  redirect(`/sessions?name=${encodeURIComponent(studentName)}&partnerId=${partner.id}`);
}

// ==========================================
// FUNGSI UNTUK GURU
// ==========================================
export async function addVocab(formData: FormData) {
  const hanzi = formData.get('hanzi')?.toString();
  const pinyin = formData.get('pinyin')?.toString();
  const meaning = formData.get('meaning')?.toString();
  const session = parseInt(formData.get('session')?.toString() || '1');
  const level = parseInt(formData.get('level')?.toString() || '1');

  if (!hanzi || !pinyin || !meaning) {
     redirect('/teacher/dashboard?error=missing');
  }

  await prisma.vocab.create({
    data: { hanzi, pinyin, meaning, session, level },
  });

  redirect('/teacher/dashboard');
}

export async function deleteVocab(id: string) {
  await prisma.vocab.delete({ where: { id } });
  redirect('/teacher/dashboard');
}