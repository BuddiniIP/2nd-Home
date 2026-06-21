import { Request, Response } from "express";
import User from "../models/User.js";
import SavedListing from "../models/SavedListing.js";
import Booking from "../models/Booking.js";
import { ensureCurrentMonthBooking } from "./paymentController.js";

export const saveListing = async (req: Request, res: Response) => {
  try {
    const { listing } = req.body;

    const existing = await SavedListing.findOne({ student: req.user?.id, listing });

    if (existing) {
      return res.status(200).json({ message: "Already saved", saved: existing });
    }

    const saved = await SavedListing.create({ student: req.user?.id, listing });

    return res.status(201).json(saved);
  } catch (error: any) {
    // Handle duplicate key errors that may occur due to race conditions
    if (error && (error as any).code === 11000) {
      try {
        const existingSaved = await SavedListing.findOne({ student: req.user?.id, listing: req.body.listing });
        if (existingSaved) {
          return res.status(200).json({ message: 'Already saved', saved: existingSaved });
        }
      } catch (err) {
        // fallthrough to generic error
      }
    }

    return res.status(500).json({ message: error.message });
  }
};

export const getSavedListings = async (req: Request, res: Response) => {
  try {
    if (req.user?.id) await ensureCurrentMonthBooking(req.user.id);
    const savedListings = await SavedListing.find({ student: req.user?.id }).populate('listing');
    const listingIds = savedListings.map(s => s.listing._id || s.listing);
    const bookings = await Booking.find({
      student: req.user?.id,
      listing: { $in: listingIds },
      paymentStatus: { $in: ['paid', 'unpaid', 'processing'] },
      status: { $ne: 'cancelled' },
    }).select('listing paymentStatus').lean();
    const bookingMap = new Map<string, string>();
    bookings.forEach((b: any) => {
      const lid = b.listing?.toString();
      if (lid) {
        const existing = bookingMap.get(lid);
        if (!existing || (existing === 'unpaid' && b.paymentStatus === 'paid')) {
          bookingMap.set(lid, b.paymentStatus);
        }
      }
    });
    const result = savedListings.map(s => ({
      ...s.toObject(),
      bookingStatus: bookingMap.get(s.listing?._id?.toString() || s.listing?.toString()) || null,
    }));
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeSavedListing = async (req: Request, res: Response) => {
  try {
    const savedListing = await SavedListing.findById(req.params.id);

    if (!savedListing) {
      return res.status(404).json({ message: 'Saved listing not found' });
    }

    if (savedListing.student.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Booking.updateMany(
      { student: req.user?.id, listing: savedListing.listing, paymentStatus: 'unpaid' },
      { paymentStatus: 'cancelled', status: 'cancelled' },
    );

    await savedListing.deleteOne();

    return res.json({ message: 'Saved listing removed' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCurrentBoarding = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const allBookings = await Booking.find({
      student: userId,
      paymentStatus: 'paid',
    })
      .populate({ path: 'listing', populate: { path: 'owner', select: 'firstName lastName email phone' } })
      .sort({ createdAt: -1 })
      .lean();

    const mapBooking = (b: any) => {
      const listing = b.listing;
      if (!listing) return null;
      const ownerName = listing.owner ? `${listing.owner.firstName || ''} ${listing.owner.lastName || ''}`.trim() || 'Owner' : 'Owner';
      const ownerPhone = listing.owner?.phone || listing.owner?.email || 'N/A';
      return {
        bookingId: b._id,
        id: listing._id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        monthlyRent: listing.price,
        address: listing.address,
        location: listing.address,
        image: listing.images?.[0] || '/images/house_white.jpg',
        images: listing.images,
        owner: ownerName,
        phone: ownerPhone,
        startDate: b.startDate ? new Date(b.startDate).toLocaleDateString() : 'N/A',
        endDate: b.endDate ? new Date(b.endDate).toLocaleDateString() : 'N/A',
        amenities: listing.amenities || [],
        capacity: listing.capacity,
        currentOccupants: listing.currentOccupants,
        isAvailable: listing.isAvailable,
      };
    };

    const current: any[] = [];
    const previous: any[] = [];

    for (const b of allBookings) {
      const s = mapBooking(b);
      if (!s) continue;
      if (b.status === 'cancelled') previous.push(s);
      else current.push(s);
    }

    res.json({ current, previous });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCurrentBoarding = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({ message: 'listingId is required' });
    }

    const user = (await User.findByIdAndUpdate(
      userId,
      { currentBoarding: listingId },
      { returnDocument: 'after' }
    ).populate('currentBoarding')) as any;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'Current boarding updated successfully', currentBoarding: user.currentBoarding });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

