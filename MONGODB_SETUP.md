# MongoDB Setup Guide

This guide will help you set up MongoDB for the Tatkal Ticket Booking app.

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Sign Up** or **Sign In**
3. Create a free account (M0 tier is perfect for this app)

## Step 2: Create a Cluster

1. Click **Create** a new project
2. Name it `tatkal-booking`
3. Click **Create Project**
4. Click **Build a Database**
5. Choose **M0 (Free)** cluster tier
6. Select your preferred region (closest to you)
7. Click **Create Cluster** (takes 2-3 minutes)

## Step 3: Create Database Credentials

1. In left sidebar, click **Database Access** → **Add New Database User**
2. Choose **Password** authentication
3. Username: `tatkal_user`
4. Password: Generate a secure password (save it!)
5. Database User Privileges: **Read and write to any database**
6. Click **Add User**

## Step 4: Get Connection String

1. Click **Databases** in left sidebar
2. Click **Connect** on your cluster
3. Choose **Drivers** → **Node.js** → **Latest version**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://tatkal_user:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with the password you created

## Step 5: Configure Environment Variables

1. Open `.env.local` in your project
2. Update the `DATABASE_URL`:
   ```env
   DATABASE_URL=mongodb+srv://tatkal_user:YOUR_PASSWORD@cluster.mongodb.net/tatkal-booking?retryWrites=true&w=majority
   ```
3. Replace:
   - `YOUR_PASSWORD` with your database user password
   - `cluster` with your actual cluster name

## Step 6: Initialize Database Schema

Run the following command to create the database schema:

```bash
npm run db:push
```

This will:
- Create the `users` collection for storing user credentials
- Create the `bookings` collection for storing booking history
- Set up indexes for faster queries

## Step 7: Verify Setup

```bash
# Start dev server
npm run dev
```

Then:
1. Go to http://localhost:3000
2. Click **Create New Account**
3. Create a test account:
   - Username: `testuser123`
   - Email: `test@example.com`
   - Password: `password123`
4. Verify MongoDB Atlas shows the new user

To check MongoDB data:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Databases** → **Browse Collections**
3. Expand `tatkal-booking` → `users`
4. You should see your newly registered user

## Troubleshooting

### Connection Error: "getaddrinfo ENOTFOUND"
- Check your `DATABASE_URL` is correct
- Whitelist your IP in MongoDB Atlas → Network Access → Add IP Address
- Click **Add Current IP Address**

### "User not found" after registration
- Check that `npm run db:push` was executed successfully
- Verify MongoDB Atlas database has `users` collection created
- Check network tab in browser for API errors

### "Invalid MongoDB connection string"
- Ensure you copied the full connection string from Atlas
- Include `?retryWrites=true&w=majority` at the end
- Replace `<password>` placeholder with actual password

### Build Error: "Cannot find module 'prisma'"
Run:
```bash
npm install
npm run db:generate
```

## Features Enabled by MongoDB

✅ **Persistent User Accounts**
- Users registered persist across server restarts
- No data loss

✅ **Secure Password Storage**
- Passwords encrypted before storing
- Each user's password handled securely

✅ **Booking History**
- All bookings stored in MongoDB
- Track booking status and PNR

✅ **Multi-Device Support**
- Users can login from any device
- Account data synced across devices

## Next Steps

1. Test the app with real accounts
2. Configure IRCTC API integration
3. Deploy to production (see DEPLOYMENT.md)

## Database Structure

### Users Collection
```javascript
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "testuser123",
  "email": "test@example.com",
  "password": "encrypted_string...",
  "createdAt": "2026-03-06T...",
  "updatedAt": "2026-03-06T..."
}
```

### Bookings Collection
```javascript
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "trainNumber": "12951",
  "fromStation": "NDLS",
  "toStation": "BCT",
  "journeyDate": "2026-03-20",
  "passengers": [...],
  "status": "pending",
  "pnr": null,
  "createdAt": "2026-03-06T...",
  "updatedAt": "2026-03-06T..."
}
```

---

**MongoDB is now ready! Your app will securely store user data.** 🎉
