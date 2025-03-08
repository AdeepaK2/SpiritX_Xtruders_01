import { NextRequest, NextResponse } from 'next/server';
import connect from '@/utils/db';
import User from '@/models/userSchema';
import bcrypt from 'bcryptjs';
import { validatePassword } from '@/app/api/validations/passwordValidator';

export async function POST(request: NextRequest) {
  try {
    // Get parameters from either query params or JSON body
    let username, password;
    
    // Try to get from URL query parameters
    const url = new URL(request.url);
    username = url.searchParams.get('username');
    password = url.searchParams.get('password');
    
    // If not found in query params, try to get from request body
    if (!username || !password) {
      try {
        const body = await request.json();
        username = username || body.username;
        password = password || body.password;
      } catch (e) {
        // If JSON parsing fails, that's ok - maybe data was only in query params
      }
    }

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Password does not meet security requirements', 
          details: passwordValidation.errors 
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connect();

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Hash the password with bcrypt before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    // Return success response
    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in testapi:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
