/**
 * UniStay Database Seed Script
 * Usage: node src/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');
const { MealPlan } = require('./models/Meal');

const seed = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing demo data
    await User.deleteMany({ email: { $in: ['student@demo.com', 'landlord@demo.com', 'meal@demo.com', 'facility@demo.com'] } });
    await Property.deleteMany({ title: { $regex: /Maplewood|Lakeside|City Center/i } });
    console.log('🗑️  Cleared existing demo data');

    // Users
    const users = await User.create([
      { firstName: 'Detunu',  lastName: 'Perera',   email: 'student@demo.com',  password: 'demo1234', role: 'student',       university: 'University of Colombo', studentId: 'UOC/2021/CS/089' },
      { firstName: 'Rohan',   lastName: 'Silva',    email: 'landlord@demo.com', password: 'demo1234', role: 'landlord',      businessName: 'Maplewood Residences' },
      { firstName: 'Priya',   lastName: 'Fernando', email: 'meal@demo.com',     password: 'demo1234', role: 'meal_provider', businessName: 'Campus Bites' },
      { firstName: 'Anil',    lastName: 'Bandara',  email: 'facility@demo.com', password: 'demo1234', role: 'facility',      businessName: 'CleanPro Services' },
    ]);
    console.log(`👥 Created ${users.length} demo users`);

    const landlord = users.find(u => u.role === 'landlord');
    const mealProvider = users.find(u => u.role === 'meal_provider');

    // Properties
    const properties = await Property.create([
      {
        landlord: landlord._id,
        title: 'Maplewood Residence',
        description: 'Modern furnished room near university campus with all amenities included.',
        address: '123 College Ave, CityVille',
        price: 45000,
        type: 'room',
        gender: 'any',
        maxOccupants: 4,
        amenities: ['WiFi', 'AC', 'Hot Water', 'Laundry'],
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'],
        isAvailable: true,
        distanceToUniversity: '800m',
      },
      {
        landlord: landlord._id,
        title: 'Lakeside Studio',
        description: 'Cozy studio apartment with lake view, perfect for single occupancy.',
        address: '45 Lake Rd, West End',
        price: 30000,
        type: 'studio',
        gender: 'female',
        maxOccupants: 2,
        amenities: ['WiFi', 'Hot Water', 'Kitchen'],
        images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600'],
        isAvailable: false,
        distanceToUniversity: '1.2km',
      },
      {
        landlord: landlord._id,
        title: 'City Center #05',
        description: 'Premium room in the heart of the city, walking distance to campus.',
        address: '9 Central Blvd, Downtown',
        price: 55000,
        type: 'room',
        gender: 'male',
        maxOccupants: 3,
        amenities: ['WiFi', 'AC', 'Hot Water', 'Security', 'Parking'],
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600'],
        isAvailable: true,
        distanceToUniversity: '300m',
      },
    ]);
    console.log(`🏠 Created ${properties.length} properties`);

    // Meal Plans
    const mealPlans = await MealPlan.create([
      { provider: mealProvider._id, name: 'Chicken Fried Rice', category: 'Lunch',     price: 380,  description: 'Classic fried rice with chicken and vegetables', isActive: true },
      { provider: mealProvider._id, name: 'Grilled Chicken Salad', category: 'Lunch', price: 450,  description: 'Fresh salad with grilled chicken breast', isActive: true },
      { provider: mealProvider._id, name: 'Egg Hopper',          category: 'Breakfast', price: 120, description: 'Traditional Sri Lankan egg hopper', isActive: true },
      { provider: mealProvider._id, name: 'Creamy Pasta',        category: 'Lunch',    price: 550,  description: 'Creamy white sauce pasta', isActive: true },
      { provider: mealProvider._id, name: 'Chicken Kottu',       category: 'Dinner',   price: 480,  description: 'Kottu roti with chicken', isActive: true },
    ]);
    console.log(`🍽️  Created ${mealPlans.length} meal plans`);

    console.log('\n✅ Seed complete! Demo credentials:');
    console.log('   student@demo.com  / demo1234');
    console.log('   landlord@demo.com / demo1234');
    console.log('   meal@demo.com     / demo1234');
    console.log('   facility@demo.com / demo1234\n');

  } catch (err) {
    if (err.message && err.message.includes('querySrv')) {
      console.error('\n❌ DNS Error: Cannot resolve MongoDB Atlas hostname.');
      console.error('   This is a network issue, NOT a code error.');
      console.error('   Try these fixes:');
      console.error('   1. Check your internet connection');
      console.error('   2. Try a different network (e.g. mobile hotspot)');
      console.error('   3. Or seed via the app: start the server then visit http://localhost:5000/api/seed\n');
    } else {
      console.error('❌ Seed error:', err.message);
    }
  } finally {
    await mongoose.disconnect();
  }
};

seed();
