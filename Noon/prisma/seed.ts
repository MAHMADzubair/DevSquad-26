import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.wishlistItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // --- CATEGORIES ---
  const electronics = await prisma.category.create({
    data: { name: "Electronics", slug: "electronics", icon: "📱", color: "#1565c0" },
  });
  const fashion = await prisma.category.create({
    data: { name: "Fashion", slug: "fashion", icon: "👗", color: "#880e4f" },
  });
  const beauty = await prisma.category.create({
    data: { name: "Beauty & Fragrance", slug: "beauty", icon: "💄", color: "#ad1457" },
  });
  const home = await prisma.category.create({
    data: { name: "Home & Kitchen", slug: "home-kitchen", icon: "🏠", color: "#2e7d32" },
  });
  const grocery = await prisma.category.create({
    data: { name: "Grocery", slug: "grocery", icon: "🛒", color: "#f57c00" },
  });
  const baby = await prisma.category.create({
    data: { name: "Baby", slug: "baby", icon: "👶", color: "#0288d1" },
  });
  const sports = await prisma.category.create({
    data: { name: "Sports", slug: "sports", icon: "⚽", color: "#388e3c" },
  });
  const health = await prisma.category.create({
    data: { name: "Health", slug: "health", icon: "💊", color: "#d32f2f" },
  });

  // --- USERS ---
  const adminPassword = await bcrypt.hash("1234", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "ahmad@gmail.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "user@noon.com",
      password: userPassword,
      role: "USER",
      addresses: {
        create: {
          label: "Home",
          fullName: "John Doe",
          phone: "+971501234567",
          street: "123 Sheikh Zayed Road, Apt 4B",
          city: "Dubai",
          country: "UAE",
          isDefault: true,
        },
      },
    },
  });

  console.log("✅ Users created");

  // --- PRODUCTS ---
  const products = [
    // Electronics
    {
      name: "Apple iPhone 15 Pro Max 256GB Natural Titanium",
      slug: "apple-iphone-15-pro-max-256gb",
      description: "The most powerful iPhone ever with A17 Pro chip, titanium design, and pro camera system with 5x optical zoom.",
      price: 4999,
      originalPrice: 5499,
      images: JSON.stringify(["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"]),
      categoryId: electronics.id,
      stock: 45,
      rating: 4.8,
      reviewCount: 2341,
      brand: "Apple",
      badge: "Best Seller",
      isNoonExpress: true,
    },
    {
      name: "Samsung Galaxy S24 Ultra 512GB Titanium Black",
      slug: "samsung-galaxy-s24-ultra-512gb",
      description: "200MP camera, S Pen included, 200MP pro-grade camera with AI features. The ultimate Galaxy experience.",
      price: 4499,
      originalPrice: 4899,
      images: JSON.stringify(["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400"]),
      categoryId: electronics.id,
      stock: 30,
      rating: 4.7,
      reviewCount: 1892,
      brand: "Samsung",
      badge: "Hot Deal",
      isNoonExpress: true,
    },
    {
      name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      slug: "sony-wh-1000xm5-headphones",
      description: "Industry-leading noise cancellation with 8 mics. Up to 30-hour battery life. Crystal clear hands-free calling.",
      price: 1299,
      originalPrice: 1799,
      images: JSON.stringify(["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"]),
      categoryId: electronics.id,
      stock: 60,
      rating: 4.9,
      reviewCount: 3201,
      brand: "Sony",
      badge: "Best Seller",
      isNoonExpress: true,
    },
    {
      name: "Apple MacBook Air M3 13-inch 8GB/256GB",
      slug: "apple-macbook-air-m3-13inch",
      description: "Supercharged by M3 chip. Up to 18 hours battery. Thin and light with a fanless design.",
      price: 4299,
      originalPrice: 4599,
      images: JSON.stringify(["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"]),
      categoryId: electronics.id,
      stock: 25,
      rating: 4.8,
      reviewCount: 987,
      brand: "Apple",
      badge: "New",
      isNoonExpress: true,
    },
    {
      name: "Samsung 55\" QLED 4K Smart TV QA55Q70",
      slug: "samsung-55-qled-4k-smart-tv",
      description: "QLED technology delivers vivid colors. Quantum processor 4K. Object tracking sound.",
      price: 2799,
      originalPrice: 3499,
      images: JSON.stringify(["https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400"]),
      categoryId: electronics.id,
      stock: 15,
      rating: 4.6,
      reviewCount: 456,
      brand: "Samsung",
      badge: "Hot Deal",
      isNoonExpress: false,
    },
    {
      name: "iPad Air 11-inch M2 Wi-Fi 256GB Blue",
      slug: "ipad-air-11-inch-m2-256gb",
      description: "Powerful M2 chip. Immersive 11-inch Liquid Retina display. Ultra-fast Wi-Fi 6E.",
      price: 2699,
      originalPrice: 2899,
      images: JSON.stringify(["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400"]),
      categoryId: electronics.id,
      stock: 35,
      rating: 4.7,
      reviewCount: 723,
      brand: "Apple",
      badge: "New",
      isNoonExpress: true,
    },
    // Fashion
    {
      name: "Nike Air Max 270 Men's Shoe - Black/White",
      slug: "nike-air-max-270-mens-black-white",
      description: "Nike's first lifestyle Air Max shoe with the brand's biggest heel Air unit yet for an ultra-cushioned experience.",
      price: 549,
      originalPrice: 699,
      images: JSON.stringify(["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"]),
      categoryId: fashion.id,
      stock: 80,
      rating: 4.5,
      reviewCount: 1204,
      brand: "Nike",
      badge: "Best Seller",
      isNoonExpress: true,
    },
    {
      name: "Levi's 511 Slim Fit Jeans - Dark Blue",
      slug: "levis-511-slim-fit-jeans-dark-blue",
      description: "Sits below the waist. The slim fit through the seat, hip, and thigh with a slim leg opening.",
      price: 299,
      originalPrice: 399,
      images: JSON.stringify(["https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400"]),
      categoryId: fashion.id,
      stock: 120,
      rating: 4.4,
      reviewCount: 678,
      brand: "Levi's",
      isNoonExpress: true,
    },
    {
      name: "Adidas Ultraboost 23 Running Shoes - Core Black",
      slug: "adidas-ultraboost-23-core-black",
      description: "Designed for runners who want maximum energy return with every stride. BOOST midsole technology.",
      price: 699,
      originalPrice: 849,
      images: JSON.stringify(["https://images.unsplash.com/photo-1556048219-bb6978360b84?w=400"]),
      categoryId: fashion.id,
      stock: 65,
      rating: 4.6,
      reviewCount: 892,
      brand: "Adidas",
      badge: "Hot Deal",
      isNoonExpress: true,
    },
    {
      name: "Women's Floral Midi Dress - Multicolor",
      slug: "womens-floral-midi-dress-multicolor",
      description: "Elegant floral print midi dress perfect for any occasion. Made with breathable fabric.",
      price: 149,
      originalPrice: 249,
      images: JSON.stringify(["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"]),
      categoryId: fashion.id,
      stock: 150,
      rating: 4.3,
      reviewCount: 234,
      brand: "H&M",
      isNoonExpress: false,
    },
    // Beauty
    {
      name: "MAC Studio Fix Fluid Foundation SPF15 - NC25",
      slug: "mac-studio-fix-fluid-foundation-nc25",
      description: "Full coverage, matte foundation with SPF 15. 24-hour wear formula. Oil-controlling.",
      price: 189,
      originalPrice: 219,
      images: JSON.stringify(["https://images.unsplash.com/photo-1586495777744-4e6232bf2072?w=400"]),
      categoryId: beauty.id,
      stock: 200,
      rating: 4.7,
      reviewCount: 1567,
      brand: "MAC",
      badge: "Best Seller",
      isNoonExpress: true,
    },
    {
      name: "Dior Sauvage Eau de Parfum 100ml",
      slug: "dior-sauvage-eau-de-parfum-100ml",
      description: "A deeply fresh perfume inspired by wide-open spaces. A new masculinity that is both raw and noble.",
      price: 449,
      originalPrice: 549,
      images: JSON.stringify(["https://images.unsplash.com/photo-1541643600914-78b084683702?w=400"]),
      categoryId: beauty.id,
      stock: 75,
      rating: 4.9,
      reviewCount: 2103,
      brand: "Dior",
      badge: "Best Seller",
      isNoonExpress: true,
    },
    {
      name: "La Roche-Posay Anthelios SPF50+ Sunscreen 50ml",
      slug: "la-roche-posay-anthelios-spf50-sunscreen",
      description: "Ultra-light invisible SPF50 sun protection. Suitable for sensitive skin. Dermatologist tested.",
      price: 89,
      originalPrice: 119,
      images: JSON.stringify(["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400"]),
      categoryId: beauty.id,
      stock: 300,
      rating: 4.6,
      reviewCount: 889,
      brand: "La Roche-Posay",
      isNoonExpress: true,
    },
    // Home & Kitchen
    {
      name: "Nespresso Vertuo Next Coffee Machine - Chrome",
      slug: "nespresso-vertuo-next-coffee-machine",
      description: "One-touch coffee machine. 5 cup sizes. Automatic capsule recognition. Wi-Fi connected.",
      price: 699,
      originalPrice: 899,
      images: JSON.stringify(["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"]),
      categoryId: home.id,
      stock: 40,
      rating: 4.7,
      reviewCount: 567,
      brand: "Nespresso",
      badge: "Hot Deal",
      isNoonExpress: true,
    },
    {
      name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 5.7L",
      slug: "instant-pot-duo-7in1-electric-pressure-cooker",
      description: "7 appliances in one. Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker & warmer.",
      price: 399,
      originalPrice: 549,
      images: JSON.stringify(["https://images.unsplash.com/photo-1585515320310-259814833e62?w=400"]),
      categoryId: home.id,
      stock: 55,
      rating: 4.8,
      reviewCount: 1234,
      brand: "Instant Pot",
      badge: "Best Seller",
      isNoonExpress: false,
    },
    {
      name: "IKEA FADO Table Lamp - White",
      slug: "ikea-fado-table-lamp-white",
      description: "Gives a soft, cosy glow to create a pleasant atmosphere in every room.",
      price: 89,
      originalPrice: 119,
      images: JSON.stringify(["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400"]),
      categoryId: home.id,
      stock: 200,
      rating: 4.3,
      reviewCount: 345,
      brand: "IKEA",
      isNoonExpress: false,
    },
    // Sports
    {
      name: "Garmin Forerunner 265 GPS Running Smartwatch",
      slug: "garmin-forerunner-265-gps-smartwatch",
      description: "AMOLED display. Advanced training features. Training readiness score. Body battery energy monitor.",
      price: 1899,
      originalPrice: 2199,
      images: JSON.stringify(["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"]),
      categoryId: sports.id,
      stock: 30,
      rating: 4.7,
      reviewCount: 423,
      brand: "Garmin",
      badge: "New",
      isNoonExpress: true,
    },
    {
      name: "Wilson Pro Staff RF97 Tennis Racket - Black",
      slug: "wilson-pro-staff-rf97-tennis-racket",
      description: "Roger Federer's signature racket. Braided graphite and Basalt fibers. Classic feel.",
      price: 1099,
      originalPrice: 1349,
      images: JSON.stringify(["https://images.unsplash.com/photo-1617083934551-ac1bb9c3b8d4?w=400"]),
      categoryId: sports.id,
      stock: 20,
      rating: 4.5,
      reviewCount: 187,
      brand: "Wilson",
      isNoonExpress: false,
    },
    // Health
    {
      name: "Optimum Nutrition Gold Standard 100% Whey Protein 2.27kg",
      slug: "optimum-nutrition-gold-standard-whey-protein-2.27kg",
      description: "24g protein per serving. 5.5g BCAAs. Banned substance tested. Double Rich Chocolate flavor.",
      price: 349,
      originalPrice: 429,
      images: JSON.stringify(["https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400"]),
      categoryId: health.id,
      stock: 150,
      rating: 4.8,
      reviewCount: 3456,
      brand: "Optimum Nutrition",
      badge: "Best Seller",
      isNoonExpress: true,
    },
    {
      name: "Omron HEM-7156 Blood Pressure Monitor",
      slug: "omron-hem-7156-blood-pressure-monitor",
      description: "Clinically validated upper arm blood pressure monitor. Stores up to 60 readings. Easy cuff wrapping guide.",
      price: 199,
      originalPrice: 279,
      images: JSON.stringify(["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400"]),
      categoryId: health.id,
      stock: 80,
      rating: 4.6,
      reviewCount: 712,
      brand: "Omron",
      isNoonExpress: true,
    },
    // Baby
    {
      name: "Chicco Next2Me Magic Baby Crib - Beige",
      slug: "chicco-next2me-magic-baby-crib-beige",
      description: "Co-sleeper crib with 5 height positions. Zips open on one side for easy nighttime access.",
      price: 1299,
      originalPrice: 1599,
      images: JSON.stringify(["https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400"]),
      categoryId: baby.id,
      stock: 25,
      rating: 4.7,
      reviewCount: 234,
      brand: "Chicco",
      badge: "Best Seller",
      isNoonExpress: false,
    },
    {
      name: "Pampers Premium Care Newborn Diapers Size 2 - 80 Count",
      slug: "pampers-premium-care-newborn-diapers-size2",
      description: "Our softest diaper ever. Cottony soft outer cover. Wetness indicator. 12hr triple protection.",
      price: 89,
      originalPrice: 109,
      images: JSON.stringify(["https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400"]),
      categoryId: baby.id,
      stock: 500,
      rating: 4.9,
      reviewCount: 5678,
      brand: "Pampers",
      badge: "Best Seller",
      isNoonExpress: true,
    },
    // Grocery
    {
      name: "Nescafé Gold Blend Instant Coffee 200g",
      slug: "nescafe-gold-blend-instant-coffee-200g",
      description: "Rich and smooth premium instant coffee. A perfect balance of carefully selected Arabica and Robusta beans.",
      price: 45,
      originalPrice: 59,
      images: JSON.stringify(["https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400"]),
      categoryId: grocery.id,
      stock: 400,
      rating: 4.5,
      reviewCount: 892,
      brand: "Nescafé",
      isNoonExpress: true,
    },
    {
      name: "Kellogg's Corn Flakes Breakfast Cereal 500g",
      slug: "kelloggs-corn-flakes-breakfast-cereal-500g",
      description: "Light and crispy golden corn flakes. A classic wholesome breakfast cereal.",
      price: 19,
      originalPrice: 24,
      images: JSON.stringify(["https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=400"]),
      categoryId: grocery.id,
      stock: 600,
      rating: 4.4,
      reviewCount: 1234,
      brand: "Kellogg's",
      isNoonExpress: true,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("✅ Products created");
  console.log("🎉 Database seeded successfully!");
  console.log("\n📋 Test Accounts:");
  console.log("  Admin: ahmad@gmail.com / 1234");
  console.log("  User:  user@noon.com / user123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
