# Separate Frontend & Backend Deployment Guide for Render.com

## Overview
This guide shows how to deploy your MERN stack e-commerce application as two separate services on Render:
1. **Backend API** - Web Service (Node.js/Express)
2. **Frontend** - Static Site (React build)

This approach provides better separation, independent scaling, and can be more cost-effective.

## Prerequisites
- GitHub repository with your code
- Render.com account
- MongoDB Atlas account

---

## Part 1: Backend API Deployment (Web Service)

### Step 1: Prepare Backend for API-Only Mode

First, we need to modify the backend to serve only API endpoints (no static files):

#### Update backend/server.js:
```javascript
// Remove the static file serving code and replace with API-only configuration
if(process.env.NODE_ENV === "production"){
  app.get("/", (req, res) => {
    res.json({
      message: "E-Platform API is running in production mode",
      version: "1.0.0",
      endpoints: {
        products: "/api/products",
        users: "/api/users",
        orders: "/api/orders",
        upload: "/api/upload",
        paypal: "/api/config/paypal"
      }
    });
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running in development mode...");
  });
}
```

#### Update CORS Configuration:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [
        process.env.FRONTEND_URL || "https://your-frontend-app.onrender.com",
        "https://ecommerce-frontend-nufw.onrender.com" // your existing frontend
      ]
    : "http://localhost:3000",
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Step 2: Create Backend Package.json (if needed)

Create `backend/package.json` for backend-only deployment:

```json
{
  "name": "ecommerce-backend",
  "version": "1.0.0",
  "description": "E-commerce platform backend API",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "data:import": "node seed.js",
    "data:delete": "node seed.js -d"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.12.0",
    "multer": "^1.4.5-lts.1",
    "stripe": "^18.4.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```

### Step 3: Deploy Backend to Render

1. **Create Web Service:**
   - Go to Render Dashboard → "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     ```
     Name: ecommerce-backend-api
     Environment: Node
     Region: Choose your preferred region
     Branch: main
     Root Directory: backend
     Build Command: npm install
     Start Command: npm start
     ```

2. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   PAYPAL_CLIENT_ID=your_paypal_client_id
   FRONTEND_URL=https://your-frontend-app.onrender.com
   ```

3. **Deploy:**
   - Click "Create Web Service"
   - Note the backend URL (e.g., `https://ecommerce-backend-api.onrender.com`)

---

## Part 2: Frontend Static Site Deployment

### Step 1: Update Frontend Configuration

#### Update frontend/src/constants.js:
```javascript
// Use environment variable or fallback to your backend URL
export const BASE_URL = process.env.NODE_ENV === 'development'
  ? ''
  : process.env.REACT_APP_API_URL || 'https://ecommerce-backend-api.onrender.com';

export const PRODUCTS_URL='/api/products';
export const USERS_URL='/api/users';
export const ORDERS_URL='/api/orders';
export const PAYPAL_URL='/api/config/paypal';
export const UPLOAD_URL='/api/upload';
```

#### Remove proxy from frontend/package.json:
```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  // Remove this line: "proxy": "http://localhost:5000",
  "dependencies": {
    // ... your dependencies
  }
}
```

#### Add build optimization to frontend/package.json:
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build && echo 'Build completed successfully'",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### Step 2: Create _redirects file for React Router

Create `frontend/public/_redirects`:
```
/*    /index.html   200
```

This ensures all routes are handled by React Router.

### Step 3: Deploy Frontend to Render

1. **Create Static Site:**
   - Go to Render Dashboard → "New" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     ```
     Name: ecommerce-frontend
     Branch: main
     Root Directory: frontend
     Build Command: npm install && npm run build
     Publish Directory: build
     ```

2. **Set Environment Variables:**
   ```
   NODE_ENV=production
   REACT_APP_API_URL=https://ecommerce-backend-api.onrender.com
   GENERATE_SOURCEMAP=false
   ```

3. **Deploy:**
   - Click "Create Static Site"
   - Note the frontend URL (e.g., `https://ecommerce-frontend.onrender.com`)

---

## Part 3: Update Cross-Service Configuration

### Step 1: Update Backend CORS

Update your backend's CORS configuration with the new frontend URL:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [
        "https://ecommerce-frontend.onrender.com", // Your new frontend URL
        process.env.FRONTEND_URL
      ]
    : "http://localhost:3000",
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Step 2: Update Frontend Environment Variables

In Render dashboard for your frontend static site, update:
```
REACT_APP_API_URL=https://ecommerce-backend-api.onrender.com
```

---

## Part 4: Testing & Verification

### Test Backend API:
```bash
# Test API endpoints
curl https://ecommerce-backend-api.onrender.com/
curl https://ecommerce-backend-api.onrender.com/api/products
```

### Test Frontend:
- Visit your frontend URL
- Check browser console for any CORS errors
- Test login/registration functionality
- Verify API calls are working

---

## Benefits of Separate Deployment

### Advantages:
- **Independent Scaling:** Scale frontend and backend separately
- **Cost Optimization:** Static sites are cheaper than web services
- **Better Performance:** CDN distribution for static assets
- **Easier Maintenance:** Deploy frontend/backend independently
- **Development Flexibility:** Different teams can work on different services

### Considerations:
- **CORS Configuration:** Must be properly configured
- **Environment Variables:** Need to manage across services
- **API URLs:** Must be correctly configured in frontend

---

## Cost Comparison

### Single Service (Previous):
- 1 Web Service: $7/month (or free with limitations)

### Separate Services:
- Backend Web Service: $7/month (or free with limitations)
- Frontend Static Site: $1/month (or free for personal projects)

---

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Verify backend CORS includes frontend URL
   - Check credentials: true is set
   - Ensure both services use HTTPS

2. **API Not Found:**
   - Verify REACT_APP_API_URL is set correctly
   - Check BASE_URL in constants.js
   - Ensure backend is deployed and running

3. **Build Failures:**
   - Check build logs in Render dashboard
   - Verify all dependencies are listed
   - Ensure build command is correct

4. **Routing Issues:**
   - Verify _redirects file exists
   - Check React Router configuration
   - Ensure all routes return index.html

### Monitoring:
- Check logs in Render dashboard for both services
- Monitor API response times
- Use browser dev tools to debug frontend issues

---

## Development Workflow

### Local Development:
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

### Production Deployment:
1. Push changes to GitHub
2. Render automatically deploys both services
3. Test functionality on production URLs

---

Your e-commerce platform is now deployed as separate, scalable services! 🚀

## Quick Reference URLs:
- Backend API: `https://ecommerce-backend-api.onrender.com`
- Frontend App: `https://ecommerce-frontend.onrender.com`
- MongoDB: Your Atlas cluster URL
