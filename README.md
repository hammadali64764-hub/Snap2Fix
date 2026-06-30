# Snap2Fix

Snap2Fix is a full-stack web application designed to simplify and digitalize complaint management for residential societies. The system connects residents, society administrators, service providers, and system administrators in one platform for reporting issues, assigning work, tracking progress, and managing resolutions efficiently.

## Project Overview

This project was developed as a modern solution for the common problems faced in residential societies, such as delayed complaint handling, poor communication, and lack of transparency. Snap2Fix provides a centralized system where users can:

- register and log in securely,
- submit complaints with images and descriptions,
- track the status of complaints,
- assign service providers through bidding or approval workflows,
- receive notifications,
- and submit feedback after resolution.

The platform also includes AI-based complaint type prediction for image-based submissions.

## Main Objectives

- Digitize the complaint handling process in societies.
- Improve communication between residents, society admins, and service providers.
- Provide a transparent workflow for complaint tracking and resolution.
- Reduce manual effort and response time.
- Support image-based complaint classification using AI.

## Key Features

- Resident registration and login
- Society registration and approval workflow
- Service provider registration and login
- OTP-based verification
- Complaint creation and tracking
- Household and society-level complaint management
- Provider bidding and assignment
- Proof of work upload and completion tracking
- Notifications and feedback system
- Password reset through email
- AI-based prediction for complaint type from uploaded images

## Technology Stack

### Frontend
- React
- Vite
- React Router DOM
- React Icons
- Firebase

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer for file uploads
- Nodemailer for email services
- Twilio for OTP-related services

### AI Integration
- Hugging Face / Gradio-based prediction model

## Project Structure

- BackEnd/ - Server-side application and API
  - controllers/ - request handling and business logic
  - models/ - MongoDB schemas
  - routes/ - API endpoints
  - middleware/ - authentication and upload handling
  - config/ - database configuration

- FrontEnd/ - Client-side React application
  - src/ - components, pages, and application logic
  - public/ - static assets

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- npm installed
- MongoDB connection available
- An email account for sending OTP and password reset emails

## Backend Setup

1. Open a terminal and navigate to the backend folder:

   ```bash
   cd BackEnd
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a .env file inside the BackEnd folder and add the required environment variables:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password_or_app_password
   ```

4. Start the backend server:

   ```bash
   npm run dev
   ```

The backend will run on http://localhost:5000 by default.

## Frontend Setup

1. Open a terminal and navigate to the frontend folder:

   ```bash
   cd FrontEnd
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run dev
   ```

The frontend will usually run on http://localhost:5173.

## Environment Variables

The backend requires the following variables in the BackEnd/.env file:

- PORT - server port number
- MONGO_URI - MongoDB connection string
- JWT_SECRET - secret key for authentication
- EMAIL_USER - email account used for sending emails
- EMAIL_PASS - email password or app-specific password

## API Overview

The backend provides REST APIs for:

- society management
- resident management
- provider management
- administrator management
- complaint handling
- bidding and assignments
- notifications
- feedback
- password reset
- AI-based complaint prediction

## Notes

- Keep the .env file private and do not commit it to GitHub.
- The backend currently uses a local development URL; if deployed elsewhere, update the frontend API configuration accordingly.
- Uploads for complaints and proofs are stored in the backend uploads folder.

## Conclusion

Snap2Fix is a practical and scalable solution for improving service quality and transparency in residential society maintenance and complaint management. It combines modern web technologies, role-based access, and AI support to provide a complete digital experience.
