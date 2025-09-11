import { AuthResponse, SignInRequest, SignUpRequest, User } from "@/types/auth";

const API_BASE_URL = "/api/auth";

export class AuthService {
  static async signUp(data: SignUpRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Sign up failed");
    }

    return result;
  }

  static async signIn(data: SignInRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Sign in failed");
    }

    return result;
  }

  static async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to get user");
    }

    return result.user;
  }

  // Local storage helpers
  static saveSession(session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  }) {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_session", JSON.stringify(session));
    }
  }

  static async getSession() {
    console.log("hola");
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("auth_session");
      if (session) {
        console.log("test", JSON.parse(session));
        return JSON.parse(session);
      }
      return null;
    }
    return null;
  }

  static clearSession() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_session");
    }
  }

  static isTokenExpired(expiresAt: number): boolean {
    return Date.now() >= expiresAt * 1000;
  }
}
