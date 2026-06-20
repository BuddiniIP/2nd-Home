import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured = !!(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
}

export const getProfileUpload = () => {
  const limits = { fileSize: 5 * 1024 * 1024 };

  if (isCloudinaryConfigured) {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: { folder: '2nd-home/profiles', allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'] } as any,
    });
    return multer({ storage, limits });
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
  return multer({ storage, limits, fileFilter: (_req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype)) {
      cb(new Error('Only JPG, PNG, GIF, and WebP images are allowed'));
      return;
    }
    cb(null, true);
  }});
};

export const getListingUpload = () => {
  const limits = { fileSize: 10 * 1024 * 1024 };

  if (isCloudinaryConfigured) {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: { folder: '2nd-home/listings', allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'] } as any,
    });
    return multer({ storage, limits });
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
  return multer({ storage, limits, fileFilter: (_req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype)) {
      cb(new Error('Only JPG, PNG, GIF, and WebP images are allowed'));
      return;
    }
    cb(null, true);
  }});
};
