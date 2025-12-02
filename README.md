# Tripnowa - World Travel Discovery Website

A full-stack travel discovery website built with Next.js 14, TypeScript, Tailwind CSS, MongoDB, JWT authentication, and bcrypt.

## 🌟 Features

- **Home Page**: Search functionality, categories, featured destinations, world wonders, and romantic places
- **Place Details**: Comprehensive information about each destination including images, maps, budget, safety tips
- **Categories**: Explore places by categories (World Wonders, Romance, Adventure, Beaches, Mountains, Cities, Nature, Historical, Budget Travel, Luxury Travel, Indian Places)
- **Authentication**: User signup, login, and profile management with JWT and bcrypt
- **Admin Panel**: Full CRUD operations for managing places (protected routes)
- **Search & Filters**: Search places by name, country, or category
- **Dark Mode UI**: Beautiful, modern dark theme (#0f0f0f)
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, React Icons
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens) with httpOnly cookies
- **Security**: bcrypt for password hashing
- **Database**: MongoDB Atlas (cloud) or local MongoDB

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB installation)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd Tripnowa
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Open `.env.local` and fill in your values:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A strong random string (generate with `openssl rand -base64 32`)

4. **Seed the database** (optional but recommended):
   ```bash
   npm run seed
   ```
   
   Or manually:
   ```bash
   npx ts-node scripts/seed.ts
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to `.env.local`

### Local MongoDB

1. Install MongoDB locally
2. Update `MONGODB_URI` in `.env.local` to:
   ```
   mongodb://localhost:27017/tripnowa
   ```

## 🌐 Deployment

### Frontend → Vercel

1. **Push your code to GitHub**

2. **Deploy to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `NODE_ENV=production`
   - Deploy!

### Database → MongoDB Atlas

- Already cloud-based, no additional deployment needed
- Ensure your Vercel deployment IP is whitelisted in MongoDB Atlas

## 📝 Default Admin Account

After seeding the database, you can log in with:

- **Email**: `admin@tripnowa.com`
- **Password**: `admin123`

**⚠️ Important**: Change the admin password after first login in production!

## 🔐 API Routes

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Places
- `GET /api/places` - Get all places (with optional query params: search, category, country, limit, page)
- `GET /api/places/[id]` - Get single place by ID

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/[slug]` - Get single category by slug

### Admin (Protected)
- `POST /api/admin/places` - Create new place
- `PUT /api/admin/places/[id]` - Update place
- `DELETE /api/admin/places/[id]` - Delete place

## 📁 Project Structure

```
Tripnowa/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── categories/        # Category pages
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── profile/           # User profile
│   ├── places/            # Place listing and details
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions
│   ├── mongodb.ts         # Database connection
│   ├── jwt.ts             # JWT utilities
│   └── auth.ts            # Auth utilities
├── models/                # Mongoose models
│   ├── User.ts
│   ├── Place.ts
│   └── Category.ts
├── scripts/               # Scripts
│   └── seed.ts            # Database seeding script
├── middleware.ts          # Next.js middleware
└── package.json
```

## 🎨 UI Features

- Dark mode theme (#0f0f0f background)
- Smooth animations and transitions
- Gradient buttons (blue to purple)
- Responsive grid layouts
- Beautiful card designs with hover effects
- Image galleries
- Google Maps integration
- External hotel booking links

## 📊 Data Included

The seed script includes:
- 100+ world travel destinations
- All 7 New World Wonders
- Romantic destinations (Paris, Santorini, Venice, etc.)
- Indian tourist places
- Beaches, mountains, cities, and more
- Comprehensive information for each place:
  - Descriptions
  - Best time to visit
  - Things to do
  - Budget estimates
  - Safety information
  - Travel tips
  - Images
  - Map links

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed the database (add this to package.json)

## 🔒 Security Features

- JWT tokens stored in httpOnly cookies
- Password hashing with bcrypt
- Protected admin routes
- Input validation
- Secure MongoDB connection

## 📱 Responsive Design

The website is fully responsive and works on:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1280px+)

## 🤝 Contributing

This is a complete production-ready project. Feel free to customize and extend it according to your needs.

## 📄 License

This project is open source and available for personal and commercial use.

## 🆘 Support

If you encounter any issues:
1. Check that MongoDB connection string is correct
2. Verify all environment variables are set
3. Ensure Node.js version is 18+
4. Check browser console for errors
5. Review server logs

## 🎯 Next Steps

1. Set up your MongoDB Atlas account
2. Configure environment variables
3. Run the seed script to populate data
4. Start the development server
5. Create your first admin account
6. Start adding and managing travel destinations!

Enjoy building your travel discovery platform! ✈️🌍

# Tripnowa
