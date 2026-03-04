const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    password:  { type: String, required: true, minlength: 6 },
    // Roles: student | landlord | meal_provider | facility
    role: {
      type: String,
      enum: ['student', 'landlord', 'meal_provider', 'facility'],
      default: 'student',
    },
    phone:    { type: String },
    avatar:   { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    // Student-specific
    university:    { type: String },
    studentId:     { type: String },
    // Landlord-specific
    businessName:  { type: String },
    // Notifications settings
    notifications: { email: { type: Boolean, default: true }, sms: { type: Boolean, default: false } },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
