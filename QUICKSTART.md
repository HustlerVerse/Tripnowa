# Tripnowa - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

**Get MongoDB URI:**
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Click "Connect" → "Connect your application"
- Copy the connection string
- Replace `<password>` with your database password
- Replace `myFirstDatabase` with `tripnowa`

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

### 3. Seed the Database (Optional)
```bash
npm run seed
```

This will create:
- 10+ initial travel places
- All categories
- Admin user (email: `admin@tripnowa.com`, password: `admin123`)

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Your Browser
Navigate to: http://localhost:3000

## 📝 Adding More Places

The seed script includes 10+ sample places. To add 100+ places:

1. **Via Admin Panel** (Recommended):
   - Login as admin
   - Go to `/admin`
   - Click "Add New Place"
   - Fill in all details and submit

2. **Via Seed Script**:
   - Edit `scripts/seed.ts`
   - Add more place objects to the `placesData` array
   - Run `npm run seed` again

3. **Bulk Import**:
   - Use MongoDB Compass or Atlas to import JSON data
   - Or create a custom script for bulk imports

## 🎯 Default Accounts

After seeding:
- **Admin**: `admin@tripnowa.com` / `admin123`
- **Regular User**: Sign up at `/signup`

## 🔧 Common Issues

**MongoDB Connection Failed:**
- Check your connection string
- Ensure IP is whitelisted in MongoDB Atlas
- Verify network connection

**JWT Errors:**
- Make sure JWT_SECRET is set in `.env.local`
- Clear browser cookies and try again

**Build Errors:**
- Delete `.next` folder
- Run `npm install` again
- Run `npm run dev`

## 📚 Next Steps

1. Add more travel destinations via admin panel
2. Customize categories and styling
3. Deploy to Vercel (see README.md)
4. Add more features as needed

Enjoy building your travel platform! ✈️

