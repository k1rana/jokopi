import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authRoutes } from "./routes/auth";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Jokopi API",
          version: "2.0.0",
          description: "API documentation for Jokopi coffee shop application",
        },
        servers: [
          {
            url: "http://localhost:3000",
            description: "Development server",
          },
        ],
        tags: [
          {
            name: "Authentication",
            description: "Authentication endpoints for login and registration",
          },
        ],
      },
    })
  )
  .use(authRoutes)
  .get("/", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
console.log(
  `📚 Swagger documentation available at http://${app.server?.hostname}:${app.server?.port}/swagger`
);
