import prisma from '@/lib/prisma';
import { encryptCredentials } from '@/lib/encryption';
import { NextRequest, NextResponse } from 'next/server';

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
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }]
      }
    });

    if (existingUser) {
      const duplicateField = existingUser.email === email ? 'Email' : 'Username';
      return NextResponse.json(
        { success: false, error: `${duplicateField} already registered` },
        { status: 400 }
      );
    }

    // Encrypt password before storing
    const encryptedPassword = encryptCredentials(password) || password;

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: encryptedPassword,
      }
    });

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
