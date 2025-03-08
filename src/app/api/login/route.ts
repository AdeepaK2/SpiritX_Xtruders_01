import { NextResponse } from 'next/server';

// Mock database users - replace with real DB integration
const mockUsers = [
  { id: 1, email: "user@example.com", password: "Password123!" }
];

export async function POST(request: Request) {
  try {
    const { email, password, rememberMe } = await request.json();

    // Validate credentials
    const user = mockUsers.find(user => user.email === email);
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session (replace with real session management)
    const sessionId = crypto.randomUUID();
    
    // In a real app, you'd store this session in a database
    // await db.insertSession({
    //   sessionId,
    //   userId: user.id,
    //   createdAt: new Date(),
    //   expiresAt: rememberMe ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 24 * 60 * 60 * 1000)
    // });

    // Return success with session ID
    return NextResponse.json({ 
      success: true, 
      sessionId,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}