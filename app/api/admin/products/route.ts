import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin, formatProduct } from '@/lib/api';

export async function GET() {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  const products = await prisma.product.findMany({ orderBy: { sortOrder: 'asc' }, include: { notes: { orderBy: { sortOrder: 'asc' } } } });
  return ok(products.map(formatProduct));
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.productSlug) return err('name dan productSlug wajib');
  const { notes = [], ...data } = body;
  const product = await prisma.product.create({
    data: {
      productSlug: data.productSlug, name: data.name, origin: data.origin ?? '',
      description: data.description ?? '', roastLevel: data.roastLevel ?? 'Medium',
      image: data.image ?? '', sortOrder: Number(data.sortOrder) || 0,
      notes: { create: (notes as string[]).filter(Boolean).map((note, i) => ({ note, sortOrder: i })) },
    },
    include: { notes: true },
  });
  return ok(formatProduct(product), 201);
}
