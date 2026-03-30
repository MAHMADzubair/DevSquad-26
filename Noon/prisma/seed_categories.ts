import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Deals", icon: "🏷️", color: "#ffeaea" },
    { name: "Global Store", icon: "🌐", color: "#e8f5ff" },
    { name: "Grocery", icon: "🛒", color: "#f1fce2" },
    { name: "Electronics", icon: "📱", color: "#fff6f1" },
    { name: "Mobiles", icon: "🤳", color: "#fff0f0" },
    { name: "Laptops & Desktops", icon: "💻", color: "#f0f4ff" },
    { name: "Beauty", icon: "💄", color: "#fff0f6" },
    { name: "Gift Cards", icon: "🎁", color: "#fff9db" },
    { name: "Home & Kitchen", icon: "🥘", color: "#fff4e6" },
    { name: "Women's Fashion", icon: "👗", color: "#fef0f0" },
    { name: "Men's Fashion", icon: "👕", color: "#e3fafd" },
    { name: "Home Appliances", icon: "🔌", color: "#f8f9fa" },
  ];

  for (const cat of categories) {
    const slug = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    await prisma.category.upsert({
      where: { slug },
      update: {
        icon: cat.icon,
        color: cat.color
      },
      create: {
        name: cat.name,
        slug,
        icon: cat.icon,
        color: cat.color
      }
    });
  }

  console.log("Seeded categories successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
