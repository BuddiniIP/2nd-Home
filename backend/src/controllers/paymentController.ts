import { RequestHandler } from 'express';
import { getStripe } from '../config/stripe.js';
import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { FRONTEND_URL } from '../config/env.js';

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const ensureCurrentMonthBooking = async (studentId: string) => {
  try {
    const user = await User.findById(studentId).lean();
    const now = new Date();
    const curMonth = now.getMonth() + 1;
    const curYear = now.getFullYear();

    const allUnpaid = await Booking.find({
      student: studentId,
      paymentStatus: { $in: ['unpaid', 'processing'] },
    }).sort({ createdAt: -1 }).lean();

    const seen = new Map<string, number>();
    const toDelete: string[] = [];
    for (const b of allUnpaid) {
      const lid = b.listing?.toString() || '';
      const key = `${lid}_${b.month || ''}_${b.year || ''}`;
      const idx = seen.get(key);
      if (idx !== undefined) {
        toDelete.push(b._id.toString());
      } else {
        seen.set(key, 0);
      }
    }

    if (!user?.currentBoarding) {
      if (allUnpaid.length > 1) {
        const keepId = allUnpaid[0]._id;
        for (const b of allUnpaid) {
          if (b._id.toString() !== keepId.toString()) {
            toDelete.push(b._id.toString());
          }
        }
      }
    } else {
      const curListingId = user.currentBoarding.toString();
      for (const b of allUnpaid) {
        const lid = b.listing?.toString() || '';
        const by = b.year || 0;
        const bm = b.month || 0;
        if (lid === curListingId && (by > curYear || (by === curYear && bm > curMonth))) {
          toDelete.push(b._id.toString());
        }
      }
    }

    const uniqueIds = [...new Set(toDelete)];
    if (uniqueIds.length > 0) {
      await Booking.deleteMany({ _id: { $in: uniqueIds } });
    }

    if (user?.currentBoarding) {
      const lastPaid = await Booking.findOne({
        student: studentId,
        listing: user.currentBoarding,
        paymentStatus: 'paid',
      }).sort({ year: -1, month: -1 }).lean();
      if (lastPaid) {
        const paidMonth = lastPaid.month || (lastPaid.startDate ? new Date(lastPaid.startDate).getMonth() + 1 : 0);
        const paidYear = lastPaid.year || (lastPaid.startDate ? new Date(lastPaid.startDate).getFullYear() : 0);
        if (paidYear < curYear || (paidYear === curYear && paidMonth < curMonth)) {
          const exists = await Booking.findOne({
            student: studentId,
            listing: user.currentBoarding,
            month: curMonth,
            year: curYear,
          });
          if (!exists) {
            const fromLastPaid = await Booking.findById(lastPaid._id).populate('listing', 'price');
            const amount = (fromLastPaid as any)?.listing?.price || lastPaid.amount || 0;
            const startDate = new Date(curYear, curMonth - 1, 1);
            const endDate = new Date(curYear, curMonth, 0);
            await Booking.create({
              student: studentId,
              listing: user.currentBoarding,
              startDate, endDate, amount,
              status: 'pending', paymentStatus: 'unpaid',
              month: curMonth, year: curYear,
            });
          }
        }
      }
    }
  } catch (e) { console.error('ensureCurrentMonthBooking error:', e); }
};

const notifyOwnerOnPayment = async (booking: any) => {
  try {
    const listing = await Listing.findById(booking.listing).lean();
    if (!listing?.owner) return;
    const student = await User.findById(booking.student).select('firstName lastName').lean();
    const studentName = student ? `${student.firstName} ${student.lastName}` : 'A student';
    await Notification.create({
      recipient: listing.owner,
      type: 'payment',
      title: 'Payment Received',
      message: `${studentName} has paid LKR ${booking.amount?.toLocaleString()} for ${(listing as any).title || 'boarding'}.`,
      link: '/owner-dashboard?tab=payments',
      relatedId: booking._id,
    });
  } catch (e) { console.error('notifyOwnerOnPayment error:', e); }
};

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
    const sessionStudentId = session.metadata?.studentId;

    if (!bookingId) {
      res.status(400).json({ message: 'No booking linked to this session' });
      return;
    }

    if (sessionStudentId !== req.user!.id) {
      res.status(403).json({ message: 'This session does not belong to you' });
      return;
    }

    const isPaid = session.payment_status === 'paid' || session.status === 'complete';
    if (isPaid) {
      const existing = await Booking.findById(bookingId);
      if (!existing) {
        res.status(404).json({ message: 'Booking not found' });
        return;
      }

      const isAlreadyProcessed = existing.paymentStatus === 'paid';

      if (!isAlreadyProcessed) {
        existing.paymentStatus = 'paid';
        existing.paymentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.id;
        existing.status = 'confirmed';
        await existing.save();

        await User.findByIdAndUpdate(existing.student, { currentBoarding: existing.listing });
        await notifyOwnerOnPayment(existing);

        await Listing.findByIdAndUpdate(existing.listing, {
          $inc: { currentOccupants: 1 },
        });
      }

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
    await ensureCurrentMonthBooking(req.user!.id);
    const bookings = await Booking.find({
      student: req.user!.id,
    })
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

    const activePaidBookings = paidBookings.filter((b: any) => b.status !== 'cancelled');
    const uniqueStudents = new Set(activePaidBookings.map((b) => b.student?.toString()));
    const totalStudents = uniqueStudents.size;

    const activeStays = activePaidBookings.length;

    const pendingConfirmations = await Booking.countDocuments({
      listing: { $in: listingIds },
      paymentStatus: { $in: ['unpaid', 'processing'] },
    });

    res.json({
      totalRevenue: `LKR ${totalRevenue.toLocaleString()}`,
      totalStudents,
      activeStays,
      pendingConfirmations,
    });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats: RequestHandler = async (req, res, next) => {
  try {
    const studentId = req.user!.id;
    await ensureCurrentMonthBooking(studentId);

    const allPaidBookings = await Booking.find({ student: studentId, paymentStatus: 'paid' })
      .populate('listing', 'title location.address')
      .sort({ createdAt: -1 })
      .lean();
    const totalSpent = allPaidBookings.reduce((sum, b) => sum + (b.amount || 0), 0);

    const activePaid = allPaidBookings.filter((b: any) => b.status !== 'cancelled');

    const unpaidBookings = await Booking.find({
      student: studentId,
      paymentStatus: { $in: ['unpaid', 'processing'] },
      status: { $ne: 'cancelled' },
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
      currentStays: activePaid.map((b) => ({
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
    await User.findByIdAndUpdate(booking.student, { currentBoarding: booking.listing });
    await notifyOwnerOnPayment(booking);
    await Listing.findByIdAndUpdate(booking.listing, {
      $inc: { currentOccupants: 1 },
    });
    res.json({ message: 'Payment confirmed' });
  } catch (err) {
    next(err);
  }
};

export const handleStripeWebhook: RequestHandler = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    if (!sig) {
      res.status(400).json({ message: 'Missing stripe-signature header' });
      return;
    }
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      res.status(500).json({ message: 'Stripe webhook secret not configured' });
      return;
    }
    const event = getStripe().webhooks.constructEvent(req.body, sig, secret);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const bookingId = session.metadata?.bookingId;
      if (bookingId) {
        const booking = await Booking.findById(bookingId);
        if (booking && booking.paymentStatus !== 'paid') {
          booking.paymentStatus = 'paid';
          booking.paymentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.id;
          booking.status = 'confirmed';
          await booking.save();
          await User.findByIdAndUpdate(booking.student, { currentBoarding: booking.listing });
          await notifyOwnerOnPayment(booking);
          await Listing.findByIdAndUpdate(booking.listing, {
            $inc: { currentOccupants: 1 },
          });
        }
      }
    }
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};

export const checkoutStudent: RequestHandler = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) { res.status(404).json({ message: 'Booking not found' }); return; }

    // Issue Stripe refund if the booking was already paid
    if (booking.paymentStatus === 'paid' && booking.paymentId) {
      try {
        const stripe = getStripe();
        const paymentIntentId = typeof booking.paymentId === 'string' && booking.paymentId.startsWith('pi_')
          ? booking.paymentId
          : undefined;
        if (paymentIntentId) {
          await stripe.refunds.create({ payment_intent: paymentIntentId });
        }
      } catch (refundErr) {
        console.error('Stripe refund failed:', refundErr);
      }
    }

    booking.status = 'cancelled';
    await booking.save();
    const user = await User.findById(booking.student);
    if (user && user.currentBoarding?.toString() === booking.listing?.toString()) {
      await User.findByIdAndUpdate(user._id, { $unset: { currentBoarding: '' } });
    }
    await Listing.findByIdAndUpdate(booking.listing, {
      $inc: { currentOccupants: -1 },
    });
    res.json({ message: 'Student checked out successfully' });
  } catch (err) {
    next(err);
  }
};
