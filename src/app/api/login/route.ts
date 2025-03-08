import { NextResponse } from 'next/server';
import connect from '@/utils/db';
import User from '@/models/userSchema';
import Session from '@/models/sessionSchema';
import { validatePassword } from '@/app/api/validations/passwordValidator';
import bcrypt from 'bcryptjs';
const crypto = require('crypto');

export async function POST(request: Request) {
  try {
    const { username, password, rememberMe } = await request.json();

    // Connect to the database
    await connect();

    // Find the user
    const user = await User.findOne({ username });

    // If user doesn't exist, return error
    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }
    
    // Verify password using secure comparison
    // Assuming passwords are hashed in the database with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Generate a session ID
    const sessionId = crypto.randomUUID();
    
    // Set expiration time based on rememberMe
    const expiresAt = new Date();
    if (rememberMe) {
      // 30 days if remember me is checked
      expiresAt.setDate(expiresAt.getDate() + 30);
    } else {
      // 24 hours if remember me is not checked
      expiresAt.setDate(expiresAt.getDate() + 1);
    }

    // Store session in database
    await Session.create({
      sessionId,
      userId: user._id,
      expiresAt
    });

    return NextResponse.json({ 
      success: true, 
      sessionId,
      user: { id: user._id, username: user.username }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}