import { v2 as cloudinary } from 'cloudinary';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured = !!(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
}

const cloudinaryStorage = (folder: string): StorageEngine => ({
  _handleFile: (req, file, cb) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err) { cb(err); return; }
        cb(null, {
          path: result?.secure_url || result?.url,
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
  const limits = { fileSize: 5 * 1024 * 1024 };

  if (isCloudinaryConfigured) {
    return multer({ storage: cloudinaryStorage('2nd-home/profiles'), limits, fileFilter });
  }

  const currentDir = path.dirname(new URL(import.meta.url).pathname);
  const dir = path.resolve(currentDir, '../../uploads/profiles');
  fs.mkdirSync(dir, { recursive: true });
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      cb(null, `${Date.now()}-${safe}`);
    },
  });
  return multer({ storage, limits, fileFilter });
};

export const getListingUpload = () => {
  const limits = { fileSize: 10 * 1024 * 1024 };

  if (isCloudinaryConfigured) {
    return multer({ storage: cloudinaryStorage('2nd-home/listings'), limits, fileFilter });
  }

  const currentDir = path.dirname(new URL(import.meta.url).pathname);
  const dir = path.resolve(currentDir, '../../uploads/listings');
  fs.mkdirSync(dir, { recursive: true });
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      cb(null, `listing-${Date.now()}-${safe}`);
    },
  });
  return multer({ storage, limits, fileFilter });
};
