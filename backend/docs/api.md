# Backend API

This document covers the listing endpoints added for Developer B Task 1.

## Base URL

`http://localhost:5000`

## Authentication

Protected routes expect a valid JWT obtained from:

- `POST /api/auth/login`
- `POST /api/auth/register`

Send the token in the `Authorization` header:

```http
Authorization: Bearer <token>
```

## Listings

### `GET /api/boardings`
Public search endpoint with filtering, pagination, and sorting.

Query parameters:
- `page` - page number, default `1`
- `limit` - items per page, default `20`
- `sort` - example: `price`, `-createdAt`
- `q` - free text search over title and description
- `priceMin` - minimum price
- `priceMax` - maximum price
- `amenities` - comma-separated amenities, example: `wifi,parking`
- `lat`, `lng`, `radiusKm` - geo search radius in kilometers

Example:

```http
GET /api/boardings?page=1&limit=10&sort=-createdAt&q=quiet&priceMin=15000&amenities=wifi,parking
```

Sample response:

```json
{
  "data": [
    {
      "id": "6650d8f9e0f7d9a5a6b4c123",
      "title": "Single Room Near Campus",
      "description": "Clean room with study desk and Wi-Fi.",
      "price": 18000,
      "images": ["/uploads/listings/listing-1717000000000-123456789.jpg"],
      "location": {
        "address": "No. 12, Main Street, Colombo",
        "coordinates": { "lat": 6.9271, "lng": 79.8612 }
      },
      "owner": {
        "id": "664ff123e0f7d9a5a6b4c001",
        "name": "Nimal Perera",
        "email": "owner@example.com",
        "profilePicture": null
      },
      "amenities": ["wifi", "parking"],
      "capacity": 1,
      "isAvailable": true,
      "createdAt": "2026-05-30T00:00:00.000Z",
      "updatedAt": "2026-05-30T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### `GET /api/boardings/:id`
Returns a single boarding listing.

Example:

```http
GET /api/boardings/6650d8f9e0f7d9a5a6b4c123
```

### `POST /api/boardings`
Create a listing. Protected route.

Body example:

```json
{
  "title": "Single Room Near Campus",
  "description": "Clean room with study desk and Wi-Fi.",
  "price": 18000,
  "address": "No. 12, Main Street, Colombo",
  "coordinates": { "lat": 6.9271, "lng": 79.8612 },
  "images": ["/uploads/listings/listing-1717000000000-123456789.jpg"],
  "amenities": ["wifi", "parking"],
  "capacity": 1,
  "isAvailable": true
}
```

### `PUT /api/boardings/:id`
Update a listing. Protected route. Owner or admin only.

### `DELETE /api/boardings/:id`
Delete a listing. Protected route. Owner or admin only.

## Image Uploads

### `POST /api/boardings/upload-images`
Upload one or more listing images. Protected route.

Form-data fields:
- `images` - one or more image files

Example cURL:

```bash
curl -X POST http://localhost:5000/api/boardings/upload-images \
  -H "Authorization: Bearer <token>" \
  -F "images=@./room1.jpg" \
  -F "images=@./room2.jpg"
```

Sample response:

```json
{
  "message": "Images uploaded successfully",
  "images": [
    "/uploads/listings/listing-1717000000000-123456789.jpg",
    "/uploads/listings/listing-1717000000001-987654321.jpg"
  ]
}
```

## Static Image Access

Uploaded images are served from:

```http
GET /uploads/listings/<filename>
```

## Safe Index Sync

Run the maintenance script only when you explicitly allow it:

```bash
ALLOW_INDEX_SYNC=true npx tsx src/scripts/syncIndexes.ts
```

The script connects to MongoDB and runs `Listing.syncIndexes()`.
