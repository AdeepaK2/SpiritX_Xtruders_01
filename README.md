Collecting workspace information# SpiritX Xtruders 01

A modern web application built with Next.js featuring user authentication, secure password handling, and responsive UI.

## Features

- 🔐 User Authentication (Sign up, Login, Logout)
- 🔒 Secure Password Handling with bcrypt
- 🚨 Form Validations
- 📱 Responsive Design
- 🎨 Modern UI with DaisyUI and TailwindCSS
- ✨ Animations with Framer Motion
- 🔔 Toast Notifications

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [TailwindCSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- [DaisyUI](https://daisyui.com/) - Tailwind CSS component library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [React Hot Toast](https://react-hot-toast.com/) - Toast notifications
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Password hashing
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

## Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB instance or MongoDB Atlas account

### Environment Setup

Create a .env file in the root of your project with the following variables:

```
MONGO_DB_URI=your_mongodb_connection_string
```

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Development mode with Turbopack (Fast Refresh)
npm run dev

# Production build
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- app - Next.js application routes
- api - API endpoints
- validations - Validation utilities
- models - MongoDB data models
- utils - Utility functions

## Authentication Flow

The application implements a complete authentication system:

1. User registration via /api/register
2. Login via /api/login
3. Session management with MongoDB
4. Password validation with passwordValidator

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Similar code found with 2 license types