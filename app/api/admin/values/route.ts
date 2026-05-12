import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api';

export async function GET() {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  return ok(await prisma.companyValue.findMany({ orderBy: { sortOrder: 'asc' } }));
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  const b = await req.json().catch(() => null);
  if (!b?.title) return err('Judul wajib diisi');
  const v = await prisma.companyValue.create({
    data: {
      icon: b.icon ?? '⭐',
      title: b.title,
      body: b.body ?? '',
      sortOrder: Number(b.sortOrder) || 0,
    },
  });
  return ok(v, 201);
}
