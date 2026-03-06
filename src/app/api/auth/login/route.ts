import { decryptCredentials } from '@/lib/encryption';
import { NextRequest, NextResponse } from 'next/server';

// Simulated in-memory database (will be replaced with MongoDB)
const users: Record<string, any> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing username or password' },
        { status: 400 }
      );
    }

    // Find user by username
    const user = users[username];

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Decrypt stored password and compare
    let storedPassword = user.password;
    try {
      const decrypted = decryptCredentials(user.password);
      storedPassword = decrypted;
    } catch (e) {
      // If decryption fails, use stored password as-is
      storedPassword = user.password;
    }

    if (storedPassword !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Success - return user info (without password)
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
