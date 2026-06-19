import { RequestHandler } from 'express';
import Listing from '../models/Listing.js';
import Booking from '../models/Booking.js';
import { createListingSchema, updateListingSchema, queryListingSchema } from '../validation/listingSchemas.js';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const listingUploadDir = path.resolve(currentDir, '../../uploads/listings');

fs.mkdirSync(listingUploadDir, { recursive: true });

const listingStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, listingUploadDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `listing-${uniqueSuffix}${extension}`);
  },
});

export const listingImageUpload = multer({
  storage: listingStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }

    cb(null, true);
  },
});

const mapListing = (doc: any) => ({
  id: doc._id.toString(),
  title: doc.title,
  description: doc.description,
  price: doc.price,
  images: doc.images || [],
  location: {
    address: doc.address,
    coordinates: { lat: doc.location?.coordinates?.[1], lng: doc.location?.coordinates?.[0] },
  },
  owner: doc.owner
    ? {
        id: doc.owner._id ? doc.owner._id.toString() : doc.owner.toString(),
        name: `${doc.owner.firstName ?? ''} ${doc.owner.lastName ?? ''}`.trim(),
        email: doc.owner.email,
        profilePicture: doc.owner.profilePicture ?? null,
      }
    : null,
  amenities: doc.amenities || [],
  capacity: doc.capacity,
  currentOccupants: doc.currentOccupants,
  isAvailable: doc.isAvailable,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export const listBoardings: RequestHandler = async (req, res, next) => {
  try {
    const q = queryListingSchema.parse(req.query);
    const { page, limit, sort, q: text, priceMin, priceMax, amenities, lat, lng, radiusKm } = q as any;

    const filter: any = {};

    if (text) {
      filter.$text = { $search: text };
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      filter.price = {};
      if (priceMin !== undefined) filter.price.$gte = priceMin;
      if (priceMax !== undefined) filter.price.$lte = priceMax;
    }

    if (amenities && amenities.length) {
      filter.amenities = { $all: amenities };
    }

    if (lat !== undefined && lng !== undefined && radiusKm !== undefined) {
      const meters = radiusKm * 1000;
      filter.location = {
        $geoWithin: { $centerSphere: [[lng, lat], meters / 6378137] },
      };
    }

    const skip = (page - 1) * limit;
    const mongooseQuery = Listing.find(filter).populate('owner', 'firstName lastName email profilePicture');

    if (sort) {
      mongooseQuery.sort(sort);
    } else {
      mongooseQuery.sort({ createdAt: -1 });
    }

    const [total, items] = await Promise.all([Listing.countDocuments(filter), mongooseQuery.skip(skip).limit(limit).exec()]);

    res.json({
      data: items.map(mapListing),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

export const getBoardingById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const doc = await Listing.findById(id).populate('owner', 'firstName lastName email profilePicture').exec();
    if (!doc) return res.status(404).json({ message: 'Listing not found' });

    res.json(mapListing(doc));
  } catch (err) {
    next(err);
  }
};

export const createBoarding: RequestHandler = async (req: any, res, next) => {
  try {
    const body = createListingSchema.parse(req.body);
    const ownerId = req.user.id;
    const location = { type: 'Point', coordinates: [body.coordinates.lng, body.coordinates.lat] };

    const created = await Listing.create({
      title: body.title,
      description: body.description,
      price: body.price,
      address: body.address,
      location,
      images: body.images,
      owner: ownerId,
      amenities: body.amenities,
      capacity: body.capacity,
      isAvailable: body.isAvailable,
    });

    await (created as any).populate('owner', 'firstName lastName email profilePicture');
    res.status(201).json(mapListing(created));
  } catch (err) {
    next(err);
  }
};

export const updateBoarding: RequestHandler = async (req: any, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const payload = updateListingSchema.parse(req.body);
    const doc = await Listing.findById(id).exec();
    if (!doc) return res.status(404).json({ message: 'Listing not found' });

    const isOwner = doc.owner.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });

    if ((payload as any).coordinates) {
      (payload as any).location = { type: 'Point', coordinates: [(payload as any).coordinates.lng, (payload as any).coordinates.lat] };
      delete (payload as any).coordinates;
    }

    Object.assign(doc, payload);
    await doc.save();
    await (doc as any).populate('owner', 'firstName lastName email profilePicture');
    res.json(mapListing(doc));
  } catch (err) {
    next(err);
  }
};

export const deleteBoarding: RequestHandler = async (req: any, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const doc = await Listing.findById(id).exec();
    if (!doc) return res.status(404).json({ message: 'Listing not found' });

    const isOwner = doc.owner.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });

    await doc.deleteOne();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export const recountOccupants: RequestHandler = async (req: any, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const listing = await Listing.findById(id).exec();
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const isOwner = listing.owner.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });

    const activeCount = await Booking.countDocuments({
      listing: id,
      paymentStatus: 'paid',
      status: { $ne: 'cancelled' },
    });

    listing.currentOccupants = activeCount;
    listing.isAvailable = listing.currentOccupants < listing.capacity;
    await listing.save();

    res.json(mapListing(listing));
  } catch (err) {
    next(err);
  }
};

export const uploadListingImages: RequestHandler = async (req: any, res, next) => {
  try {
    const files = (req.files ?? []) as Express.Multer.File[];

    if (!files.length) {
      res.status(400).json({ message: 'No image files were uploaded' });
      return;
    }

    const images = files.map((file) => `/uploads/listings/${file.filename}`);

    res.status(201).json({
      message: 'Images uploaded successfully',
      images,
    });
  } catch (err) {
    next(err);
  }
};
