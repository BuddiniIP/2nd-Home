import mongoose, { Schema, Document } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  price: number;
  address: string;
  location: { type: 'Point'; coordinates: [number, number] };
  images: string[];
  owner: mongoose.Types.ObjectId;
  amenities: string[];
  capacity: number;
  currentOccupants: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    address: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    images: { type: [String], default: [] },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amenities: { type: [String], default: [] },
    capacity: { type: Number, default: 1 },
    currentOccupants: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ListingSchema.index({ title: 'text', description: 'text' });
ListingSchema.index({ price: 1 });
ListingSchema.index({ location: '2dsphere' });

ListingSchema.index({ owner: 1 });
ListingSchema.index({ createdAt: -1 });

export default mongoose.models.Listing || mongoose.model<IListing>('Listing', ListingSchema);
