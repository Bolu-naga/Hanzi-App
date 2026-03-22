'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// ==========================================
// 1. FUNGSI LOGIN (DENGAN COOKIES)
// ==========================================
export async function loginUser(formData: FormData) {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const role = formData.get('role')?.toString();
  const remember = formData.get('remember') === 'on';

  if (!email || !password) redirect(`/?error=missing&role=${role}`);

  const cookieStore = await cookies();
  const maxAge = remember ? 60 * 60 * 24 * 30 : undefined; 

  if (role === 'teacher') {
    const teacher = await prisma.teacher.findUnique({ where: { email } });
    if (!teacher || teacher.password !== password) redirect(`/?error=wrong&role=teacher`);
    
    cookieStore.set('hanzi_session', JSON.stringify({ id: teacher.id, role: 'teacher', name: teacher.name }), { httpOnly: true, maxAge });
    redirect(`/teacher/dashboard?tab=vocab&name=${encodeURIComponent(teacher.name)}`);
  
  } else {
    const student = await prisma.student.findUnique({ where: { email } });
    if (!student || student.password !== password) redirect(`/?error=wrong&role=student`);
    
    cookieStore.set('hanzi_session', JSON.stringify({ id: student.id, role: 'student', name: student.name }), { httpOnly: true, maxAge });
    redirect(`/sessions?name=${encodeURIComponent(student.name)}&studentId=${student.id}`);
  }
}

// ==========================================
// FUNGSI LOGOUT
// ==========================================
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('hanzi_session');
  redirect('/');
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

  if (!hanzi || !pinyin || !meaning) redirect('/teacher/dashboard?tab=vocab&error=missing');

  await prisma.vocab.create({ data: { hanzi, pinyin, meaning, session, level } });
  redirect('/teacher/dashboard?tab=vocab');
}

export async function deleteVocab(id: string) {
  await prisma.vocab.delete({ where: { id } });
  redirect('/teacher/dashboard?tab=vocab');
}

// ==========================================
// 3. FUNGSI MANAJEMEN MURID
// ==========================================
export async function registerStudent(formData: FormData) {
  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const className = formData.get('className')?.toString() || 'Kelas Umum';

  if (!name || !email || !password) redirect('/teacher/dashboard?tab=students&error=missing_student');

  try {
    await prisma.student.create({ data: { name, email, password, className } });
  } catch (error) {
    redirect('/teacher/dashboard?tab=students&error=email_exists');
  }
  redirect('/teacher/dashboard?tab=students&success=student_added');
}

// 👇 INI YANG TADI ILANG (FUNGSI HAPUS MURID) 👇
export async function deleteStudent(id: string) {
  // Hapus data relasi dulu biar nggak nyangkut
  await prisma.progress.deleteMany({ where: { studentId: id } });
  await prisma.attendance.deleteMany({ where: { studentId: id } });
  
  // Baru hapus akun muridnya
  await prisma.student.delete({ where: { id } });
  redirect('/teacher/dashboard?tab=students');
}

// ==========================================
// 4. FUNGSI SIMPAN PROGRESS MURID
// ==========================================
export async function saveProgress(studentId: string, vocabId: string) {
  if (!studentId || !vocabId) return;
  const exist = await prisma.progress.findFirst({
    where: { studentId, vocabId }
  });
  
  if (!exist) {
    await prisma.progress.create({
      data: { studentId, vocabId, isDone: true }
    });
  }
}

// ==========================================
// 5. FUNGSI ABSENSI HARIAN
// ==========================================
export async function markAttendance(formData: FormData) {
  const studentId = formData.get('studentId')?.toString();
  const date = formData.get('date')?.toString();
  const status = formData.get('status')?.toString();
  const teacherName = formData.get('teacherName')?.toString() || 'Laoshi';

  if (!studentId || !date || !status) return;

  await prisma.attendance.upsert({
    where: {
      studentId_date: { studentId, date }
    },
    update: { status },
    create: { studentId, date, status }
  });

  redirect(`/teacher/dashboard?tab=attendance&date=${date}&name=${encodeURIComponent(teacherName)}`);
}

// ==========================================
// 6. FUNGSI UPDATE PENGUMUMAN MURID
// ==========================================
export async function updateDailyNote(formData: FormData) {
  const note = formData.get('note')?.toString();
  if (!note) return;

  const teacher = await prisma.teacher.findFirst();
  if (teacher) {
    await prisma.teacher.update({
      where: { id: teacher.id },
      data: { dailyNote: note }
    });
  }
  
  redirect('/teacher/dashboard?tab=students&success=note_updated');
}

// ==========================================
// 7. FUNGSI EDIT/PINDAH KELAS MURID
// ==========================================
export async function updateStudentClass(formData: FormData) {
  const id = formData.get('id')?.toString();
  const className = formData.get('className')?.toString();
  
  if (!id || !className) return;

  await prisma.student.update({
    where: { id },
    data: { className }
  });
  
  redirect('/teacher/dashboard?tab=students&success=class_updated');
}