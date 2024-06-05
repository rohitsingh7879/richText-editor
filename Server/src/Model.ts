import mongoose, { Document } from 'mongoose';

export interface IContent extends Document {
  title: string;
  content: string;
  userEmail: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const contentSchema = new mongoose.Schema({
  title: String,
  content: String,
  userEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Content = mongoose.model<IContent>('Content', contentSchema);

export { Content };
