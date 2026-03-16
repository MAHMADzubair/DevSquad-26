import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Category from "../models/Category.js";

dotenv.config();

const products = [
  {
    name: "Ceylon Ginger Cinnamon chai tea",
    description: "A lovely warming Chai tea with ginger cinnamon flavours.",
    category: "Chai",
    flavor: "Spicy",
    price: 3.9,
    rating: 4.5,
    reviews: 48,
    origin: "Iran",
    organic: true,
    vegan: true,
    caffeine: "Medium",
    qualities: ["Digestion", "Energy"],
    allergens: ["Nuts-free"],
    ingredients:
      "Black Ceylon tea, Green tea, Ginger root, Cloves, Black pepper, Cinnamon sticks, Cardamom, Cinnamon pieces.",
    servingSize: "2 tsp per cup, 6 tsp per pot",
    waterTemp: "100°C",
    steepingTime: "3 - 5 minutes",
    images: ["/Image Holder (1).png"],
    stock: 100,
    variants: [
      { size: "50g", label: "50", type: "bag", price: 3.9, stock: 30 },
      { size: "100g", label: "100", type: "bag", price: 6.5, stock: 25 },
      { size: "170g", label: "170", type: "tin", price: 9.9, stock: 20 },
      { size: "250g", label: "250", type: "bag", price: 12.5, stock: 15 },
      { size: "1kg", label: "1 kg", type: "bag", price: 39.9, stock: 10 },
      {
        size: "sampler",
        label: "Sample",
        type: "sampler",
        price: 1.5,
        stock: 50,
      },
    ],
  },
  {
    name: "Earl Grey Classic Black Tea",
    description: "A timeless classic black tea infused with bergamot oil.",
    category: "Black Tea",
    flavor: "Citrus",
    price: 4.5,
    rating: 4.7,
    reviews: 112,
    origin: "India",
    organic: false,
    vegan: true,
    caffeine: "High Caffeine",
    qualities: ["Energy"],
    allergens: ["Lactose-free", "Nuts-free"],
    ingredients: "Black tea, Bergamot oil.",
    images: ["/Image Holder (2).png"],
    stock: 80,
    variants: [
      { size: "50g", label: "50", type: "bag", price: 4.5, stock: 30 },
      { size: "100g", label: "100", type: "bag", price: 7.5, stock: 25 },
      { size: "250g", label: "250", type: "bag", price: 14.0, stock: 15 },
    ],
  },
  {
    name: "Premium Japanese Sencha",
    description:
      "A fresh and grassy green tea from the Shizuoka region of Japan.",
    category: "Green Tea",
    flavor: "Grassy",
    price: 5.9,
    rating: 4.8,
    reviews: 89,
    origin: "Japan",
    organic: true,
    vegan: true,
    caffeine: "Medium",
    qualities: ["Detox", "Relax"],
    allergens: ["Nuts-free", "Gluten-free"],
    ingredients: "Japanese Sencha green tea.",
    images: ["/Image Holder (3).png"],
    stock: 60,
    variants: [
      { size: "50g", label: "50", type: "bag", price: 5.9, stock: 20 },
      { size: "100g", label: "100", type: "bag", price: 10.5, stock: 20 },
      { size: "250g", label: "250", type: "bag", price: 22.0, stock: 20 },
    ],
  },
  {
    name: "White Peony Bai Mu Dan",
    description: "A delicate white tea with a subtle floral aroma.",
    category: "White Tea",
    flavor: "Floral",
    price: 7.5,
    rating: 4.6,
    reviews: 55,
    origin: "India",
    organic: true,
    vegan: true,
    caffeine: "Low Caffeine",
    qualities: ["Relax"],
    allergens: ["Nuts-free"],
    ingredients: "White peony tea leaves, dried flowers.",
    images: ["/Image Holder (4).png"],
    stock: 40,
    variants: [
      { size: "50g", label: "50", type: "bag", price: 7.5, stock: 20 },
      { size: "100g", label: "100", type: "bag", price: 13.0, stock: 20 },
    ],
  },
  {
    name: "Ceremonial Grade Matcha",
    description: "Pure ceremonial grade matcha powder from Uji, Japan.",
    category: "Matcha",
    flavor: "Grassy",
    price: 12.9,
    rating: 4.9,
    reviews: 201,
    origin: "Japan",
    organic: true,
    vegan: true,
    caffeine: "High Caffeine",
    qualities: ["Energy", "Detox"],
    allergens: ["Nuts-free", "Gluten-free", "Lactose-free"],
    ingredients: "Stone-ground green tea leaves.",
    images: ["/Image Holder (5).png"],
    stock: 50,
    variants: [
      { size: "30g", label: "30", type: "tin", price: 12.9, stock: 25 },
      { size: "60g", label: "60", type: "tin", price: 23.0, stock: 25 },
    ],
  },
  {
    name: "Chamomile Lavender Herbal",
    description: "A soothing caffeine-free herbal blend for restful evenings.",
    category: "Herbal Tea",
    flavor: "Floral",
    price: 3.5,
    rating: 4.4,
    reviews: 146,
    origin: "South Africa",
    organic: true,
    vegan: true,
    caffeine: "No Caffeine",
    qualities: ["Relax", "Digestion"],
    allergens: ["Nuts-free", "Gluten-free"],
    ingredients: "Chamomile flowers, Lavender buds, Lemon balm.",
    images: ["/Image Holder (6).png"],
    stock: 120,
    variants: [
      { size: "50g", label: "50", type: "bag", price: 3.5, stock: 50 },
      { size: "100g", label: "100", type: "bag", price: 6.0, stock: 40 },
      { size: "250g", label: "250", type: "bag", price: 13.0, stock: 30 },
    ],
  },
  {
    name: "Masala Chai Spice Blend",
    description: "A warming spiced chai blend perfect for lattes.",
    category: "Chai",
    flavor: "Spicy",
    price: 4.2,
    rating: 4.6,
    reviews: 93,
    origin: "India",
    organic: false,
    vegan: true,
    caffeine: "Medium",
    qualities: ["Energy", "Digestion"],
    allergens: ["Nuts-free"],
    ingredients: "Black tea, Cardamom, Ginger, Cloves, Cinnamon, Black pepper.",
    images: ["/Image Holder (7).png"],
    stock: 80,
    variants: [
      { size: "50g", label: "50", type: "bag", price: 4.2, stock: 30 },
      { size: "100g", label: "100", type: "bag", price: 7.4, stock: 30 },
      { size: "250g", label: "250", type: "bag", price: 15.0, stock: 20 },
    ],
  },
  {
    name: "Tie Guan Yin Oolong",
    description: "A premium floral oolong from Fujian Province, China.",
    category: "Oolong",
    flavor: "Floral",
    price: 8.9,
    rating: 4.7,
    reviews: 67,
    origin: "Japan",
    organic: true,
    vegan: true,
    caffeine: "Medium",
    qualities: ["Detox", "Relax"],
    allergens: ["Nuts-free"],
    ingredients: "Tie Guan Yin oolong tea leaves.",
    images: ["/Image Holder (8).png"],
    stock: 45,
    variants: [
      { size: "50g", label: "50", type: "bag", price: 8.9, stock: 20 },
      { size: "100g", label: "100", type: "bag", price: 15.5, stock: 25 },
    ],
  },
  {
    name: "Honeybush Rooibos Vanilla",
    description: "A naturally sweet South African rooibos with vanilla.",
    category: "Rooibos",
    flavor: "Sweet",
    price: 3.8,
    rating: 4.3,
    reviews: 78,
    origin: "South Africa",
    organic: true,
    vegan: true,
    caffeine: "No Caffeine",
    qualities: ["Relax"],
    allergens: ["Nuts-free", "Gluten-free", "Lactose-free"],
    ingredients: "Rooibos, Honeybush, Vanilla pieces.",
    images: ["/Image Holder (1).png"],
    stock: 90,
    variants: [
      { size: "50g", label: "50", type: "bag", price: 3.8, stock: 40 },
      { size: "100g", label: "100", type: "bag", price: 6.5, stock: 30 },
      { size: "250g", label: "250", type: "bag", price: 14.0, stock: 20 },
    ],
  },
];

const superadmin = {
  name: "Super Admin",
  email: "superahmad@gmail.com",
  password: "1234",
  role: "superadmin",
};

const admin_user = {
  name: "Store Admin",
  email: "ahmad@gmail.com",
  password: "1234",
  role: "admin",
};

const categories = [
  {
    name: "Black Tea",
    image: "/Rectangle 2.png",
    showOnHome: true,
    description: "Bolder and stronger flavors",
  },
  {
    name: "Green Tea",
    image: "/Image Holder (2).png",
    showOnHome: true,
    description: "Fresh and grassy notes",
  },
  {
    name: "White Tea",
    image: "/Image Holder (3).png",
    showOnHome: true,
    description: "Delicate and subtle flavors",
  },
  {
    name: "Matcha",
    image: "/Image Holder (4).png",
    showOnHome: true,
    description: "Pure ceremonial grade powder",
  },
  {
    name: "Herbal Tea",
    image: "/Image Holder (5).png",
    showOnHome: true,
    description: "Soothing caffeine-free blends",
  },
  {
    name: "Chai",
    image: "/Image Holder (6).png",
    showOnHome: true,
    description: "Warming spiced tea",
  },
  {
    name: "Oolong",
    image: "/Image Holder (7).png",
    showOnHome: true,
    description: "Complex and aromatic",
  },
  {
    name: "Rooibos",
    image: "/Image Holder (8).png",
    showOnHome: true,
    description: "Sweet and earthy",
  },
  {
    name: "Teaware",
    image: "/Landing Main Image (1).png",
    showOnHome: true,
    description: "Essential brewing tools",
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅  MongoDB connected");

  await Product.deleteMany({});
  await Category.deleteMany({});
  await User.deleteMany({
    $or: [
      { role: { $in: ["admin", "superadmin"] } },
      { email: { $in: [superadmin.email, admin_user.email] } },
    ],
  });

  await Product.insertMany(products);
  await Category.insertMany(categories);
  await User.create([superadmin, admin_user]);

  console.log(`✅  Seeded ${products.length} products`);
  console.log(`✅  Seeded ${categories.length} categories`);
  console.log(
    `✅  Superadmin created: ${superadmin.email} / ${superadmin.password}`,
  );
  console.log(
    `✅  Admin created: ${admin_user.email} / ${admin_user.password}`,
  );
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
