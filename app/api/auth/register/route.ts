import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Input validation schema
const registerSchema = z.object({
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
});

// JWT secret key (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * User Registration Service Layer
 * Handles business logic for user registration
 */
class RegistrationService {
  /**
   * Registers a new user with phone number and password
   * @param phone - User's phone number
   * @param password - User's password
   * @returns Promise with user data and token or error
   */
  static async registerUser(phone: string, password: string) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { phone }
      });

      if (existingUser) {
        return { success: false, error: 'Phone number already registered' };
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = await prisma.user.create({
        data: {
          phone,
          password: hashedPassword,
          name: `User ${phone.slice(-4)}`, // Default name using last 4 digits
          gamesPlayed: 0,
          vouchers: 0
        },
        select: {
          id: true,
          name: true,
          phone: true,
          gamesPlayed: true,
          vouchers: true,
          createdAt: true
        }
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: newUser.id, 
          phone: newUser.phone 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        success: true,
        data: {
          user: newUser,
          token
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }
}

/**
 * Registration API Route Handler
 * POST /api/auth/register
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    const validationResult = registerSchema.safeParse(body);
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

    // Register user
    const registrationResult = await RegistrationService.registerUser(phone, password);

    if (!registrationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: registrationResult.error
        },
        { status: 409 } // Conflict status for existing user
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        data: registrationResult.data
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}