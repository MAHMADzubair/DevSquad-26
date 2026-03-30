import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

import { User, Plan, Movie, Category } from './models';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log('Connected to MongoDB for seeding...');

    // 1. Create Plans
    await Plan.deleteMany({});
    const plans = await Plan.insertMany([
      { name: 'Basic', price: 9.99, durationDays: 30, features: ['Standard Quality', '720p Resolution', '1 Device', 'Mobile Support'], isActive: true },
      { name: 'Standard', price: 14.99, durationDays: 30, features: ['HD Quality', '1080p Resolution', '2 Devices', 'TV Support'], isActive: true },
      { name: 'Premium', price: 19.99, durationDays: 30, features: ['Ultra HD Quality', '4K Resolution', '4 Devices', 'HDR & Dolby Atmos'], isActive: true },
    ]);
    console.log('Plans seeded.');

    // 2. Create Admin
    const adminEmail = 'ahmad@gmail.com';
    await User.deleteOne({ email: adminEmail });
    const admin = await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: '1234', // will be hashed by pre-save
      role: 'admin',
      isEmailVerified: true,
    });
    console.log('Admin user created.');

    // 2.5 Create Categories for Movies
    await Category.deleteMany({});
    const sciFi = await Category.create({ name: 'Sci-Fi', slug: 'sci-fi' });
    const horror = await Category.create({ name: 'Horror', slug: 'horror' });
    const mystery = await Category.create({ name: 'Mystery', slug: 'mystery' });
    const action = await Category.create({ name: 'Action', slug: 'action' });
    const crime = await Category.create({ name: 'Crime', slug: 'crime' });
    const drama = await Category.create({ name: 'Drama', slug: 'drama' });
    const adventure = await Category.create({ name: 'Adventure', slug: 'adventure' });

    console.log('Categories seeded.');

    // 3. Create sample movies
    await Movie.deleteMany({});
    await Movie.insertMany([
      {
        title: 'Stranger Things',
        description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
        genres: [sciFi._id, horror._id, mystery._id],
        releaseYear: 2016,
        category: 'show',
        isPublished: true,
        isPremium: true,
        createdBy: admin._id,
        posterUrl: 'https://image.tmdb.org/t/p/original/49WJfev0moxm9zEE6S7B6yQHvM3.jpg',
        videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1642500000/dog.mp4', // fallback
        views: 1250321,
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        genres: [action._id, crime._id, drama._id],
        releaseYear: 2008,
        category: 'movie',
        isPublished: true,
        isPremium: true,
        createdBy: admin._id,
        posterUrl: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDp9QEQBnN6qSuaqcy2.jpg',
        views: 890422,
      },
      {
         title: 'Inception',
         description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
         genres: [action._id, sciFi._id, adventure._id],
         releaseYear: 2010,
         category: 'movie',
         isPublished: true,
         isPremium: false, // Free movie
         createdBy: admin._id,
         posterUrl: 'https://image.tmdb.org/t/p/original/edv5CZvRjS99vO6YCcIqiSRCcZ8.jpg',
         views: 456789,
      }
    ]);
    console.log('Movies seeded.');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
