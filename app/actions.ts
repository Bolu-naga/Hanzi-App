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
    redirect(`/teacher/dashboard?tab=vocab&name=${encodeURIComponent(teacher.name)}`);
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

  if (!name || !email || !password) redirect('/teacher/dashboard?tab=students&error=missing_student');

  try {
    await prisma.student.create({ data: { name, email, password } });
  } catch (error) {
    redirect('/teacher/dashboard?tab=students&error=email_exists');
  }
  redirect('/teacher/dashboard?tab=students&success=student_added');
}

export async function deleteStudent(id: string) {
  await prisma.progress.deleteMany({ where: { studentId: id } });
  await prisma.student.delete({ where: { id } });
  redirect('/teacher/dashboard?tab=students');
}

// ==========================================
// 4. FUNGSI SIMPAN PROGRESS MURID
// ==========================================
export async function saveProgress(studentId: string, vocabId: string) {
  if (!studentId || !vocabId) return;
  // Cek apakah Hanzi ini sudah pernah diselesaikan sebelumnya
  const exist = await prisma.progress.findFirst({
    where: { studentId, vocabId }
  });
  
  // Kalau belum ada, catat di database!
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

  // upsert = Kalau hari ini belum absen, Create. Kalau udah absen tapi Laoshi salah pencet, Update.
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

  // Karena ini MVP (1 guru), kita ambil guru pertama di database lalu update catatannya
  const teacher = await prisma.teacher.findFirst();
  if (teacher) {
    await prisma.teacher.update({
      where: { id: teacher.id },
      data: { dailyNote: note }
    });
  }
  
  redirect('/teacher/dashboard?tab=students&success=note_updated');
}