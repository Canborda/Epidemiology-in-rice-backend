import { Schema, Document, model } from 'mongoose';

import { VarietyI } from './variety.model';
import { ClusterI } from './cluster.model';

export interface PhenologyI extends Document {
  varietyId: VarietyI['_id'];
  clusterId: ClusterI['_id'];
  name: string;
  days: number;
}

const phenologySchema = new Schema({
  varietyId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  clusterId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
});

// Add index for searches by name
phenologySchema.index({ name: 1 }, { unique: false });

// Generate & export model
export const PhenologyModel = model<PhenologyI>('Phenology', phenologySchema);
