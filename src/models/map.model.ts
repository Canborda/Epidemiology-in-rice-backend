import mongoose from 'mongoose';

const mapSchema = new mongoose.Schema({
  userId: String,
  name: String,
  polygon: Array,
});

// Generate & export model
export const MapModel = mongoose.model('Map', mapSchema);
