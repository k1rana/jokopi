import { jwt } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { AuthService } from "../../services/auth.service";
import {
  type V1ErrorResponse,
  type V1LoginResponse,
  type V1RegisterResponse,
} from "../../types/auth";

const authService = new AuthService();

// V1 Authentication Routes
export const authV1 = new Elysia({ prefix: "/v1/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY || "your-secret-key",
    })
  )
  .post(
    "/login",
    async ({ body, jwt, set }): Promise<V1LoginResponse | V1ErrorResponse> => {
      try {
        const { email, password, rememberMe } = body;

        // Get user info
        const user = await authService.getUserByEmail(email);
        if (!user) {
          set.status = 401;
          return { msg: "Email atau password salah!" };
        }

        // Verify password
        const isPasswordValid = await authService.verifyPassword(
          password,
          user.password
        );
        if (!isPasswordValid) {
          set.status = 401;
          return { msg: "Email atau password salah!" };
        }

        // Create JWT payload
        const payload = {
          id: user.id,
          email: user.email,
          role: user.roleId,
        };

        const expiresIn = rememberMe ? "7d" : "1d";
        const token = await jwt.sign(payload);

        set.status = 201;
        return {
          status: 201,
          msg: "Login successful!",
          data: { token, id_user: user.id },
        };
      } catch (error) {
        console.error(error);
        set.status = 500;
        return { status: 500, msg: "Internal Server Error" };
      }
    },
    {
      detail: {
        tags: ["Authentication"],
        summary: "User Login (V1)",
        description:
          "Authenticate user with email and password, returns JWT token",
      },
      body: t.Object({
        email: t.String({ format: "email", description: "User email address" }),
        password: t.String({
          minLength: 7,
          description: "User password (minimum 7 characters)",
        }),
        rememberMe: t.Optional(
          t.Boolean({
            description: "Keep user logged in for 7 days instead of 1 day",
          })
        ),
      }),
    }
  )
  .post(
    "/register",
    async ({ body, set }): Promise<V1RegisterResponse | V1ErrorResponse> => {
      try {
        const { email, password, phoneNumber } = body;

        // Check if email already exists
        const emailExists = await authService.checkEmailExists(email);
        if (emailExists) {
          set.status = 409;
          return { msg: "Email already registered" };
        }

        // Check if phone number already exists
        const phoneExists = await authService.checkPhoneExists(phoneNumber);
        if (phoneExists) {
          set.status = 409;
          return { msg: "Phone number already registered" };
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
          data: [newUser],
          msg: "User has been successfully registered!",
        };
      } catch (error) {
        console.error(error);
        set.status = 500;
        return { msg: "Internal Server Error" };
      }
    },
    {
      detail: {
        tags: ["Authentication"],
        summary: "User Registration (V1)",
        description:
          "Register a new user with email, password, and phone number",
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
