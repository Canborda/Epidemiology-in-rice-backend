import { Schema, Document, model } from 'mongoose';
import { CoordinatesI } from '../interfaces';

import { VarietyI } from './variety.model';

export interface ClusterI extends Document {
  varietyId: VarietyI['_id'];
  name: string;
  polygon: Array<CoordinatesI>;
}

const clusterSchema = new Schema({
  varietyId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  polygon: {
    type: Array<CoordinatesI>,
    required: true,
  },
});

// Add index for searches by name
clusterSchema.index({ name: 1 }, { unique: false });

// Generate & export model
export const ClusterModel = model<ClusterI>('Cluster', clusterSchema);
