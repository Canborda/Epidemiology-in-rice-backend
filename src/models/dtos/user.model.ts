import { Schema, Document, model } from 'mongoose';
import bcrypt from 'bcrypt';

import { ROLES } from '../../utils/enums';

export interface UserI extends Document {
  role: ROLES;
  email: string;
  password: string;
  name: string;
  region: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema({
  role: {
    type: Number,
    required: true,
    default: ROLES.USER,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
});

// Add index for searches by email
userSchema.index({ email: 1 }, { unique: true });

// Encrypt password when the user registers
userSchema.pre('save', async function (this: UserI, next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

// Compare a candidaate password with user's password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as UserI;
  return bcrypt.compare(candidatePassword, user.password).catch(e => false);
};

// Generate & export model
export const UserModel = model<UserI>('User', userSchema);
