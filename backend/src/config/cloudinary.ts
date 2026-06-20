import { v2 as cloudinary } from 'cloudinary';
import multer, { StorageEngine } from 'multer';

let _initialized = false;

const ensureCloudinary = () => {
  if (_initialized) return;
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!name || !key || !secret) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file. ' +
      'Get free credentials at https://cloudinary.com/register'
    );
  }
  cloudinary.config({ cloud_name: name, api_key: key, api_secret: secret });
  console.log(`[Cloudinary] Configured — cloud name: ${name}`);
  _initialized = true;
};

const cloudinaryStorage = (folder: string): StorageEngine => ({
  _handleFile: (req, file, cb) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err) { console.error('[Cloudinary] Upload error:', err); cb(err); return; }
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

export const getProfileUpload = () => {
  ensureCloudinary();
  return multer({ storage: cloudinaryStorage('2nd-home/profiles'), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });
};

export const getListingUpload = () => {
  ensureCloudinary();
  return multer({ storage: cloudinaryStorage('2nd-home/listings'), limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });
};
