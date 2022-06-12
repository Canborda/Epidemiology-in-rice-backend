import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  country: String,
  avatar: String,
});

// Generate & export model
export const UserModel = mongoose.model('User', userSchema);
