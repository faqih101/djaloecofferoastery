import { prisma } from '@/lib/prisma';
import { ok, err, formatProduct, settingsToObj } from '@/lib/api';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rawProducts, gallery, rows, companyValues, approvedReviews] = await Promise.all([
      prisma.product.findMany({
        orderBy: { sortOrder: 'asc' },
        include: { notes: { orderBy: { sortOrder: 'asc' } } },
      }),
      prisma.galleryItem.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.setting.findMany(),
      prisma.companyValue.findMany({ orderBy: { sortOrder: 'asc' } }),
      // Ambil reviews yang APPROVED, tampilkan sebagai "What They Say"
      prisma.review.findMany({
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        take: 9, // maks 9 review di homepage
        include: {
          user: { select: { name: true, image: true } },
          product: { select: { name: true, productSlug: true } },
        },
      }),
    ]);

    return ok({
      products: rawProducts.map(formatProduct),
      gallery,
      settings: settingsToObj(rows),
      companyValues,
      // "testimonials" sekarang = reviews yang sudah approved dari user nyata
      testimonials: approvedReviews.map(r => ({
        id: r.id,
        name: r.user.name,
        location: r.product.name, // tampilkan nama produk sebagai "lokasi"
        rating: r.rating,
        review: r.comment,
        date: new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        initial: r.user.name.charAt(0).toUpperCase(),
        image: r.user.image,
        productName: r.product.name,
        productSlug: r.product.productSlug,
      })),
    });
  } catch (e: any) {
    return err('Gagal ambil data: ' + e.message, 500);
  }
}
