import { RequestHandler } from 'express';
import { getStripe } from '../config/stripe.js';
import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';
import { FRONTEND_URL } from '../config/env.js';

export const createCheckoutSession: RequestHandler = async (req, res, next) => {
  try {
    const { bookingId, origin } = req.body;
    const studentId = req.user!.id;
    const baseUrl = origin || FRONTEND_URL;

    const booking = await Booking.findOne({ _id: bookingId, student: studentId }).populate('listing');
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (booking.paymentStatus === 'paid' || booking.paymentStatus === 'processing') {
      res.status(400).json({ message: 'Booking is already paid or payment is in progress' });
      return;
    }

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'lkr',
            product_data: {
              name: (booking.listing as any)?.title || 'Boarding Payment',
            },
            unit_amount: Math.round(booking.amount),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(),
        studentId,
      },
      success_url: `${baseUrl}/student-dashboard?tab=payments&payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/student-dashboard?tab=payments&payment=cancel`,
    });

    booking.stripeSessionId = session.id;
    booking.paymentId = session.id;
    booking.paymentStatus = 'processing';
    await booking.save();

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

export const verifySession: RequestHandler = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      res.status(400).json({ message: 'sessionId required' });
      return;
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      res.status(400).json({ message: 'No booking linked to this session' });
      return;
    }

    if (session.payment_status === 'paid') {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        paymentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.id,
        status: 'confirmed',
      });
      res.json({ verified: true, paid: true });
    } else {
      res.json({ verified: true, paid: false });
    }
  } catch (err) {
    next(err);
  }
};

export const getMyPayments: RequestHandler = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ student: req.user!.id })
      .populate('listing', 'title images')
      .sort({ createdAt: -1 })
      .lean();
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

export const getOwnerPayments: RequestHandler = async (req, res, next) => {
  try {
    const listings = await Listing.find({ owner: req.user!.id }).select('_id').lean();
    const listingIds = listings.map((l: any) => l._id);

    const bookings = await Booking.find({ listing: { $in: listingIds } })
      .populate('listing', 'title')
      .populate('student', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

export const getOwnerStats: RequestHandler = async (req, res, next) => {
  try {
    const ownerId = req.user!.id;
    const listings = await Listing.find({ owner: ownerId }).select('_id').lean();
    const listingIds = listings.map((l: any) => l._id);

    const paidBookings = await Booking.find({ listing: { $in: listingIds }, paymentStatus: 'paid' }).lean();
    const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.amount || 0), 0);

    const uniqueStudents = new Set(paidBookings.map((b) => b.student?.toString()));
    const totalStudents = uniqueStudents.size;

    const pendingConfirmations = await Booking.countDocuments({
      listing: { $in: listingIds },
      paymentStatus: 'processing',
    });

    res.json({
      totalRevenue: `LKR ${totalRevenue.toLocaleString()}`,
      totalStudents,
      pendingConfirmations,
    });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats: RequestHandler = async (req, res, next) => {
  try {
    const studentId = req.user!.id;

    const paidBookings = await Booking.find({ student: studentId, paymentStatus: 'paid' })
      .populate('listing', 'title location.address')
      .sort({ createdAt: -1 })
      .lean();
    const totalSpent = paidBookings.reduce((sum, b) => sum + (b.amount || 0), 0);

    const unpaidBookings = await Booking.find({
      student: studentId,
      paymentStatus: 'unpaid',
    })
      .populate('listing', 'title location.address')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      totalSpent: `LKR ${totalSpent.toLocaleString()}`,
      totalSpentRaw: totalSpent,
      unpaidBookings: unpaidBookings.map((b) => ({
        _id: b._id,
        amount: b.amount,
        listingTitle: (b.listing as any)?.title || 'Boarding',
        listingAddress: (b.listing as any)?.location?.address || '',
      })),
      currentStays: paidBookings.map((b) => ({
        bookingId: b._id,
        title: (b.listing as any)?.title || 'Boarding',
        address: (b.listing as any)?.location?.address || '',
        amount: b.amount,
        paidAt: b.updatedAt,
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const confirmPayment: RequestHandler = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate('listing');
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }
    const listing = booking.listing as any;
    if (listing.owner?.toString() !== req.user!.id) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();
    res.json({ message: 'Payment confirmed' });
  } catch (err) {
    next(err);
  }
};
