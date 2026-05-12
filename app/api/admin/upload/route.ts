import { NextRequest } from 'next/server';
import { ok, err, requireAdmin, genFilename, isAllowedImg } from '@/lib/api';
import { uploadToStorage } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return err('Unauthorized', 401);

  const formData = await req.formData().catch(() => null);
  if (!formData) return err('FormData tidak valid');

  const file = formData.get('file') as File | null;
  const type = (formData.get('type') as string) || 'product';

  if (!file) return err('File tidak ditemukan');
  if (!['product', 'gallery', 'about'].includes(type)) return err('Tipe tidak valid');
  if (!isAllowedImg(file.type)) return err('Format tidak didukung. Gunakan jpg/png/webp/gif');
  if (file.size > 10 * 1024 * 1024) return err('Ukuran max 10MB');

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const filename = genFilename(type, ext);
  const path = `${type}/${filename}`;

  const result = await uploadToStorage(file, path, file.type);
  if (!result) return err('Upload ke Supabase Storage gagal. Pastikan bucket "djaloe-assets" sudah dibuat dan public.', 500);

  // Return the full Supabase public URL as filename so it can be stored in DB
  return ok({ filename: result.url, url: result.url, path: result.path });
}
