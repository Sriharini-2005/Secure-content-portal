import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  role: { type: String, enum: ['ADMIN', 'VIEWER'], default: 'VIEWER' },
});

export const User = models.User || model('User', UserSchema);