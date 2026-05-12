import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireUser } from '@/lib/api';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const productId = Number(req.nextUrl.searchParams.get('productId'));
  if (!productId) return err('productId wajib');
  const reviews = await prisma.review.findMany({
    where: { productId, status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, image: true } } },
  });
  return ok(reviews);
}

export async function POST(req: NextRequest) {
  const session = await requireUser();
  if (!session) return err('Harus login untuk memberikan ulasan', 401);
  const body = await req.json().catch(() => null);
  const { productId, rating, comment } = body ?? {};
  if (!productId) return err('productId wajib');
  if (!rating || Number(rating) < 1 || Number(rating) > 5) return err('Rating harus 1–5');
  if (!comment?.trim()) return err('Komentar tidak boleh kosong');

  const userId = (session.user as any).id as string;
  const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
  if (!product) return err('Produk tidak ditemukan', 404);

  const existing = await prisma.review.findUnique({ where: { productId_userId: { productId: Number(productId), userId } } });
  if (existing) return err('Kamu sudah mereview produk ini', 409);

  const review = await prisma.review.create({
    data: { productId: Number(productId), userId, rating: Number(rating), comment: comment.trim() },
    include: { user: { select: { name: true, image: true } } },
  });
  return ok(review, 201);
}
