import mongoose from 'mongoose';
import app from '../src/app';
import config from '../src/config/config';
import logger from '../src/config/logger';

// Add a connection cache to avoid multiple connections in serverless environment
let cachedDb: typeof mongoose | null = null;

export default async (req: any, res: any) => {
  if (!cachedDb) {
    logger.info('Connecting to MongoDB...');
    cachedDb = await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');
  }
  
  return app(req, res);
};
