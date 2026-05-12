import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  const body = await req.json().catch(() => null);
  const status = body?.status;
  if (!['APPROVED','REJECTED','PENDING'].includes(status)) return err('Status tidak valid');
  const review = await prisma.review.update({
    where: { id: Number(params.id) }, data: { status },
    include: { user: { select: { name: true, email: true } }, product: { select: { name: true } } },
  });
  return ok(review);
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  await prisma.review.delete({ where: { id: Number(params.id) } });
  return ok({ message: 'Review dihapus' });
}
