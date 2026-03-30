import mongoose from 'mongoose';
import { Movie, Category, User } from './models';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const movies = [
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseYear: 2014,
    category: "movie",
    posterUrl: "https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlSv7rP.jpg",
    isPublished: true,
    isPremium: true
  },
  {
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseYear: 1994,
    category: "movie",
    posterUrl: "https://image.tmdb.org/t/p/original/q6y0Go1tsYKoB9A36buEMzMmcS2.jpg",
    isPublished: true,
    isPremium: false
  },
  {
    title: "Pulp Fiction",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    releaseYear: 1994,
    category: "movie",
    posterUrl: "https://image.tmdb.org/t/p/original/d5iIl9h9btztUcrzUq0vEtHkRGP.jpg",
    isPublished: true,
    isPremium: true
  },
  {
    title: "The Godfather",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    releaseYear: 1972,
    category: "movie",
    posterUrl: "https://image.tmdb.org/t/p/original/3bhkrjSTXvTuKAjdyv30F0COAWm.jpg",
    isPublished: true,
    isPremium: true
  },
  {
    title: "Fight Club",
    description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much, much more.",
    releaseYear: 1999,
    category: "movie",
    posterUrl: "https://image.tmdb.org/t/p/original/pB8BM7pdv9508OS6u49f2p9vOdy.jpg",
    isPublished: true,
    isPremium: false
  },
  {
    title: "The Matrix",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    releaseYear: 1999,
    category: "movie",
    posterUrl: "https://image.tmdb.org/t/p/original/f89U3Y9L9xxmI91h9vdf9yYnOQb.jpg",
    isPublished: true,
    isPremium: true
  },
  {
    title: "Goodfellas",
    description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.",
    releaseYear: 1990,
    category: "movie",
    posterUrl: "https://image.tmdb.org/t/p/original/aKuFiUvxG0Jp7DPIPpCdzemSzt5.jpg",
    isPublished: true,
    isPremium: true
  },
  {
    title: "Seven",
    description: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
    releaseYear: 1995,
    category: "movie",
    posterUrl: "https://image.tmdb.org/t/p/original/69Sns8WoETAC62R4hRwvy6LqbiM.jpg",
    isPublished: true,
    isPremium: false
  },
  {
    title: "The Silence of the Lambs",
    description: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.",
    releaseYear: 1991,
    category: "movie",
    posterUrl: "https://image.tmdb.org/t/p/original/uS9mY7o97Sdnv79I9AB09vI4G6T.jpg",
    isPublished: true,
    isPremium: true
  },
  {
    title: "Alien",
    description: "After a space merchant vessel receives a unknown transmission as a distress call, one of the crew is attacked by a mysterious life form and its life cycle has only just begun.",
    releaseYear: 1979,
    category: "movie",
    posterUrl: "https://image.tmdb.org/t/p/original/v7STsSfw8Y9ZJp9vCc79NWvNflu.jpg",
    isPublished: true,
    isPremium: true
  },
  {
    title: "Money Heist",
    description: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
    releaseYear: 2017,
    category: "show",
    posterUrl: "https://image.tmdb.org/t/p/original/reEMJA1uzpG6S0pKGwI9S3nS5M7.jpg",
    isPublished: true,
    isPremium: true
  },
  {
    title: "Breaking Bad",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    releaseYear: 2008,
    category: "show",
    posterUrl: "https://image.tmdb.org/t/p/original/ggFHnq96neTRu49paLU9yD6v1sI.jpg",
    isPublished: true,
    isPremium: true
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log('Connected to DB');

    const admin = await User.findOne({ role: 'admin' });
    const categories = await Category.find();

    for (const movieData of movies) {
      // Pick 2 random categories
      const movieCategories = categories
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map(c => c._id);

      if (!admin) {
        console.warn('⚠️ No admin found. Using null/skipping createdBy? No, model requires it. Please seed admin first.');
      }

      await Movie.create({
        ...movieData,
        genres: movieCategories,
        createdBy: admin ? admin._id : new mongoose.Types.ObjectId(), // Fallback to avoid TS error, though ideally admin should exist
        views: Math.floor(Math.random() * 1000000)
      });
      console.log(`Added Movie: ${movieData.title}`);
    }

    console.log('Done seeding!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
