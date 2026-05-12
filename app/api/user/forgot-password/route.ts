import { NextRequest } from 'next/server';
import { v4 as uuid } from 'uuid';
import { prisma } from '@/lib/prisma';
import { ok, err } from '@/lib/api';
import { sendResetEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email) return err('Email wajib');
  const email = (body.email as string).toLowerCase().trim();
  const MSG = { message: 'Jika email terdaftar, link reset akan dikirim.' };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return ok(MSG);
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, used: false } });
  const token = uuid();
  await prisma.passwordResetToken.create({ data: { userId: user.id, token, expiresAt: new Date(Date.now() + 3600_000) } });
  await sendResetEmail(user.email, user.name, token);
  return ok(MSG);
}
