import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Input validation schema
const adminRegisterSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
});

// JWT secret key (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Mock admin storage (in production, use database)
const mockAdmins: any[] = [
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
 * Admin Registration Service Layer
 * Handles business logic for admin registration
 */
class AdminRegistrationService {
  /**
   * Registers a new admin user
   * @param email - Admin's email
   * @param password - Admin's password
   * @param name - Admin's name
   * @returns Promise with admin data and token or error
   */
  static async registerAdmin(email: string, password: string, name: string) {
    try {
      // Check if admin already exists
      const existingAdmin = mockAdmins.find(a => a.email === email);

      if (existingAdmin) {
        return { success: false, error: 'Email already registered' };
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new admin
      const newAdmin = {
        id: `admin-${Date.now()}`,
        email,
        password: hashedPassword,
        name,
        role: 'admin',
        createdAt: new Date()
      };

      // Add to mock storage (in production, save to database)
      mockAdmins.push(newAdmin);

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: newAdmin.id, 
          email: newAdmin.email,
          role: newAdmin.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remove password from response
      const { password: _, ...adminWithoutPassword } = newAdmin;

      return {
        success: true,
        data: {
          user: adminWithoutPassword,
          token
        }
      };
    } catch (error) {
      console.error('Admin registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }
}

/**
 * Admin Registration API Route Handler
 * POST /api/auth/admin/register
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    const validationResult = adminRegisterSchema.safeParse(body);
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

    const { email, password, name } = validationResult.data;

    // Register admin
    const registrationResult = await AdminRegistrationService.registerAdmin(email, password, name);

    if (!registrationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: registrationResult.error
        },
        { status: 409 } // Conflict status for existing user
      );
    }

    // Set HTTP-only cookie for additional security
    const response = NextResponse.json(
      {
        success: true,
        message: 'Admin registration successful',
        data: registrationResult.data
      },
      { status: 201 }
    );

    response.cookies.set('admin_token', registrationResult.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Admin registration API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}