import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connect from "@/utils/db";
import User from "@/models/userSchema";
import Session from "@/models/sessionSchema";
import { randomUUID } from "crypto";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    sessionId?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
    }
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await connect();
          
          // Check if user exists in database
          const existingUser = await User.findOne({ 
            username: user.email 
          });
          
          if (!existingUser) {
            // Create new user if they don't exist
            const newUser = new User({
              username: user.email,
              password: randomUUID(), // Generate random secure password as they login with Google
              fullName: user.name,
              profilePicture: user.image,
              googleId: profile?.sub,
            });
            await newUser.save();
          }
          
          return true;
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          userId: user.id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Create a custom session for compatibility with existing auth system
      if (session.user) {
        try {
          await connect();
          
          const sessionId = randomUUID();
          
          // Set expiration time (30 days)
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 30);
          
          // Find user ID
          const user = await User.findOne({ username: session.user.email });
          
          if (user) {
            // Store session in database for compatibility with existing system
            await Session.create({
              sessionId,
              userId: user._id,
              expiresAt
            });
            
            // Add sessionId to the session object
            session.sessionId = sessionId;
            session.user.id = user._id.toString();
          }
        } catch (error) {
          console.error("Session callback error:", error);
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/Login',
    error: '/Login',
  }
});

export { handler as GET, handler as POST };