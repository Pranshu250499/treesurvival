import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { initialCategories, initialProducts } from './seedProducts.js';
import { seedAdmin } from './seedAdmin.js';

export const seedInitialData = async () => {
  try {
    // 1. Seed Admin and Demo User
    await seedAdmin();

    // 2. Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 Seeding categories...');
      await Category.insertMany(initialCategories);
      console.log(`✅ Seeded ${initialCategories.length} categories.`);
    }

    // 3. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 Seeding products...');
      const savedProducts = await Product.insertMany(initialProducts);
      console.log(`✅ Seeded ${savedProducts.length} products.`);

      // Update category counts
      for (const cat of initialCategories) {
        const count = await Product.countDocuments({ category: cat.name });
        await Category.updateOne({ slug: cat.slug }, { productCount: count });
      }

      // 4. Seed some initial reviews for realism
      const demoUser = await User.findOne({ email: 'user@novamart.com' });
      if (demoUser && savedProducts.length > 0) {
        const sampleReviews = [
          {
            user: demoUser._id,
            userName: demoUser.name,
            product: savedProducts[0]._id, // Sony Headphones
            rating: 5,
            title: 'Worth every single rupee!',
            comment: 'Active noise cancellation is whisper quiet. The soundstage is wide, bass is punchy without being overwhelming, and battery life easily lasted me a 14-hour flight.',
          },
          {
            user: demoUser._id,
            userName: 'Priya Patel',
            product: savedProducts[0]._id,
            rating: 5,
            title: 'Best ANC headphones on the market',
            comment: 'Comfortable to wear all day during Zoom meetings. Mic quality is crystal clear.',
          },
          {
            user: demoUser._id,
            userName: 'Rahul Nair',
            product: savedProducts[1]._id, // Smartwatch
            rating: 5,
            title: 'Impressed by the titanium finish',
            comment: 'Screen is astonishingly sharp under direct sunlight. Battery lasts 3 solid days.',
          },
          {
            user: demoUser._id,
            userName: 'Neha Gupta',
            product: savedProducts[6]._id, // Oversized Hoodie
            rating: 5,
            title: 'Super soft and heavy fabric',
            comment: 'The 480 GSM terry feels super luxe. Color is exactly as photographed.',
          },
        ];

        for (const rev of sampleReviews) {
          try {
            await Review.create(rev);
          } catch (e) {
            // ignore duplicates
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  }
};
