import { createClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ── Public client — safe to use in browser AND server ────────
export const supabase = createClient(url, anon);

// ── Server-only admin client (API routes only, never import in pages) ────
export function getSupabaseAdmin() {
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, svc, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ── Storage bucket name ───────────────────────────────────────
export const STORAGE_BUCKET = 'djaloe-assets';

// ── getPublicUrl — safe for client AND server ─────────────────
// Supabase Storage public URLs are deterministic:
// https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
export function getPublicUrl(path: string): string {
  if (!path) return '';
  // Already a full URL (already converted, from Google OAuth, etc.)
  if (path.startsWith('http')) return path;
  // Legacy: local /uploads/ path committed to repo
  if (path.startsWith('/')) return path;
  // Supabase storage path — build URL directly without needing service key
  return `${url}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}

// ── Upload helper — SERVER ONLY (API routes) ─────────────────
export async function uploadToStorage(
  file: File,
  path: string,
  contentType: string
): Promise<{ url: string; path: string } | null> {
  const admin = getSupabaseAdmin();
  const bytes = await file.arrayBuffer();

  const { data, error } = await admin.storage
    .from(STORAGE_BUCKET)
    .upload(path, bytes, { contentType, upsert: false });

  if (error) {
    console.error('[Supabase Storage] upload error:', error.message);
    return null;
  }

  return { url: getPublicUrl(data.path), path: data.path };
}

// ── Delete helper — SERVER ONLY ───────────────────────────────
export async function deleteFromStorage(storagePath: string): Promise<boolean> {
  const admin = getSupabaseAdmin();
  const { error } = await admin.storage.from(STORAGE_BUCKET).remove([storagePath]);
  if (error) console.error('[Supabase Storage] delete error:', error.message);
  return !error;
}
