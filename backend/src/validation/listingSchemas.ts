import { z } from 'zod';

export const coordinatesSchema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
});

export const createListingSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().nonnegative(),
  address: z.string().min(3),
  coordinates: coordinatesSchema,
  images: z.array(z.string().min(1)).optional().default([]),
  amenities: z.array(z.string()).optional().default([]),
  capacity: z.coerce.number().min(1).optional().default(1),
  isAvailable: z.boolean().optional().default(true),
});

export const updateListingSchema = createListingSchema.partial();

export const queryListingSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sort: z.string().optional(),
  q: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  amenities: z.preprocess((val) => {
    if (!val) return undefined;
    if (Array.isArray(val)) return val;
    return String(val).split(',').map((s) => s.trim()).filter(Boolean);
  }, z.array(z.string()).optional()),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radiusKm: z.coerce.number().optional(),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type QueryListingInput = z.infer<typeof queryListingSchema>;
