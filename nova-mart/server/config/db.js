import mongoose from 'express';
import mongoosePackage from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedInitialData } from '../utils/seedDatabase.js';

let mongoMemoryInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log('🔄 Attempting connection to configured MongoDB URI...');
      await mongoosePackage.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ Connected to MongoDB successfully.');
      await seedInitialData();
      return;
    } catch (err) {
      console.warn(`⚠️ Could not connect to configured MONGO_URI (${err.message}). Falling back to in-memory MongoDB...`);
    }
  }

  // Fallback to in-memory MongoDB for seamless out-of-the-box zero-config execution
  try {
    console.log('🚀 Initializing built-in in-memory MongoDB instance for instant execution...');
    mongoMemoryInstance = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryInstance.getUri();
    await mongoosePackage.connect(memoryUri);
    console.log(`✅ In-Memory MongoDB connected at: ${memoryUri}`);
    await seedInitialData();
  } catch (error) {
    console.error('❌ Failed to connect to any MongoDB instance:', error);
    process.exit(1);
  }
};
