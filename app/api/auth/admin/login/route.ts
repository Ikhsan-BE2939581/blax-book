import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Input validation schema
const adminLoginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters')
});

// JWT secret key (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Mock admin users (in production, use database)
const mockAdmins = [
  {
    id: 'admin-1',
    email: 'admin@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // admin123
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date('2024-01-01')
  }
];

/**
 * Admin Authentication Service Layer
 * Handles business logic for admin authentication
 */
class AdminAuthService {
  /**
   * Authenticates admin user with email and password
   * @param email - Admin's email
   * @param password - Admin's password
   * @returns Promise with admin data and token or error
   */
  static async authenticateAdmin(email: string, password: string) {
    try {
      // Find admin by email
      const admin = mockAdmins.find(a => a.email === email);

      if (!admin) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: admin.id, 
          email: admin.email,
          role: admin.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remove password from response
      const { password: _, ...adminWithoutPassword } = admin;

      return {
        success: true,
        data: {
          user: adminWithoutPassword,
          token
        }
      };
    } catch (error) {
      console.error('Admin authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }
}

/**
 * Admin Login API Route Handler
 * POST /api/auth/admin/login
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    const validationResult = adminLoginSchema.safeParse(body);
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

    const { email, password } = validationResult.data;

    // Authenticate admin
    const authResult = await AdminAuthService.authenticateAdmin(email, password);

    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: authResult.error
        },
        { status: 401 }
      );
    }

    // Set HTTP-only cookie for additional security
    const response = NextResponse.json(
      {
        success: true,
        message: 'Admin login successful',
        data: authResult.data
      },
      { status: 200 }
    );

    response.cookies.set('admin_token', authResult.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Admin login API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}