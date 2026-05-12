import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  const b = await req.json().catch(() => null);
  if (!b) return err('Data tidak valid');
  const t = await prisma.testimonial.update({ where: { id: Number(params.id) }, data: { name: b.name, location: b.location ?? '', rating: Number(b.rating) || 5, review: b.review ?? '', date: b.date ?? '', initial: b.initial || b.name.charAt(0).toUpperCase(), sortOrder: Number(b.sortOrder) || 0 } });
  return ok(t);
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  await prisma.testimonial.delete({ where: { id: Number(params.id) } });
  return ok({ message: 'Dihapus' });
}
