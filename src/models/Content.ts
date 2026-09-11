import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IContent extends Document {
  title: string;
  description?: string;
  category: string;
  type: 'VIDEO' | 'PDF' | 'HTML';
  s3Key?: string;
  fileUrl: string; // <-- Make sure this is explicitly defined
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, required: true },
    type: { type: String, enum: ['VIDEO', 'PDF', 'HTML'], required: true },
    s3Key: { type: String },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export const Content = models.Content || model<IContent>('Content', ContentSchema);