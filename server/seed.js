/**
 * ARLON Database Seed Script
 * Populates the database with sample artists, products, and an admin user.
 *
 * Usage:
 *   node seed.js
 *
 * Make sure MONGO_URI is set in your .env file first.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Artist = require('./models/Artist');
const Product = require('./models/Product');
const Post = require('./models/Post');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/arlon';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // ── Clear existing data ──────────────────────────────────────────────────────
  await Promise.all([
    User.deleteMany({}),
    Artist.deleteMany({}),
    Product.deleteMany({}),
    Post.deleteMany({}),
  ]);
  console.log('🗑  Cleared existing collections');

  // ── Users ────────────────────────────────────────────────────────────────────
  const adminUser = await User.create({
    username: 'admin',
    email: 'admin@arlon.io',
    password: 'Admin1234!',
    role: 'admin',
    bio: 'Platform administrator',
  });

  const collectorUser = await User.create({
    username: 'neon_collector',
    email: 'collector@arlon.io',
    password: 'Collector1234!',
    role: 'user',
    bio: 'Digital art enthusiast and collector',
    loyaltyPoints: 250,
    badges: ['Collector'],
  });

  console.log('👤 Users created — admin / collector');

  // ── Artists ──────────────────────────────────────────────────────────────────
  const artists = await Artist.insertMany([
    {
      name: 'VXRTZ',
      bio: 'Generative digital artist exploring the intersection of code and canvas.',
      verified: true,
      followers: [],
    },
    {
      name: 'Mira Solano',
      bio: 'Sculptor, painter, digital visionary. Based in Barcelona.',
      verified: true,
      followers: [],
    },
    {
      name: 'Null.Studio',
      bio: 'Collective of anonymous artists releasing encrypted visual drops.',
      verified: false,
      followers: [],
    },
    {
      name: 'ECHO Museum',
      bio: 'A virtual museum bridging physical and digital art worlds.',
      verified: true,
      isMuseum: true,
      followers: [],
    },
  ]);

  console.log(`🎨 ${artists.length} artists created`);

  // ── Products ─────────────────────────────────────────────────────────────────
  const dropDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3); // 3 days from now

  const products = await Product.insertMany([
    {
      title: 'Genesis Fractal #001',
      description: 'The inaugural piece from VXRTZ — a generative fractal rendered at 16K resolution, stored on-chain. Each viewing is unique.',
      category: 'Digital Art',
      type: 'original',
      price: 299,
      totalQuantity: 10,
      remainingQuantity: 7,
      images: ['https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=800'],
      artistId: artists[0]._id,
      dropDate,
      isActive: true,
    },
    {
      title: 'Neon Phantom Tee',
      description: 'Limited run screen-printed tee. 280gsm heavyweight cotton. Collaboration with VXRTZ.',
      category: 'Apparel',
      type: 'echo',
      price: 89,
      totalQuantity: 200,
      remainingQuantity: 143,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
      artistId: artists[0]._id,
      isActive: true,
    },
    {
      title: 'Solano Study III',
      description: 'Mira Solano\'s third in the Study series — a high-resolution scan of her physical oil painting, certified and numbered.',
      category: 'Fine Art',
      type: 'original',
      price: 850,
      totalQuantity: 5,
      remainingQuantity: 2,
      images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'],
      artistId: artists[1]._id,
      isActive: true,
    },
    {
      title: 'Encrypted Signal #7',
      description: 'Null.Studio releases another anonymous piece. The metadata will be revealed 30 days after purchase.',
      category: 'Digital Art',
      type: 'original',
      price: 199,
      totalQuantity: 15,
      remainingQuantity: 15,
      images: ['https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800'],
      artistId: artists[2]._id,
      dropDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
      isActive: true,
    },
    {
      title: 'ARLON Classic Cap',
      description: 'The classic ARLON 6-panel cap. Embroidered logo, adjustable strap. Drop collab edition.',
      category: 'Accessories',
      type: 'echo',
      price: 55,
      totalQuantity: 500,
      remainingQuantity: 312,
      images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800'],
      isActive: true,
    },
    {
      title: 'ECHO Archive Vol. 1',
      description: 'A curated digital zine from the ECHO Museum. 128 pages of exclusive artwork, available to collectors only.',
      category: 'Publication',
      type: 'original',
      price: 45,
      totalQuantity: 100,
      remainingQuantity: 61,
      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800'],
      artistId: artists[3]._id,
      isActive: true,
    },
  ]);

  console.log(`📦 ${products.length} products created`);

  // ── Posts ────────────────────────────────────────────────────────────────────
  await Post.insertMany([
    {
      authorId: artists[0]._id,
      content: 'New drop incoming. Genesis Fractal #002 will be released next week. Each iteration is computationally unique — no two are the same. Stay tuned.',
      images: [],
    },
    {
      authorId: artists[1]._id,
      content: 'Just finished the studio session for Study IV. Photographed under natural light — the texture is something else entirely. Dropping exclusively on ARLON.',
      images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800'],
    },
    {
      authorId: artists[3]._id,
      content: 'ECHO Museum is expanding its digital archive. If you are a collector of Vol. 1, check your certificate — there is a hidden layer unlocked.',
      images: [],
    },
  ]);

  console.log('📝 Posts created');

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────');
  console.log('✅ ARLON database seeded successfully!\n');
  console.log('Login credentials:');
  console.log('  Admin   → admin@arlon.io     / Admin1234!');
  console.log('  User    → collector@arlon.io / Collector1234!');
  console.log('─────────────────────────────────────────\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
