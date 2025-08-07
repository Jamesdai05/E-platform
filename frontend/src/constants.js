// export const BASE_URL='http://localhost:5000'
// The empty string for development assumes you are using a proxy in package.json
// For production, you need to provide the full backend URL.
export const BASE_URL = process.env.NODE_ENV === 'development' ? '' : 'https://e-platform-3.onrender.com';
export const PRODUCTS_URL='/api/products';
export const USERS_URL='/api/users';
export const ORDERS_URL='/api/orders';
export const PAYPAL_URL='/api/config/paypal';
export const UPLOAD_URL='/api/upload';