# 2nd Home - Frontend Application

Welcome to the **2nd Home** frontend codebase! This project is a modern, responsive web application designed as a boarding finder platform. It connects university students with verified boarding facilities and allows property owners to list and manage their properties.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/) - Lightning-fast HMR and optimized builds
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Icons & Assets**: Custom SVG components (e.g., `Logo.jsx`) and FontAwesome (linked in HTML)

## ✨ Key Features

- **Role-based Authentication Structure**: Uses a custom `AuthContext` to manage mock user sessions (Student vs. Owner roles).
- **Responsive Layout**: Designed with a mobile-first philosophy using Tailwind utility classes.
- **Dedicated Dashboards**:
  - `StudentDashboard`: Allows students to view saved properties, inquiries, and recommendations.
  - `OwnerDashboard`: Enables property owners to manage their boarding listings and view student inquiries.
- **Advanced Search**: A search page to filter boarding facilities based on location, price, and amenities.
- **Mock Data Layer**: Designed to work standalone for frontend development using `src/data/mockData.js` until a backend API is integrated.

## 📁 Project Structure

```text
2nd-home-frontend/
├── public/                 # Static assets that don't need compilation
├── src/
│   ├── assets/             # Images, global SVGs, and fonts
│   ├── components/         # Reusable UI components (Navbar, Footer, Logo, etc.)
│   ├── context/            # React Contexts (AuthContext for auth state)
│   ├── data/               # Mock data arrays (mockData.js) for frontend testing
│   ├── layout/             # Layout wrapper components (e.g., MainLayout.jsx)
│   ├── pages/              # Top-level route components (Home, Search, Dashboards, etc.)
│   ├── App.jsx             # Main application component and routing configuration
│   ├── index.css           # Global Tailwind directives and CSS variables
│   └── main.jsx            # React root mount point
├── index.html              # Main HTML entry point
├── package.json            # Project metadata and dependencies
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite build configuration
```

## 🛠️ Getting Started

Follow these steps to set up the project locally for development.

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (comes with Node.js) or **yarn**

### Installation

1. **Clone the repository** (or download the source code):
   ```bash
   git clone <repository-url>
   cd 2nd-home-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Bundles the application for production into the `dist/` folder.
- `npm run lint`: Runs ESLint to check for code quality and matching standards.
- `npm run preview`: Bootstraps a local web server to serve the production build from `dist/` for testing.

## 🎨 Styling & Design Guidelines

- **Tailwind Config**: We rely heavily on `tailwindcss`. If you need to add custom colors or breakpoints, extend the theme in `tailwind.config.js`.
- **Global CSS**: Standard resets and custom base styles (like overriding anchor tags or default margins) are placed in `src/index.css`.
- **Brand Logo**: The official logo is a standalone, scalable React component (`src/components/Logo.jsx`). It takes a `textColor` prop to adapt to light and dark backgrounds (e.g., Navbar vs. Footer). Feel free to import it anywhere!

## 🔗 Mock Data Usage

To facilitate rapid frontend UI/UX development without relying on a full backend API, we use `src/data/mockData.js`. 
If you are building a new component that requires data fetching, import the mock data arrays directly:

```javascript
import { properties, users } from '../data/mockData';
```
*Note: Before shipping to production, these imports should be replaced with actual HTTP calls (using `fetch` or `axios`).*

---

Happy hacking! For any complex logic or major structural changes, please consult the team or open an issue before merging.
