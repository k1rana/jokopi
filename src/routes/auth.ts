import { Elysia } from "elysia";
import { authV1 } from "./v1/auth";
import { authV2 } from "./v2/auth";

// Combined auth routes
export const authRoutes = new Elysia().use(authV1).use(authV2);
