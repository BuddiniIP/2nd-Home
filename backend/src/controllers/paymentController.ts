import { RequestHandler } from 'express';
import stripe from '../config/stripe.js';
import Booking from '../models/Booking.js';
import { FRONTEND_URL } from '../config/env.js';

export const createCheckoutSession: RequestHandler = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const studentId = req.user!.id;

    const booking = await Booking.findOne({ _id: bookingId, student: studentId }).populate('listing');
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (booking.paymentStatus === 'paid') {
      res.status(400).json({ message: 'Booking is already paid' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
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
      success_url: `${FRONTEND_URL}/student-dashboard?tab=payments&payment=success`,
      cancel_url: `${FRONTEND_URL}/student-dashboard?tab=payments&payment=cancel`,
    });

    booking.stripeSessionId = session.id;
    booking.paymentStatus = 'processing';
    await booking.save();

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

export const stripeWebhook: RequestHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret!);
  } catch {
    res.status(400).json({ message: 'Invalid signature' });
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        paymentId: session.id,
        status: 'confirmed',
      });
    }
  }

  res.json({ received: true });
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
