import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true, image: true } },
      product: { select: { name: true, productSlug: true } },
    },
  });
  return ok(reviews);
}
