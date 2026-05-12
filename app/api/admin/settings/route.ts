import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin, settingsToObj } from '@/lib/api';

const ALLOWED_KEYS = ['hero_title_line1','hero_title_line2','hero_title_line3','hero_badge_text','hero_badge_sub1','hero_badge_sub2','about_title_line1','about_title_line2','about_paragraph1','about_paragraph2','about_quote','about_image','contact_desc','contact_whatsapp','contact_location'];

export async function GET() {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  return ok(settingsToObj(await prisma.setting.findMany()));
}
export async function PUT(req: NextRequest) {
  if (!await requireAdmin()) return err('Unauthorized', 401);
  const body = await req.json().catch(() => null);
  if (!body) return err('Data tidak valid');
  for (const key of ALLOWED_KEYS) {
    if (key in body) await prisma.setting.upsert({ where: { key }, update: { value: String(body[key] ?? '') }, create: { key, value: String(body[key] ?? '') } });
  }
  return ok(settingsToObj(await prisma.setting.findMany()));
}
