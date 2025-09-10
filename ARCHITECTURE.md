# Authentication System Architecture Documentation

## Overview
This document outlines the architecture and implementation details of the authentication system built following Clean Architecture principles.

## Technology Stack
- **Frontend**: Next.js 13+ with TypeScript, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Zod for schema validation

## Clean Architecture Implementation

### 1. Presentation Layer (UI Components)
- **Location**: `app/auth/login/page.tsx`, `components/organisms/Header/Navbar.tsx`
- **Responsibility**: User interface, form handling, user interactions
- **Key Components**:
  - Login/Register forms with validation
  - Navbar with dynamic styling based on scroll
  - Authentication state management

### 2. Application Layer (Use Cases)
- **Location**: `lib/auth.ts`, `components/hoc/withAuth.tsx`
- **Responsibility**: Business logic, authentication flows, route protection
- **Key Classes**:
  - `ClientAuthManager`: Handles client-side authentication state
  - `AuthUtils`: Token verification and validation utilities
  - `withAuth`: Higher-order component for route protection

### 3. Infrastructure Layer (External Services)
- **Location**: `app/api/auth/`, `lib/prisma.ts`
- **Responsibility**: API endpoints, database operations, external integrations
- **Key Services**:
  - `AuthService`: Authentication business logic
  - `RegistrationService`: User registration logic
  - Database models and operations

## Key Features Implemented

### 1. Navbar Text Color Animation
- **Implementation**: Dynamic CSS classes based on scroll state
- **Colors**: 
  - Default (no scroll): White (#FFFFFF)
  - Scrolled state: Sky blue (#87CEEB)
- **Trigger**: 50px scroll threshold
- **Smooth transitions**: CSS transitions with 300ms duration

### 2. Authentication API
- **Endpoints**:
  - `POST /api/auth/login`: User authentication
  - `POST /api/auth/register`: User registration
- **Validation**: Zod schemas for input validation
- **Security**: bcrypt password hashing, JWT token generation
- **Error Handling**: Comprehensive error responses with appropriate HTTP status codes

### 3. Frontend Authentication Integration
- **Forms**: Login/Register with phone number and password only
- **API Integration**: Fetch-based API calls with error handling
- **Token Storage**: localStorage for client-side token management
- **Route Protection**: Middleware and HOC for protected routes

## Security Measures

### Password Security
- **Hashing**: bcrypt with salt rounds of 12
- **Validation**: Minimum 6 characters, complexity requirements for registration
- **Storage**: Never stored in plain text

### JWT Token Security
- **Expiration**: 7-day token lifetime
- **Verification**: Server-side token validation
- **Storage**: localStorage with expiration checks

### Input Validation
- **Client-side**: Real-time form validation
- **Server-side**: Zod schema validation
- **Phone Number**: Regex validation for international formats

## Clean Code Principles Applied

### 1. Single Responsibility Principle (SRP)
- Each class has a single, well-defined responsibility
- `AuthService` handles authentication logic only
- `ValidationService` handles input validation only
- `ClientAuthManager` handles client-side auth state only

### 2. Open/Closed Principle (OCP)
- Services are open for extension but closed for modification
- Interface-based design allows for easy testing and mocking

### 3. Dependency Inversion Principle (DIP)
- High-level modules don't depend on low-level modules
- Both depend on abstractions (interfaces)

### 4. Clean Code Practices
- **Meaningful Names**: Descriptive variable and function names
- **Small Functions**: Each function does one thing well
- **Comments**: Comprehensive JSDoc comments for all public methods
- **Error Handling**: Proper try-catch blocks with meaningful error messages

## File Structure
```
├── app/
│   ├── api/auth/
│   │   ├── login/route.ts          # Login API endpoint
│   │   └── register/route.ts       # Registration API endpoint
│   └── auth/
│       └── login/page.tsx          # Authentication UI
├── components/
│   ├── hoc/withAuth.tsx           # Authentication HOC
│   └── organisms/Header/Navbar.tsx # Navigation with scroll effects
├── lib/
│   └── auth.ts                    # Authentication utilities
├── middleware.ts                  # Route protection middleware
└── prisma/
    └── schema.prisma             # Database schema
```

## API Response Format
```typescript
// Success Response
{
  success: true,
  message: string,
  data: {
    user: UserData,
    token: string
  }
}

// Error Response
{
  success: false,
  error: string,
  details?: ValidationError[]
}
```

## Database Schema
```sql
-- Users table with authentication fields
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  games_played INTEGER DEFAULT 0,
  vouchers INTEGER DEFAULT 0,
  last_play TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Usage Examples

### Protected Route Implementation
```typescript
// Protect a page component
export default withAuth(UserProfilePage, {
  requireAuth: true,
  redirectTo: '/auth/login'
});
```

### Authentication Hook Usage
```typescript
// Use authentication state in components
const { isAuthenticated, user, logout } = useAuth();
```

### API Integration
```typescript
// Login user
const result = await AuthApiService.login(phone, password);
if (result.success) {
  ClientAuthManager.setAuthData(result.data.token, result.data.user);
}
```

## Testing Considerations
- Unit tests for validation functions
- Integration tests for API endpoints
- E2E tests for authentication flows
- Mock implementations for external dependencies

## Future Enhancements
- Two-factor authentication (2FA)
- Social login integration
- Password reset functionality
- Session management improvements
- Rate limiting for API endpoints