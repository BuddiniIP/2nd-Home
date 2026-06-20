declare module 'multer-storage-cloudinary' {
  import { StorageEngine } from 'multer';
  import { v2 as cloudinary } from 'cloudinary';

  interface CloudinaryStorageOptions {
    cloudinary: typeof cloudinary;
    params: {
      folder?: string;
      allowed_formats?: string[];
      public_id?: (req: any, file: Express.Multer.File) => string;
      transformation?: any[];
      [key: string]: any;
    };
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
    _handleFile(req: any, file: Express.Multer.File, callback: (error?: any, info?: any) => void): void;
    _removeFile(req: any, file: Express.Multer.File, callback: (error?: any) => void): void;
  }
}
