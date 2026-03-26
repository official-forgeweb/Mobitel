# Mobitel - Premium Mobile Repair Booking Platform

An advanced, full-stack web application designed to streamline the mobile repair industry. Mobitel provides a seamless booking experience for customers alongside a powerful, highly-optimized Admin Dashboard for store operators to manage repairs, technicians, dynamic pricing, and online payments.

## 🚀 Key Features

### 🧑‍💻 Customer Experience
* **Dynamic Booking Flow**: Customers can easily select their phone's Brand, Model, and strictly required Repair Service.
* **Instant Price Estimates**: Real-time component pricing calculated directly from the backend inventory.
* **Flexible Payments**: Integrated with **Razorpay**. Customers can choose to Pay Full Online, Pay Advance Online, or Pay at Store.
* **Order Tracking**: Every booking generates a unique Tracking Token (e.g., `MOB-2026-A1B2`) simulating live status updates from 'Received' up to 'Ready for Pickup'.
* **Shop vs Home Visit**: Support for both Walk-in (Shop) and Doorstep (Home Visit) service modalities with dynamically localized shop branches.

### 🛡️ Admin & Technician Workflows
* **Admin Dashboard**: Comprehensive CRM to manage Brands, Models, Workers/Partners, Bookings, and Store Locations.
* **Toggle Controls**: Effortlessly switch on/off availability for Brands, Models, and specific repair Services instantly via the dashboard.
* **CMS Manager**: Edit platform content natively without touching the codebase.
* **Technician Portal**: Dedicated views for assigned partners/workers to update status, upload repair photos, and complete jobs dynamically.
* **Analytics & Reporting**: Built-in payment charting, financial statistics, refund processing capabilities, and pending payment tracking.

### ⚡ Performance & Security Highlights
* **Automated API Caching**: Heavy-read public endpoints (Brands, Models, Pricing, Services) are memory-cached via a custom Node.js middleware for blazing-fast 2ms retrieval responses instead of stressing the database.
* **Mongoose Optimization**: N+1 queries and expensive hydration overhead completely eliminated out of bulk booking lookups utilizing strict `.lean()` implementations.
* **Payment Security / Spoofing Protection**: End-to-end Razorpay protection. Transaction amounts are strictly validated against authoritative database `Pricing` schemas prior to token checkout, making front-end spoofing impossible.

---

## 🛠️ Technology Stack

**Frontend**
* [Next.js](https://nextjs.org/) (React App Router)
* TailwindCSS (Advanced UI styling)
* standard `fetch` protocol

**Backend**
* Node.js & Express.js
* MongoDB & Mongoose (Schema validation & indexing)
* Razorpay SDK (Payments & Webhooks)
* Custom Memory Caching Interceptors
* JWT (JSON Web Tokens) for Admin Authentication

---

## 🏗️ Getting Started

### 1. Prerequisites
* Node.js v16+ (or equivalent)
* A running MongoDB instance (Local or Atlas)
* A Razorpay Developer Account

### 2. Environment Setup

**Backend (`/backend/.env`)**
```env
PORT=5001
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mobitel
JWT_SECRET=your_super_secret_jwt_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=https://www.mobitel.in,http://localhost:3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

**Frontend (`/frontend/.env.local`)**
```env
NEXT_PUBLIC_API_URL=https://www.mobitel.in
```

### 3. Running the Platform Locally

1. **Start the Backend Server**
```bash
cd backend
npm install
npm run dev
```
*(The backend runs mapped over Port 5001)*

2. **Start the Frontend Client**
```bash
cd frontend
npm install
npm run dev
```
*(The frontend runs mapped over Port 3000)*

---

## 📡 API Structure
* `/api/razorpay/create-order` — Payment initiation and security validation
* `/api/razorpay/verify-payment` — Signature validation and booking timeline tracking
* `/api/brands`, `/api/device-models`, `/api/services` — Cached metadata endpoints
* `/api/admin/*` — Protected management suite endpoints

> **Note**: This repository natively points to `https://www.mobitel.in`. If routing for absolute local testing without hosts manipulation, change `NEXT_PUBLIC_API_URL` values back to `http://localhost:5001`.
