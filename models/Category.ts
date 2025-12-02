import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  title: string;
  description: string;
  image: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Category title is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;

