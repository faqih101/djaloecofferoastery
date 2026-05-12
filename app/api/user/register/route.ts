import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { ok, err } from '@/lib/api';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { name, email, password } = body ?? {};
  if (!name?.trim()) return err('Nama wajib diisi');
  if (!email?.includes('@')) return err('Email tidak valid');
  if (!password || password.length < 8) return err('Password minimal 8 karakter');

  const emailLower = (email as string).toLowerCase().trim();
  if (await prisma.user.findUnique({ where: { email: emailLower } })) return err('Email sudah terdaftar', 409);

  const user = await prisma.user.create({ data: { name: (name as string).trim(), email: emailLower, passwordHash: await bcrypt.hash(password, 12) } });
  sendWelcomeEmail(user.email, user.name).catch(() => {});
  return ok({ message: 'Akun berhasil dibuat. Silakan login.' }, 201);
}
