import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api';

export async function GET() {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  return ok(await prisma.galleryItem.findMany({ orderBy: { sortOrder: 'asc' } }));
}
export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  const b = await req.json().catch(() => null);
  if (!b?.title) return err('Judul wajib');
  const g = await prisma.galleryItem.create({ data: { image: b.image ?? '', title: b.title, icon: b.icon ?? '📷', sortOrder: Number(b.sortOrder) || 0 } });
  return ok(g, 201);
}
