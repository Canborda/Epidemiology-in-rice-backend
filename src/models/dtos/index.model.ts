import { Schema, Document, model } from 'mongoose';
import { INDEXES } from '../../utils/enums';

import { VarietyI } from './variety.model';
import { ClusterI } from './cluster.model';
import { PhenologyI } from './phenology.model';

export interface IndexI extends Document {
  varietyId: VarietyI['_id'];
  clusterId: ClusterI['_id'];
  phenologyId: PhenologyI['_id'];
  name: INDEXES;
  mean: number;
  min: number;
  max: number;
}

const indexSchema = new Schema({
  varietyId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  clusterId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  phenologyId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mean: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
});

// Add index for searches by name
indexSchema.index({ name: 1 }, { unique: false });

// Generate & export model
export const IndexModel = model<IndexI>('Index', indexSchema);
