# 2nd Home

A full-stack boarding and housing marketplace platform connecting students with verified accommodation owners. Features role-based dashboards for **Students**, **Owners**, **Verifiers**, and **Admins** with real-time chat, booking management, payment processing, and a property verification workflow.

## Features

### 👨‍🎓 Student
- Browse and search boarding listings with filters
- View boarding details with photos, amenities, and map location
- Send booking requests and manage bookings
- Chat with owners in real time
- Save favorite listings
- Rate and review properties

### 🏠 Owner
- Manage boarding listings (create, edit, delete) with image uploads
- Accept/reject booking requests
- Request property verification with availability scheduling
- View assigned verifier details (name, email, phone, photo)
- Track verification status with live countdown timers
- Dashboard with earnings, occupancy stats, and booking analytics

### ✅ Verifier
- Accept or reject verification assignments (15-minute response window)
- Conduct inspections by submitting checklist, photos, notes, and selfie
- Cancel accepted assignments (triggers red flag)
- View verification history including red-flagged items

### 🔧 Admin
- Full user management with role filtering
- Monitor and assign verifiers to pending verification requests
- View completed inspection reports with full details
- Unassign verifiers before they process a request
- Dashboard with analytics: user distribution, booking stats, revenue, and verification reports
- Export reports to Excel/CSV
- Notification panel with boarding reports and unread messages

## Tech Stack

| Layer      | Technology                                                              |
| ---------- | ----------------------------------------------------------------------- |
| Frontend   | React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, React Router v7 |
| Backend    | Express, TypeScript, Mongoose, Zod                                     |
| Database   | MongoDB                                                                 |
| Auth       | JWT (JSON Web Tokens) + bcrypt                                          |
| Payments   | Stripe                                                                  |
| Uploads    | Cloudinary                                                              |
| Email      | Nodemailer (SMTP or Ethereal test account in dev)                       |
| Icons      | Lucide React                                                            |

## Prerequisites

- **Node.js** v18 or later
- **MongoDB** instance (local or Atlas)
- **Stripe** account (for payment features)
- **Cloudinary** account (for image uploads)

## Setup

### 1. Clone & Install

```bash
git clone <repository-url>
cd 2nd-home
npm install
```

This installs dependencies for both `frontend/` and `backend/` via npm workspaces.

### 2. Environment Variables

#### Backend (`backend/.env`)

```ini
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=<random-hex-string>
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
STRIPE_SECRET_KEY=sk_test_...
# Optional — email for password reset
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your@email.com
# EMAIL_PASS=<app-password>
```

> `MONGODB_URI` and `JWT_SECRET` are **required** — the app crashes on startup if they are missing.

#### Frontend (`frontend/.env`)

```ini
VITE_API_BASE=http://localhost:5000
VITE_GOOGLE_MAPS_KEY=<your-google-maps-api-key>
```

> The frontend `.env` file is optional for basic functionality — only `VITE_API_BASE` is needed to point to the backend.

### 3. Run in Development

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start individually:
npm run dev:frontend   # Vite dev server on port 3000
npm run dev:backend    # Express with tsx watch on port 5000
```

### 4. Build for Production

```bash
npm run build
```

Compiles the backend TypeScript (`tsc`) and builds the frontend bundle (`vite build`) into `backend/dist/` and `frontend/dist/` respectively.

## Project Structure

```
2nd-home/
├── backend/
│   └── src/
│       ├── config/          # DB, Cloudinary, Stripe, mailer, env
│       ├── controllers/     # Route handlers (12 controllers)
│       ├── middleware/      # Auth, error, rate-limit, sanitize
│       ├── models/          # Mongoose schemas (10 models)
│       ├── routes/          # Express routers (12 route files)
│       ├── types/           # TypeScript declarations
│       ├── validation/      # Zod schemas
│       └── index.ts         # Express app entry point
├── frontend/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── layout/          # App layout wrapper
│       ├── lib/             # Utilities (image, helpers)
│       └── pages/           # Page components (16 routes)
├── package.json             # Workspace root
└── README.md
```

## Scripts

| Command               | Description                          |
| --------------------- | ------------------------------------ |
| `npm run dev`         | Start both frontend and backend dev  |
| `npm run dev:frontend`| Start Vite dev server on port 3000   |
| `npm run dev:backend` | Start Express with hot reload        |
| `npm run build`       | Build both packages for production   |
| `npm run lint`        | TypeScript type-checking (frontend)  |

## Roles

The application uses four user roles, each with a dedicated dashboard:

| Role      | Dashboard              | Capabilities                                  |
| --------- | ---------------------- | --------------------------------------------- |
| Student   | `/student-dashboard`   | Browse, book, chat, save listings, review     |
| Owner     | `/owner-dashboard`     | Manage listings, bookings, verification       |
| Verifier  | `/verifier-dashboard`  | Accept assignments, submit inspection reports |
| Admin     | `/admin-dashboard`     | Manage users, assign verifiers, view reports  |
