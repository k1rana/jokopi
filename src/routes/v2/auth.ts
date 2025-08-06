import { jwt } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { AuthService } from "../../services/auth.service";
import { type V2BaseResponse } from "../../types/auth";

const authService = new AuthService();

// V2 Authentication Routes
export const authV2 = new Elysia({ prefix: "/v2/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY || "your-secret-key",
    })
  )
  .post(
    "/login",
    async ({ body, jwt, set }): Promise<V2BaseResponse> => {
      try {
        const { email, password, rememberMe } = body;

        // Get user info
        const user = await authService.getUserByEmail(email);
        if (!user) {
          set.status = 401;
          return {
            errors: ["Invalid email or password"],
            message: "Authentication failed",
            data: null,
          };
        }

        // Verify password
        const isPasswordValid = await authService.verifyPassword(
          password,
          user.password
        );
        if (!isPasswordValid) {
          set.status = 401;
          return {
            errors: ["Invalid email or password"],
            message: "Authentication failed",
            data: null,
          };
        }

        // Create JWT payload
        const payload = {
          id: user.id,
          email: user.email,
          role: user.roleId,
        };

        const token = await jwt.sign(payload);

        set.status = 200;
        return {
          errors: [],
          message: "Login successful",
          data: {
            token,
            user: {
              id: user.id,
              email: user.email,
              role: user.roleId,
            },
          },
        };
      } catch (error) {
        console.error(error);
        set.status = 500;
        return {
          errors: ["Internal server error"],
          message: "Something went wrong",
          data: null,
        };
      }
    },
    {
      detail: {
        tags: ["Authentication"],
        summary: "User Login (V2)",
        description:
          "Authenticate user with email and password, returns JWT token with standardized response format",
      },
      body: t.Object({
        email: t.String({ format: "email", description: "User email address" }),
        password: t.String({
          minLength: 7,
          description: "User password (minimum 7 characters)",
        }),
        rememberMe: t.Optional(
          t.Boolean({ description: "Keep user logged in for extended period" })
        ),
      }),
    }
  )
  .post(
    "/register",
    async ({ body, set }): Promise<V2BaseResponse> => {
      try {
        const { email, password, phoneNumber } = body;

        // Validation errors array
        const errors: string[] = [];

        // Check if email already exists
        const emailExists = await authService.checkEmailExists(email);
        if (emailExists) {
          errors.push("Email already registered");
        }

        // Check if phone number already exists
        const phoneExists = await authService.checkPhoneExists(phoneNumber);
        if (phoneExists) {
          errors.push("Phone number already registered");
        }

        if (errors.length > 0) {
          set.status = 409;
          return {
            errors,
            message: "Registration failed",
            data: null,
          };
        }

        // Hash password
        const hashedPassword = await authService.hashPassword(password);

        // Create user
        const newUser = await authService.createUser(
          email,
          hashedPassword,
          phoneNumber
        );

        set.status = 201;
        return {
          errors: [],
          message: "User registered successfully",
          data: {
            user: newUser,
          },
        };
      } catch (error) {
        console.error(error);
        set.status = 500;
        return {
          errors: ["Internal server error"],
          message: "Something went wrong",
          data: null,
        };
      }
    },
    {
      detail: {
        tags: ["Authentication"],
        summary: "User Registration (V2)",
        description:
          "Register a new user with email, password, and phone number using standardized response format",
      },
      body: t.Object({
        email: t.String({ format: "email", description: "User email address" }),
        password: t.String({
          minLength: 7,
          description: "User password (minimum 7 characters)",
        }),
        phoneNumber: t.String({
          pattern:
            "^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$",
          description: "User phone number in international format",
        }),
      }),
    }
  );
