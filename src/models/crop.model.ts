import { Schema, Document, model } from 'mongoose';

import { INDEXES } from '../utils/enums';

export interface CropI extends Document {
  name: string;
  variety: string;
  phenology: PhenologyI[];
}

export interface PhenologyI {
  name: string;
  days: number;
  indexes: Array<IndexI>;
}

export interface IndexI {
  name: INDEXES;
  value: number;
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
    type: Array<PhenologyI>,
    required: true,
  },
});

// Add index for searches by name and variety
cropSchema.index({ name: 1, variety: -1 }, { unique: true });

// Generate & export model
export const CropModel = model<CropI>('Crop', cropSchema);
