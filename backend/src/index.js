const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not set. Create backend/.env from backend/.env.example');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set. Create backend/.env from backend/.env.example');
  process.exit(1);
}

const authRoutes     = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes  = require('./routes/bookingRoutes');
const mealRoutes     = require('./routes/mealRoutes');
const serviceRoutes  = require('./routes/serviceRoutes');
const messageRoutes  = require('./routes/messageRoutes');
const paymentRoutes  = require('./routes/paymentRoutes');
const userRoutes     = require('./routes/userRoutes');

const app = express();

// Allow all origins in development
app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',       authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings',   bookingRoutes);
app.use('/api/meals',      mealRoutes);
app.use('/api/services',   serviceRoutes);
app.use('/api/messages',   messageRoutes);
app.use('/api/payments',   paymentRoutes);
app.use('/api/users',      userRoutes);


// Seed route - accessible via browser when server is running
// Visit http://localhost:5000/api/seed to create demo accounts
app.get('/api/seed', async (req, res) => {
  try {
    const User = require('./models/User');
    const Property = require('./models/Property');
    const { MealPlan } = require('./models/Meal');

    // Clear existing demo data
    await User.deleteMany({ email: { $in: ['student@demo.com', 'landlord@demo.com', 'meal@demo.com', 'facility@demo.com'] } });
    await Property.deleteMany({ title: { $regex: /Maplewood|Lakeside|City Center/i } });
    await MealPlan.deleteMany({});

    const users = await User.create([
      { firstName: 'Detunu',  lastName: 'Perera',   email: 'student@demo.com',  password: 'demo1234', role: 'student',       university: 'University of Colombo', studentId: 'UOC/2021/CS/089' },
      { firstName: 'Rohan',   lastName: 'Silva',    email: 'landlord@demo.com', password: 'demo1234', role: 'landlord',      businessName: 'Maplewood Residences' },
      { firstName: 'Priya',   lastName: 'Fernando', email: 'meal@demo.com',     password: 'demo1234', role: 'meal_provider', businessName: 'Campus Bites' },
      { firstName: 'Anil',    lastName: 'Bandara',  email: 'facility@demo.com', password: 'demo1234', role: 'facility',      businessName: 'CleanPro Services' },
    ]);

    const landlord = users.find(u => u.role === 'landlord');
    const mealProvider = users.find(u => u.role === 'meal_provider');

    // Property uses 'owner' not 'landlord', 'distanceToCampus' not 'distanceToUniversity'
    // type enum: studio, shared_house, apartment, room  (no 'house')
    // No 'gender' field in model
    await Property.create([
      { owner: landlord._id, title: 'Maplewood Residence', description: 'Modern furnished room near university campus with all amenities included.', address: '123 College Ave, CityVille', price: 45000, type: 'room',   maxOccupants: 4, amenities: ['WiFi','AC','Hot Water','Laundry'],          images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'], isAvailable: true,  distanceToCampus: '800m' },
      { owner: landlord._id, title: 'Lakeside Studio',     description: 'Cozy studio apartment with lake view, perfect for single occupancy.',        address: '45 Lake Rd, West End',      price: 30000, type: 'studio', maxOccupants: 2, amenities: ['WiFi','Hot Water','Kitchen'],              images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600'], isAvailable: false, distanceToCampus: '1.2km' },
      { owner: landlord._id, title: 'City Center #05',     description: 'Premium room in the heart of the city, walking distance to campus.',          address: '9 Central Blvd, Downtown', price: 55000, type: 'room',   maxOccupants: 3, amenities: ['WiFi','AC','Hot Water','Security','Parking'], images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600'], isAvailable: true,  distanceToCampus: '300m' },
    ]);

    // MealPlan category enum: breakfast, lunch, dinner, snack (lowercase)
    await MealPlan.create([
      { provider: mealProvider._id, name: 'Chicken Fried Rice',    category: 'lunch',     price: 380, description: 'Classic fried rice with chicken and vegetables', isActive: true },
      { provider: mealProvider._id, name: 'Grilled Chicken Salad', category: 'lunch',     price: 450, description: 'Fresh salad with grilled chicken breast',         isActive: true },
      { provider: mealProvider._id, name: 'Egg Hopper',            category: 'breakfast', price: 120, description: 'Traditional Sri Lankan egg hopper',               isActive: true },
      { provider: mealProvider._id, name: 'Creamy Pasta',          category: 'lunch',     price: 550, description: 'Creamy white sauce pasta',                        isActive: true },
      { provider: mealProvider._id, name: 'Chicken Kottu',         category: 'dinner',    price: 480, description: 'Kottu roti with chicken',                        isActive: true },
    ]);

    res.json({
      success: true,
      message: 'Seeded successfully! Demo accounts ready.',
      credentials: {
        student:  'student@demo.com / demo1234',
        landlord: 'landlord@demo.com / demo1234',
        meal:     'meal@demo.com / demo1234',
        facility: 'facility@demo.com / demo1234',
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'UniStay API running',
    env: process.env.NODE_ENV,
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 API health: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
