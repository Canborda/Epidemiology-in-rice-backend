import { Schema, Document, model } from 'mongoose';

export interface VarietyI extends Document {
  name: string;
}

const varietySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

// Add index for searches by name
varietySchema.index({ name: 1 }, { unique: true });

// Generate & export model
export const VarietyModel = model<VarietyI>('Variety', varietySchema);
