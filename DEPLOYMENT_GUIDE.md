# Render.com Deployment Guide for E-Platform

## Overview

This guide will help you deploy your MERN stack e-commerce application to Render.com with both backend and frontend served from a single service.

## Prerequisites

-   [x] GitHub repository with your code
-   [x] Render.com account (free tier available)
-   [x] MongoDB Atlas account for database hosting

## Step 1: Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account:**

    - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
    - Sign up for a free account

2. **Create a Cluster:**

    - Choose "Build a Database" → "Shared" (Free tier)
    - Select your preferred cloud provider and region
    - Create cluster (takes 1-3 minutes)

3. **Create Database User:**

    - Go to "Database Access" → "Add New Database User"
    - Choose "Password" authentication
    - Create username and strong password
    - Grant "Read and write to any database" privileges

4. **Configure Network Access:**

    - Go to "Network Access" → "Add IP Address"
    - Click "Allow Access from Anywhere" (0.0.0.0/0)
    - This is required for Render deployment

5. **Get Connection String:**
    - Go to "Database" → "Connect" → "Connect your application"
    - Copy the connection string
    - Replace `<password>` with your database user password

## Step 2: Prepare Your Application

Your application is already configured correctly with:

-   ✅ Production static file serving
-   ✅ CORS configuration
-   ✅ Build script in package.json
-   ✅ Environment variable usage

## Step 3: Deploy to Render

### Option A: Deploy as Web Service (Recommended)

1. **Connect GitHub Repository:**

    - Go to [Render Dashboard](https://dashboard.render.com/)
    - Click "New" → "Web Service"
    - Connect your GitHub account
    - Select your repository

2. **Configure Web Service:**

    ```
    Name: e-platform-backend
    Environment: Node
    Region: Choose closest to your users
    Branch: main (or your default branch)
    Root Directory: . (leave empty)
    Build Command: npm run build
    Start Command: npm start
    ```

3. **Set Environment Variables:**
   In the "Environment" section, add:

    ```
    NODE_ENV=production
    PORT=5002
    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_super_secret_jwt_key_here
    PAYPAL_CLIENT_ID=your_paypal_client_id
    ```

4. **Deploy:**
    - Click "Create Web Service"
    - Render will automatically build and deploy your app
    - Wait for deployment to complete (5-10 minutes)

### Option B: Manual Deployment

1. **Install Render CLI:**

    ```bash
    npm install -g @render/cli
    ```

2. **Login to Render:**

    ```bash
    render login
    ```

3. **Deploy:**
    ```bash
    render deploy
    ```

## Step 4: Update Frontend Configuration

After deployment, update your frontend constants:

1. **Update frontend/src/constants.js:**

    ```javascript
    export const BASE_URL =
        process.env.NODE_ENV === "development"
            ? ""
            : "https://your-render-app-name.onrender.com";
    ```

2. **Update CORS in backend/server.js:**
    ```javascript
    app.use(
        cors({
            origin: [
                "http://localhost:3000", // for development
                "https://your-render-app-name.onrender.com", // for production
            ],
            credentials: true,
            allowedHeaders: ["Content-Type", "Authorization"],
        })
    );
    ```

## Step 5: Seed Database (Optional)

After successful deployment, seed your database:

1. **Add seed script to package.json:**

    ```json
    "scripts": {
      "data:import": "node backend/seed.js",
      "data:delete": "node backend/seed.js -d"
    }
    ```

2. **Run seed command locally:**
    ```bash
    # Make sure your .env has the production MONGO_URI
    npm run data:import
    ```

## Step 6: Custom Domain (Optional)

1. **In Render Dashboard:**
    - Go to your service → "Settings" → "Custom Domains"
    - Add your domain name
    - Configure DNS records as instructed

## Troubleshooting

### Common Issues:

1. **Build Fails:**

    - Check build logs in Render dashboard
    - Ensure all dependencies are in package.json
    - Verify Node.js version compatibility

2. **Database Connection Issues:**

    - Verify MONGO_URI is correct
    - Check MongoDB Atlas network access (0.0.0.0/0)
    - Ensure database user has proper permissions

3. **CORS Errors:**

    - Update CORS origin to match your Render URL
    - Ensure credentials: true is set

4. **Static Files Not Loading:**
    - Verify build script runs successfully
    - Check if frontend/build directory is created
    - Ensure static file serving code is correct

### Monitoring:

-   **Logs:** Check Render dashboard for real-time logs
-   **Metrics:** Monitor CPU, memory usage in dashboard
-   **Health Checks:** Render automatically monitors your app

## Performance Optimization

1. **Enable Compression:**

    ```javascript
    import compression from "compression";
    app.use(compression());
    ```

2. **Set Cache Headers:**

    ```javascript
    app.use(
        express.static(path.join(__dirname, "/frontend/build"), {
            maxAge: "1d",
        })
    );
    ```

3. **Database Indexing:**
    - Add indexes to frequently queried fields in MongoDB

## Security Checklist

-   [x] Environment variables are set (not hardcoded)
-   [x] JWT secret is strong and unique
-   [x] CORS is properly configured
-   [x] Database user has minimal required permissions
-   [x] HTTPS is enabled (automatic on Render)

## Cost Considerations

-   **Free Tier:** 750 hours/month, sleeps after 15 minutes of inactivity
-   **Paid Plans:** Start at $7/month for always-on services
-   **Database:** MongoDB Atlas free tier: 512MB storage

## Support Resources

-   [Render Documentation](https://render.com/docs)
-   [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
-   [Node.js Deployment Guide](https://render.com/docs/deploy-node-express-app)

---

## Quick Commands Reference

```bash
# Local development
npm run dev          # Start backend only
npm run client       # Start frontend only
npm run test         # Start both backend and frontend

# Production build
npm run build        # Build frontend for production
npm start           # Start production server

# Database operations
npm run data:import  # Seed database
npm run data:delete  # Clear database
```

Your application should now be successfully deployed on Render.com! 🚀
