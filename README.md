A modern web application built with Next.js featuring user authentication, secure password handling, and responsive UI.

## Live Demo

View the live application at [https://spiritxxtruders01.vercel.app/](https://spiritxxtruders01.vercel.app/)

## Features

- 🔐 User Authentication (Sign up, Login, Logout)
- 🔒 Secure Password Handling with bcrypt
- 🚨 Form Validations
- 📱 Responsive Design
- 🎨 Modern UI with DaisyUI and TailwindCSS
- ✨ Animations with Framer Motion
- 🔔 Toast Notifications

## UI Adaptability

### 🌓 Theme Support
- Automatic light and dark mode detection based on user system preferences
- Carefully selected color palette optimized for both light and dark themes

### 📱 Responsive Design
- Fully responsive layouts from mobile phones to large desktop screens
- Mobile-first approach ensuring optimal experience on smaller devices
- Touch-friendly UI elements with appropriate sizing for mobile interaction

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
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
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

```/src``` - Main source directory
  - ```/app``` - Next.js App Router
    - ```/Login``` - Login page component
    - ```/Signup``` - Registration page component
    - ```/api``` - API routes
      - ```/auth/[...nextauth]``` - NextAuth.js configuration
      - ```/login``` - Traditional login endpoint
      - ```/register``` - User registration endpoint
      - ```/validations``` - Input validation utilities
    - ```layout.tsx``` - Root layout with providers
    - ```page.tsx``` - Home/Dashboard page
    - ```providers.tsx``` - NextAuth SessionProvider
  - ```/models``` - MongoDB schemas
    - ```sessionSchema.ts``` - Session management model
    - ```userSchema.ts``` - User account model
  - ```/utils```
    - ```db.ts``` - MongoDB connection utility

## Authentication Flow

The application implements a comprehensive authentication system with dual authentication methods:

### Traditional Authentication
1. **Registration**:
   - Form validation with real-time feedback on [Signup](src/app/Signup/page.tsx) page
   - Password strength requirements (length, special chars, case mixing)
   - User data stored in MongoDB with [bcrypt](https://www.npmjs.com/package/bcryptjs) password hashing
   - API endpoint at [/api/register](src/app/api/register/route.ts)

2. **Login**:
   - Credential validation on [Login](src/app/Login/page.tsx) page
   - Password verification using bcrypt
   - API endpoint at [/api/login](src/app/api/login/route.ts)
   - "Remember me" functionality for extended sessions

3. **Session Management**:
   - Sessions stored in MongoDB using [sessionSchema](src/models/sessionSchema.ts)
   - Session ID stored in localStorage or sessionStorage based on user preference
   - Secure session expiration handling

### OAuth Authentication
1. **Google Authentication**:
   - Integration with [NextAuth.js](https://next-auth.js.org/)
   - Google OAuth configured in [/api/auth/[...nextauth]](src/app/api/auth/[...nextauth]/route.ts)
   - Automatic user creation for first-time OAuth logins
   - Session synchronization with traditional auth system

### Security Features
- Cross-site request forgery protection
- Password strength validation via [passwordValidator](src/app/api/validations/passwordValidator.tsx)
- Secure password hashing
- Automatic login state detection and redirection

#### Dual-Layer Password Validation
- **Frontend Validation:**
  - Real-time password strength indicators
  - Immediate visual feedback on requirements (length, special chars, case mixing)
  - Prevents form submission until all requirements are met
  - Implemented using React state management in [Signup](src/app/Signup/page.tsx) component

- **Backend Validation:**
  - Server-side validation using [passwordValidator](src/app/api/validations/passwordValidator.tsx)
  - Ensures security even if frontend validation is bypassed
  - Consistent password policy enforcement across all registration methods
  - Returns specific error messages for failed validation criteria

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.