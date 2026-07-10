import connectDB from '../config/db.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Report from '../models/Report.js';

const run = async () => {
  if (process.env.ALLOW_INDEX_SYNC !== 'true') {
    console.error('Refusing to sync indexes. Set ALLOW_INDEX_SYNC=true to continue.');
    process.exitCode = 1;
    return;
  }

  try {
    await connectDB();

    const result = await Promise.all([
      User.syncIndexes(),
      Listing.syncIndexes(),
      Booking.syncIndexes(),
      Report.syncIndexes(),
    ]);

    console.log('All indexes synced successfully.');
    console.log(JSON.stringify(result, null, 2));

    process.exitCode = 0;
  } catch (error) {
    console.error('Failed to sync indexes:', error);
    process.exitCode = 1;
  }
};

void run();