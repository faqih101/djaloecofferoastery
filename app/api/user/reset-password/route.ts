import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { ok, err } from '@/lib/api';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { token, password } = body ?? {};
  if (!token) return err('Token tidak valid');
  if (!password || (password as string).length < 8) return err('Password minimal 8 karakter');
  const rt = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!rt || rt.used) return err('Token tidak valid atau sudah digunakan', 400);
  if (rt.expiresAt < new Date()) return err('Token kedaluwarsa. Minta link baru.', 400);
  await prisma.user.update({ where: { id: rt.userId }, data: { passwordHash: await bcrypt.hash(password, 12) } });
  await prisma.passwordResetToken.update({ where: { id: rt.id }, data: { used: true } });
  return ok({ message: 'Password berhasil diubah. Silakan login.' });
}
