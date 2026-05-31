import { RequestHandler } from 'express';
import User, { UserRole } from '../models/User.js';
import Listing from '../models/Listing.js';

const getMonthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;

const buildGrowthSeries = (userDocs: any[], listingDocs: any[]) => {
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    return {
      key: getMonthKey(date),
      month: date.toLocaleString('en-US', { month: 'short' }),
      users: 0,
      revenue: 0,
    };
  });

  const monthLookup = new Map(months.map((entry) => [entry.key, entry]));

  for (const user of userDocs) {
    const key = getMonthKey(new Date(user.createdAt));
    const bucket = monthLookup.get(key);
    if (bucket) bucket.users += 1;
  }

  for (const listing of listingDocs) {
    const key = getMonthKey(new Date(listing.createdAt));
    const bucket = monthLookup.get(key);
    if (bucket) bucket.revenue += Number(listing.price || 0);
  }

  return months.map(({ key, ...entry }) => entry);
};

export const getAdminStats: RequestHandler = async (_req, res, next) => {
  try {
    const [users, listings] = await Promise.all([
      User.find().select('role createdAt').lean(),
      Listing.find().select('price isAvailable createdAt').lean(),
    ]);

    const studentCount = users.filter((user) => user.role === UserRole.STUDENT).length;
    const ownerCount = users.filter((user) => user.role === UserRole.OWNER).length;
    const adminCount = users.filter((user) => user.role === UserRole.ADMIN).length;
    const activeBoardings = listings.filter((listing) => listing.isAvailable).length;
    const monthlyRevenue = listings.reduce((sum, listing) => sum + Number(listing.price || 0), 0);

    res.json({
      summary: {
        totalUsers: users.length,
        studentCount,
        ownerCount,
        adminCount,
        activeBoardings,
        monthlyRevenue,
      },
      growthData: buildGrowthSeries(users, listings),
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();

    res.json(
      users.map((user) => ({
        id: user._id.toString(),
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role,
        status: user.isActive ? 'active' : 'inactive',
        university: user.university || 'Platform user',
        profilePicture: user.profilePicture || null,
        createdAt: (user as any).createdAt,
      }))
    );
  } catch (err) {
    next(err);
  }
};

export const getAdminBoardings: RequestHandler = async (_req, res, next) => {
  try {
    const boardings = await Listing.find().populate('owner', 'firstName lastName email profilePicture').sort({ createdAt: -1 }).lean();

    res.json({
      data: boardings.map((boarding: any) => ({
        id: boarding._id.toString(),
        title: boarding.title,
        description: boarding.description,
        price: boarding.price,
        images: boarding.images || [],
        location: {
          address: boarding.address,
          coordinates: { lat: boarding.location?.coordinates?.[1], lng: boarding.location?.coordinates?.[0] },
        },
        owner: boarding.owner
          ? {
              id: boarding.owner._id ? boarding.owner._id.toString() : boarding.owner.toString(),
              name: `${boarding.owner.firstName ?? ''} ${boarding.owner.lastName ?? ''}`.trim(),
              email: boarding.owner.email,
              profilePicture: boarding.owner.profilePicture ?? null,
            }
          : null,
        amenities: boarding.amenities || [],
        capacity: boarding.capacity,
        isAvailable: boarding.isAvailable,
        createdAt: boarding.createdAt,
        updatedAt: boarding.updatedAt,
      })),
      meta: {
        total: boardings.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminPayments: RequestHandler = async (_req, res) => {
  res.json([]);
};

export const getAdminMessages: RequestHandler = async (_req, res) => {
  res.json([]);
};

export const getAdminReports: RequestHandler = async (_req, res) => {
  res.json([]);
};