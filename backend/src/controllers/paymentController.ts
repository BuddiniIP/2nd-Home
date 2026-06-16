import { RequestHandler } from 'express';
import { getStripe } from '../config/stripe.js';
import Booking from '../models/Booking.js';
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

    if (booking.paymentStatus === 'paid') {
      res.status(400).json({ message: 'Booking is already paid' });
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
            unit_amount: Math.round(booking.amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(),
        studentId,
      },
      success_url: `${baseUrl}/student-dashboard?tab=payments`,
      cancel_url: `${baseUrl}/student-dashboard?tab=payments`,
    });

    booking.stripeSessionId = session.id;
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
        paymentId: session.id,
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
    const bookings = await Booking.find()
      .populate({
        path: 'listing',
        match: { owner: req.user!.id },
        select: 'title',
      })
      .populate('student', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();

    const filtered = bookings.filter((b) => b.listing);
    res.json(filtered);
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats: RequestHandler = async (req, res, next) => {
  try {
    const studentId = req.user!.id;

    const paidBookings = await Booking.find({ student: studentId, paymentStatus: 'paid' }).lean();
    const totalSpent = paidBookings.reduce((sum, b) => sum + (b.amount || 0), 0);

    const nextUnpaid = await Booking.findOne({
      student: studentId,
      paymentStatus: { $in: ['unpaid', 'processing'] },
    })
      .populate('listing', 'title')
      .sort({ createdAt: -1 })
      .lean();

    const currentStay = await Booking.findOne({ student: studentId, paymentStatus: 'paid' })
      .populate('listing', 'title')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      totalSpent: `LKR ${totalSpent.toLocaleString()}`,
      nextPaymentTitle: nextUnpaid ? `LKR ${nextUnpaid.amount.toLocaleString()}` : null,
      nextPaymentSubtitle: nextUnpaid ? (nextUnpaid.listing as any)?.title || 'Boarding' : null,
      currentStay: currentStay ? 'Active' : null,
      currentStayLocation: currentStay ? (currentStay.listing as any)?.title || 'Boarding' : null,
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
