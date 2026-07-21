# SK Korean Technologies - Full Stack Application

This project has been upgraded to a full-stack MERN application (MongoDB, Express, React, Node.js).

## Project Structure
- `/src` - React Frontend (Vite)
- `/backend` - Node.js & Express Backend

## Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

## Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Open `backend/.env` and ensure `MONGO_URI` is pointing to your MongoDB instance, and configure Cloudinary credentials if used.
4. Seed Admin User:
   ```bash
   npm run seed
   ```
   (This creates an admin user: `admin@skkorean.com` / `password123`)
5. Start the server:
   ```bash
   npm run dev
   ```

## Frontend Setup
1. Navigate to the root directory (if not already there).
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Admin Portal
- Access the Admin Dashboard via `/admin/login`
- Use the credentials seeded in the database.
- Manage products and gallery dynamically.

## Features Added
- Full REST API with Express and MongoDB.
- JWT Authentication for Admin routes.
- Image uploads support (Multer + local storage / Cloudinary fallback).
- Dynamic Frontend fetching using Axios.
- Admin Panel with Dashboard, Products CRUD, and Gallery CRUD components.
