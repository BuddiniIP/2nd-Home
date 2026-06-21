declare module 'cloudinary' {
  export interface CloudinaryConfig {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  }

  export interface UploadApiResponse {
    public_id: string;
    url: string;
    secure_url: string;
    bytes: number;
    format: string;
    [key: string]: any;
  }

  export interface UploadApiOptions {
    folder?: string;
    resource_type?: string;
    allowed_formats?: string[];
    public_id?: string;
    transformation?: any[];
    [key: string]: any;
  }

  export interface CloudinaryUploader {
    upload: (file: string, options?: UploadApiOptions) => Promise<UploadApiResponse>;
    upload_stream: (
      options: UploadApiOptions,
      callback: (err: any, result?: UploadApiResponse) => void
    ) => NodeJS.ReadWriteStream;
    destroy: (publicId: string, optionsOrCallback?: any, callback?: (err: any, result?: any) => void) => Promise<any>;
  }

  export interface CloudinaryApi {
    ping: (callback?: (err: any, result: any) => void) => Promise<any>;
  }

  export interface CloudinaryV2Instance {
    config: (options?: CloudinaryConfig) => { cloud_name: string; api_key: string; api_secret: string } | void;
    uploader: CloudinaryUploader;
    api: CloudinaryApi;
    url: (publicId: string, options?: any) => string;
    image: (publicId: string, options?: any) => string;
  }

  export const v2: CloudinaryV2Instance;
}
