import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  const b = await req.json().catch(() => null);
  if (!b) return err('Data tidak valid');
  const v = await prisma.companyValue.update({
    where: { id: Number(params.id) },
    data: { icon: b.icon ?? '⭐', title: b.title, body: b.body ?? '', sortOrder: Number(b.sortOrder) || 0 },
  });
  return ok(v);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  await prisma.companyValue.delete({ where: { id: Number(params.id) } });
  return ok({ message: 'Value dihapus' });
}
