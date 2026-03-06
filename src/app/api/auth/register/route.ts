import { encryptCredentials } from '@/lib/encryption';
import { NextRequest, NextResponse } from 'next/server';

// Simulated in-memory database (will be replaced with MongoDB)
const users: Record<string, any> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const userExists = Object.values(users).some(
      (u: any) => u.username === username || u.email === email
    );

    if (userExists) {
      const duplicateUser = users[username];
      const duplicateField = duplicateUser?.email === email ? 'Email' : 'Username';
      return NextResponse.json(
        { success: false, error: `${duplicateField} already registered` },
        { status: 400 }
      );
    }

    // Encrypt password before storing
    const encryptedPassword = encryptCredentials(password) || password;

    // Create new user (will be persisted to MongoDB when configured)
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: encryptedPassword,
      createdAt: new Date().toISOString(),
    };

    users[username] = newUser;

    // TODO: Save to MongoDB when configured
    // const user = await prisma.user.create({...})

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          createdAt: newUser.createdAt,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
