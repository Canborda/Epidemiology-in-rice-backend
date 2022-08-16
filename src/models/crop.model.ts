import { Schema, Document, model } from 'mongoose';

export interface CropI extends Document {
  name: string;
  variety: string;
  phenology: object;
  disseases: string[];
  indexes: string[];
}

const cropSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  variety: {
    type: String,
    required: true,
  },
  phenology: {
    type: Object,
    required: true,
  },
  disseases: {
    type: Array<String>,
    required: true,
  }
});

// Add index for searches by name
cropSchema.index({ name: 1 }, { unique: false });

// Generate & export model
export const CropModel = model<CropI>('Crop', cropSchema);
