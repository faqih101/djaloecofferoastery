import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin, formatProduct } from '@/lib/api';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  const body = await req.json().catch(() => null);
  if (!body) return err('Data tidak valid');
  const { notes = [], ...data } = body;
  await prisma.productNote.deleteMany({ where: { productId: Number(params.id) } });
  const product = await prisma.product.update({
    where: { id: Number(params.id) },
    data: {
      productSlug: data.productSlug, name: data.name, origin: data.origin ?? '',
      description: data.description ?? '', roastLevel: data.roastLevel ?? 'Medium',
      image: data.image ?? '', sortOrder: Number(data.sortOrder) || 0,
      notes: { create: (notes as string[]).filter(Boolean).map((note, i) => ({ note, sortOrder: i })) },
    },
    include: { notes: true },
  });
  return ok(formatProduct(product));
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  await prisma.product.delete({ where: { id: Number(params.id) } });
  return ok({ message: 'Produk dihapus' });
}
