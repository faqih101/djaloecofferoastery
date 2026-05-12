import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export const ok = <T>(data: T, status = 200) => NextResponse.json(data, { status });
export const err = (msg: string, status = 400) => NextResponse.json({ error: msg }, { status });

export async function requireAdmin() {
  const s = await getServerSession(authOptions);
  if (!s?.user || (s.user as any).role !== 'ADMIN') return null;
  return s;
}
export async function requireUser() {
  const s = await getServerSession(authOptions);
  if (!s?.user) return null;
  return s;
}
export function formatProduct(p: any) {
  return { ...p, notes: (p.notes ?? []).sort((a: any, b: any) => a.sortOrder - b.sortOrder).map((n: any) => n.note) };
}
export function settingsToObj(rows: { key: string; value: string }[]) {
  return Object.fromEntries(rows.map(r => [r.key, r.value]));
}
export function genFilename(prefix: string, ext: string) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}.${ext}`;
}
export function isAllowedImg(mime: string) {
  return ['image/jpeg','image/png','image/webp','image/gif'].includes(mime);
}
