import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

import { Movie } from './models';

const testDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log('Connected');

    const filter = {};
    const query: any = { isPublished: true, ...filter };

    console.log('Query:', query);
    const movies = await Movie.find(query)
      .populate('genres', 'name slug')
      .sort({ createdAt: -1 })
      .skip(0)
      .limit(12);

    console.log('Movies count:', movies.length);
    console.log(movies);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

testDb();
