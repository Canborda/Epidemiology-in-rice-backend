import { Schema, Document, model } from 'mongoose';
import { UserI } from './user.model';
import { CropI } from './crop.model';

export interface MapI extends Document {
  owner: UserI['_id'];
  crop: CropI['_id'];
  name: string;
  seedDate: Date;
  polygon: Array<Float32List>;
}

const mapSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  crop: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  seedDate: {
    type: Date,
    required: true,
  },
  polygon: {
    type: Array<Float32List>,
    required: true,
  },
});

// Add index for searches by name
mapSchema.index({ name: 1 }, { unique: false });

// Generate & export model
export const MapModel = model<MapI>('Map', mapSchema);
