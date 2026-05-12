const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...');

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@djaloecoffee.com';
  const adminPass  = process.env.ADMIN_PASSWORD || 'Admin123!';
  const exists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!exists) {
    await prisma.user.create({ data: { email: adminEmail, name: 'Admin Djaloe', passwordHash: await bcrypt.hash(adminPass, 12), role: Role.ADMIN } });
    console.log('✓ Admin:', adminEmail);
  } else { console.log('✓ Admin already exists'); }

  // Settings
  const s = {
    hero_title_line1:'The Art of', hero_title_line2:'Perfect', hero_title_line3:'Coffee.',
    hero_badge_text:'Est. 2019', hero_badge_sub1:'Specialty Roastery', hero_badge_sub2:'Bintaro',
    about_title_line1:'A Love Letter to', about_title_line2:'Indonesian Soil',
    about_paragraph1:'Djaloe Coffee Roastery lahir di Bintaro pada tahun 2019 dari kecintaan kami terhadap kekayaan alam Indonesia.',
    about_paragraph2:'Sebagai specialty roastery, kami tidak hanya menyangrai biji kopi; kami menceritakan perjalanan panjang dari petani lokal hingga ke cangkir Anda.',
    about_quote:'Cintai Produk Lokal bukan sekadar slogan, melainkan komitmen kami untuk memajukan industri kopi Tanah Air.',
    about_image:'',
    contact_desc:'Tertarik berkolaborasi, supply biji kopi untuk kedai Anda, atau bertanya tentang profil roasting kami? Hubungi kami langsung.',
    contact_whatsapp:'+62 878 7263 9755', contact_location:'Bintaro, Tangerang Selatan, Indonesia',
  };
  for (const [key, value] of Object.entries(s)) {
    await prisma.setting.upsert({ where: { key }, update: {}, create: { key, value } });
  }
  console.log('✓ Settings');

  // Company Values
  const valCount = await prisma.companyValue.count();
  if (valCount === 0) {
    await prisma.companyValue.createMany({ data: [
      { icon: '🌱', title: 'Sustainability', body: 'Kami bekerja langsung dengan petani lokal, memastikan praktik pertanian yang berkelanjutan dan harga yang adil.', sortOrder: 0 },
      { icon: '🔬', title: 'Quality First', body: 'Setiap batch kopi melalui proses cupping yang ketat. Kami hanya menyangrai biji dengan skor 80+ menurut standar SCA.', sortOrder: 1 },
      { icon: '🤝', title: 'Community', body: 'Djaloe bukan hanya roastery — ini adalah komunitas pecinta kopi yang saling berbagi pengetahuan dan kecintaan terhadap kopi Indonesia.', sortOrder: 2 },
      { icon: '🗺️', title: 'Traceability', body: 'Setiap produk kami memiliki informasi lengkap tentang asal daerah, petani, ketinggian kebun, dan metode proses.', sortOrder: 3 },
    ]});
    console.log('✓ Company values');
  }

  // Products
  const products = [
    { productSlug:'gayo',       name:'Sumatra Gayo',       origin:'Aceh Tengah, Sumatra',   description:'Kopi single origin dengan notes rempah, dark chocolate, dan low acidity. Body yang tebal khas Sumatra.',        roastLevel:'Medium-Dark', image:'product_1775668703_9384.png', sortOrder:0, notes:['Dark Chocolate','Rempah','Earthy'] },
    { productSlug:'flores',     name:'Flores Bajawa',      origin:'Ngada, Flores',          description:'Karakteristik floral, karamel, dan sedikit nutty. Aroma yang sangat wangi dengan acidity medium.',               roastLevel:'Medium',      image:'product_1775669299_5222.jpg', sortOrder:1, notes:['Floral','Karamel','Nutty'] },
    { productSlug:'temanggung', name:'Robusta Temanggung', origin:'Temanggung, Jawa Tengah', description:'Robusta premium dengan notes tembakau dan dark cocoa. Sangat cocok untuk es kopi susu.',                         roastLevel:'Dark',        image:'product_1775669304_5574.jpg', sortOrder:2, notes:['Tembakau','Dark Cocoa','Bold'] },
    { productSlug:'toraja',     name:'Toraja Sapan',       origin:'Toraja Utara, Sulawesi', description:'Profil rasa yang kompleks dengan notes dried fruit, dark berry, dan finish yang panjang. Iconic.',                 roastLevel:'Medium',      image:'product_1775669309_9397.png', sortOrder:3, notes:['Dried Fruit','Dark Berry','Winey'] },
    { productSlug:'java',       name:'Java Preanger',      origin:'Pengalengan, Jawa Barat', description:'Arabika Java klasik dengan body sedang, notes caramel, citrus ringan, dan acidity yang cerah.',                  roastLevel:'Light',       image:'product_1775669316_7361.jpg', sortOrder:4, notes:['Caramel','Citrus','Clean'] },
    { productSlug:'bali',       name:'Bali Kintamani',     origin:'Kintamani, Bali',        description:'Ditanam di lereng Gunung Batur. Citrus yang cerah, body ringan, dan aroma bunga yang khas.',                      roastLevel:'Light',       image:'product_1775669321_7797.png', sortOrder:5, notes:['Citrus','Floral','Bright'] },
  ];
  for (const { notes, ...p } of products) {
    const prod = await prisma.product.upsert({ where: { productSlug: p.productSlug }, update: {}, create: p });
    const c = await prisma.productNote.count({ where: { productId: prod.id } });
    if (c === 0) await prisma.productNote.createMany({ data: notes.map((note: string, i: number) => ({ productId: prod.id, note, sortOrder: i })) });
  }
  console.log('✓ Products');

  console.log('✅ Seed complete!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
