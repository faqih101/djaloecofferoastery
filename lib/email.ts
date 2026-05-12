import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
const APP = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

const shell = (body: string) => `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>body{font-family:Georgia,serif;background:#f5efe6;margin:0;padding:40px 20px}.w{max-width:520px;margin:0 auto;background:#fff;border:1px solid #ddd5c8;border-radius:4px;overflow:hidden}.h{background:#2c1810;padding:32px 40px;text-align:center}.h h1{color:#d4a96a;letter-spacing:.3em;font-size:20px;margin:0}.h p{color:rgba(212,169,106,.6);font-size:11px;letter-spacing:.2em;text-transform:uppercase;margin:6px 0 0}.b{padding:40px;color:#2c1810}.b p{line-height:1.7;color:#5c3d2e;margin:0 0 16px}.btn{display:inline-block;background:#d4a96a;color:#2c1810!important;text-decoration:none;padding:14px 36px;border-radius:2px;font-weight:600;font-size:14px;margin:20px 0}.note{font-size:12px;color:#8b7355;text-align:center;margin-top:8px}.f{background:#faf7f2;padding:20px 40px;text-align:center;border-top:1px solid #ede5d8}.f p{font-size:11px;color:#8b7355;margin:0}</style>
</head><body><div class="w">${body}<div class="f"><p>© ${new Date().getFullYear()} Djaloe Coffee Roastery · Bintaro, Indonesia</p></div></div></body></html>`;

export async function sendResetEmail(email: string, name: string, token: string) {
  const url = `${APP}/auth/reset-password?token=${encodeURIComponent(token)}`;
  return resend.emails.send({
    from: `Djaloe Coffee <${FROM}>`, to: email, subject: 'Reset Password Akun Djaloe Coffee',
    html: shell(`<div class="h"><h1>DJALOE COFFEE</h1><p>Specialty Roastery · Bintaro</p></div>
    <div class="b"><p>Halo, <strong>${name || 'Pelanggan'}</strong>.</p>
    <p>Klik tombol di bawah untuk membuat password baru kamu:</p>
    <div style="text-align:center"><a href="${url}" class="btn">Reset Password →</a></div>
    <p class="note">Link berlaku <strong>1 jam</strong>. Jika tidak merasa meminta reset, abaikan email ini.</p></div>`),
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  return resend.emails.send({
    from: `Djaloe Coffee <${FROM}>`, to: email, subject: 'Selamat Datang di Djaloe Coffee! ☕',
    html: shell(`<div class="h"><h1>DJALOE COFFEE</h1><p>Specialty Roastery · Bintaro</p></div>
    <div class="b"><p>Halo, <strong>${name}</strong>! 👋</p>
    <p>Selamat datang di komunitas Djaloe Coffee Roastery. Akunmu sudah aktif.</p>
    <p>Kamu bisa memberikan ulasan untuk produk kopi kami. Terima kasih sudah bergabung!</p></div>`),
  });
}
