import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api';

export async function GET() {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  return ok(await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } }));
}
export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  const b = await req.json().catch(() => null);
  if (!b?.name) return err('Nama wajib');
  const t = await prisma.testimonial.create({ data: { name: b.name, location: b.location ?? '', rating: Number(b.rating) || 5, review: b.review ?? '', date: b.date ?? '', initial: b.initial || b.name.charAt(0).toUpperCase(), sortOrder: Number(b.sortOrder) || 0 } });
  return ok(t, 201);
}
