import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Input validation schema
const loginSchema = z.object({
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters')
});

// JWT secret key (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Authentication Service Layer
 * Handles business logic for user authentication
 */
class AuthService {
  /**
   * Authenticates user with phone number and password
   * @param phone - User's phone number
   * @param password - User's password
   * @returns Promise with user data and token or null if authentication fails
   */
  static async authenticateUser(phone: string, password: string) {
    try {
      // Find user by phone number
      const user = await prisma.user.findUnique({
        where: { phone },
        select: {
          id: true,
          name: true,
          phone: true,
          password: true,
          gamesPlayed: true,
          vouchers: true,
          createdAt: true
        }
      });

      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          phone: user.phone 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        data: {
          user: userWithoutPassword,
          token
        }
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }
}

/**
 * Login API Route Handler
 * POST /api/auth/login
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { phone, password } = validationResult.data;

    // Authenticate user
    const authResult = await AuthService.authenticateUser(phone, password);

    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: authResult.error
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: authResult.data
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}