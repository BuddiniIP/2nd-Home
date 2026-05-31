import connectDB from '../config/db.js';
import Listing from '../models/Listing.js';

const run = async () => {
  if (process.env.ALLOW_INDEX_SYNC !== 'true') {
    console.error('Refusing to sync indexes. Set ALLOW_INDEX_SYNC=true to continue.');
    process.exitCode = 1;
    return;
  }

  try {
    await connectDB();
    const result = await Listing.syncIndexes();

    console.log('Listing indexes synced successfully.');
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = 0;
  } catch (error) {
    console.error('Failed to sync indexes:', error);
    process.exitCode = 1;
  }
};

void run();
