# Djaloe Coffee Roastery

**Stack:** Next.js 14 · PostgreSQL (Supabase) · Prisma · NextAuth · Resend · Supabase Storage

---

## Cara Setup Supabase (wajib sebelum run)

### 1. Buat project Supabase
1. Daftar di [supabase.com](https://supabase.com) → New Project
2. Pilih region terdekat (Singapore)
3. Catat **password** database

### 2. Ambil credentials
Buka **Project Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL` → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon public key
- `SUPABASE_SERVICE_ROLE_KEY` → service_role key (rahasia!)

Buka **Project Settings → Database → Connection string**:
- Pilih **Transaction** pooler → `DATABASE_URL`
- Pilih **Session** pooler → `DIRECT_URL`

### 3. Buat Storage Bucket
1. Supabase dashboard → **Storage** → New bucket
2. Nama bucket: **`djaloe-assets`**
3. Centang **Public bucket** ✅
4. Klik Save

### 4. Push schema + seed data
```bash
npm install
cp .env.example .env.local
# isi .env.local dengan credentials Supabase

npm run db:push    # buat semua tabel
npm run db:seed    # isi data awal
```

### 5. Jalankan lokal
```bash
npm run dev
# http://localhost:3000
# http://localhost:3000/admin  (login dengan ADMIN_EMAIL/ADMIN_PASSWORD)
```

---

## Deploy ke Vercel

### 1. Push ke GitHub
```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/username/djaloe-coffee.git
git push -u origin main
```

### 2. Import di Vercel
1. [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. Framework: **Next.js** (auto-detected)

### 3. Environment Variables di Vercel
Settings → Environment Variables → tambahkan semua:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` |
| `DATABASE_URL` | Supabase Transaction pooler URL |
| `DIRECT_URL` | Supabase Session pooler URL |
| `NEXTAUTH_SECRET` | random 32 hex |
| `NEXTAUTH_URL` | `https://nama-project.vercel.app` |
| `GOOGLE_CLIENT_ID` | dari Google Console |
| `GOOGLE_CLIENT_SECRET` | dari Google Console |
| `RESEND_API_KEY` | dari resend.com |
| `RESEND_FROM_EMAIL` | verified email/domain |
| `ADMIN_EMAIL` | email admin |
| `ADMIN_PASSWORD` | password admin |
| `NEXT_PUBLIC_APP_URL` | `https://nama-project.vercel.app` |

### 4. Deploy
Klik **Deploy** → tunggu build selesai.

### 5. Seed database production (sekali saja)
```bash
# Di terminal lokal, dengan .env.local sudah diisi URL production Supabase:
npm run db:push
npm run db:seed
```

### 6. Update Google OAuth redirect URI
Google Console → Credentials → OAuth Client → Authorized redirect URIs:
```
https://nama-project.vercel.app/api/auth/callback/google
```

---

## Generate NEXTAUTH_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Catatan Penting

- **Upload gambar** → tersimpan di Supabase Storage bucket `djaloe-assets`, **persisten selamanya** — tidak hilang saat redeploy
- **Database** → Supabase PostgreSQL, **tidak perlu server terpisah**
- **Gambar produk lama** (`public/uploads/`) → tetap bisa diakses selama masih di-commit ke repo
- **Admin CMS** → `/admin` — tab: Products, Nilai Perusahaan, Gallery, Settings, Reviews
- **"What They Say"** → menampilkan review user yang di-approve admin (bukan input manual)
