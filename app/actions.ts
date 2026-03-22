'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

// ==========================================
// 1. FUNGSI LOGIN (GURU & MURID)
// ==========================================
export async function loginUser(formData: FormData) {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const role = formData.get('role')?.toString();

  if (!email || !password) redirect(`/?error=missing&role=${role}`);

  if (role === 'teacher') {
    const teacher = await prisma.teacher.findUnique({ where: { email } });
    if (!teacher || teacher.password !== password) redirect(`/?error=wrong&role=teacher`);
    redirect(`/teacher/dashboard?name=${encodeURIComponent(teacher.name)}`);
  } else {
    const student = await prisma.student.findUnique({ where: { email } });
    if (!student || student.password !== password) redirect(`/?error=wrong&role=student`);
    redirect(`/sessions?name=${encodeURIComponent(student.name)}&studentId=${student.id}`);
  }
}

// ==========================================
// 2. FUNGSI MANAJEMEN HANZI (VOCAB)
// ==========================================
export async function addVocab(formData: FormData) {
  const hanzi = formData.get('hanzi')?.toString();
  const pinyin = formData.get('pinyin')?.toString();
  const meaning = formData.get('meaning')?.toString();
  const session = parseInt(formData.get('session')?.toString() || '1');
  const level = parseInt(formData.get('level')?.toString() || '1');

  if (!hanzi || !pinyin || !meaning) redirect('/teacher/dashboard?error=missing');

  await prisma.vocab.create({
    data: { hanzi, pinyin, meaning, session, level },
  });
  redirect('/teacher/dashboard');
}

export async function deleteVocab(id: string) {
  await prisma.vocab.delete({ where: { id } });
  redirect('/teacher/dashboard');
}

// ==========================================
// 3. FUNGSI MANAJEMEN MURID (BARU!)
// ==========================================
export async function registerStudent(formData: FormData) {
  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!name || !email || !password) redirect('/teacher/dashboard?error=missing_student');

  try {
    await prisma.student.create({
      data: { name, email, password },
    });
  } catch (error) {
    // Kalau email udah ada di database, Prisma bakal lempar error
    redirect('/teacher/dashboard?error=email_exists');
  }

  redirect('/teacher/dashboard?success=student_added');
}

export async function deleteStudent(id: string) {
  // Hapus semua progress murid ini dulu biar gak nyangkut (Cascade delete manual)
  await prisma.progress.deleteMany({ where: { studentId: id } });
  // Baru hapus akun muridnya
  await prisma.student.delete({ where: { id } });
  redirect('/teacher/dashboard');
}