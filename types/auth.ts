export interface User {
  id: string;
  phone: string;
  name: string;
  created_at?: string;
  last_sign_in_at?: string;
  role: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface SignUpRequest {
  phone: string;
  password: string;
  name?: string;
}

export interface SignInRequest {
  phone: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  session?: AuthSession;
}

export interface AuthError {
  error: string;
}
