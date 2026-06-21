import { v2 as cloudinary } from 'cloudinary';
import multer, { StorageEngine } from 'multer';

let _initialized = false;

const ensureCloudinary = () => {
  if (_initialized) return;

  // Use Node's URL parser which handles URL encoding properly
  const parseUrl = (raw: string) => {
    try {
      const url = new URL(raw);
      const auth = url.username ? { api_key: url.username, api_secret: url.password, cloud_name: url.hostname } : null;
      return auth;
    } catch {
      return null;
    }
  };

  let cloudName = '';
  let apiKey = '';
  let apiSecret = '';

  const rawUrl = process.env.CLOUDINARY_URL;
  if (rawUrl) {
    const parsed = parseUrl(rawUrl);
    if (parsed) {
      cloudName = parsed.cloud_name;
      apiKey = parsed.api_key;
      apiSecret = parsed.api_secret;
      console.log(`[Cloudinary] Parsed from CLOUDINARY_URL → cloud: ${cloudName}`);
    } else {
      console.warn('[Cloudinary] CLOUDINARY_URL could not be parsed:', rawUrl.slice(0, 30) + '...');
    }
  }

  if (!cloudName) {
    cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
    apiKey = process.env.CLOUDINARY_API_KEY || '';
    apiSecret = process.env.CLOUDINARY_API_SECRET || '';
    if (cloudName) {
      console.log('[Cloudinary] Using individual CLOUDINARY_CLOUD_NAME vars');
    }
  }

  if (!cloudName) {
    console.error('[Cloudinary] No credentials found in environment.');
    console.error('[Cloudinary] Checking process.env keys:', Object.keys(process.env).filter(k => k.includes('CLOUD')).join(', ') || '(none found)');
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_URL (or CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET) in your .env file.\n' +
      'Get free credentials at https://cloudinary.com/register'
    );
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  const maskedKey = apiKey.slice(0, 4) + '****' + apiKey.slice(-4);
  const maskedSecret = apiSecret.slice(0, 2) + '****' + apiSecret.slice(-2);
  console.log(`[Cloudinary] Configured — cloud: ${cloudName}, key: ${maskedKey}, secret: ${maskedSecret}`);

  _initialized = true;
};

const cloudinaryStorage = (folder: string): StorageEngine => ({
  _handleFile: (req, file, cb) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err) {
          console.error(`[Cloudinary] Upload error (${err.http_code}): ${err.message}`);
          if (err.http_code === 403) {
            console.error('[Cloudinary] 403 = invalid credentials. Copy the EXACT CLOUDINARY_URL from your Cloudinary Dashboard > Account > API Keys.');
            console.error('[Cloudinary] The URL looks like: cloudinary://<api_key>:<api_secret>@<cloud_name>');
          }
          cb(err);
          return;
        }
        const url = result?.secure_url || result?.url;
        console.log(`[Cloudinary] Uploaded to ${result?.public_id} — ${url}`);
        cb(null, {
          path: url,
          filename: result?.public_id,
          size: result?.bytes,
        });
      }
    );
    file.stream.pipe(uploadStream);
  },
  _removeFile: (_req, file, cb) => {
    if (file.filename) {
      cloudinary.uploader.destroy(file.filename, undefined, (err: any) => cb(err));
    } else {
      cb(null);
    }
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype)) {
    cb(new Error('Only JPG, PNG, GIF, and WebP images are allowed'));
    return;
  }
  cb(null, true);
};

export const deleteCloudinaryImage = async (url: string | undefined) => {
  if (!url || !url.includes('res.cloudinary.com')) return;
  const match = url.match(/\/upload\/v\d+\/(.+)\.\w+$/);
  if (match) {
    const publicId = match[1];
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log(`[Cloudinary] Deleted old image: ${publicId}`);
    } catch {
      // ignore if already gone
    }
  }
};

export const getProfileUpload = () => {
  ensureCloudinary();
  return multer({ storage: cloudinaryStorage('2nd-home/profiles'), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });
};

export const getListingUpload = () => {
  ensureCloudinary();
  return multer({ storage: cloudinaryStorage('2nd-home/listings'), limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });
};
