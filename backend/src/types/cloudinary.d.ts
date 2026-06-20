declare module 'cloudinary' {
  export interface CloudinaryConfig {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  }
  export interface CloudinaryV2Instance {
    config: (options: CloudinaryConfig) => void;
    uploader: {
      upload: (file: string, options?: any) => Promise<any>;
      destroy: (publicId: string, options?: any) => Promise<any>;
    };
    api: any;
    url: (publicId: string, options?: any) => string;
    image: (publicId: string, options?: any) => string;
  }
  export const v2: CloudinaryV2Instance;
}
