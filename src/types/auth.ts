import { z } from "zod";

// Request schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(7, "Password must be at least 7 characters"),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(7, "Password must be at least 7 characters"),
  phoneNumber: z
    .string()
    .regex(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Invalid phone number format"
    ),
});

// JWT payload type
export interface JWTPayload extends Record<string, string | number> {
  id: string;
  email: string;
  role: number;
  iat?: number;
  exp?: number;
}

// Response types for V1
export interface V1LoginResponse {
  status: number;
  msg: string;
  data: {
    token: string;
    id_user: string;
  };
}

export interface V1RegisterResponse {
  data: any[];
  msg: string;
}

export interface V1ErrorResponse {
  msg: string;
  status?: number;
}

// Response types for V2
export interface V2BaseResponse<T = any> {
  errors: string[];
  message: string | null;
  data: T | null;
}

// Type exports
export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
