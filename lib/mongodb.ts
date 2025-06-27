import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached!.conn) {
    console.log('Using existing MongoDB connection');
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Creating new MongoDB connection to:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    cached!.promise = mongoose.connect(MONGODB_URI, opts);
  }
  
  try {
    cached!.conn = await cached!.promise;
    console.log('MongoDB connected successfully');
  } catch (e) {
    cached!.promise = null;
    console.error('MongoDB connection failed:', e);
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;
