import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlace extends Document {
  name: string;
  country: string;
  category: string;
  description: string;
  shortDescription?: string;
  bestTime: string;
  whySpecial: string;
  thingsToDo: string[];
  images: string[];
  mapLink: string;
  budget: string;
  safety: string;
  tips: string[];
  rating?: number;
  isWorldWonder?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlaceSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    bestTime: {
      type: String,
      required: [true, 'Best time to visit is required'],
    },
    whySpecial: {
      type: String,
      required: [true, 'Why this place is special is required'],
    },
    thingsToDo: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    mapLink: {
      type: String,
      default: '',
    },
    budget: {
      type: String,
      required: [true, 'Budget is required'],
    },
    safety: {
      type: String,
      required: [true, 'Safety information is required'],
    },
    tips: {
      type: [String],
      default: [],
    },
    shortDescription: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isWorldWonder: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Place: Model<IPlace> = mongoose.models.Place || mongoose.model<IPlace>('Place', PlaceSchema);

export default Place;

