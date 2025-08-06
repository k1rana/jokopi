import { eq } from "drizzle-orm";
import { db } from "../infra/db";
import { users } from "../infra/db/schema";

export class AuthService {
  async getUserByEmail(email: string) {
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        phoneNumber: users.phoneNumber,
        roleId: users.roleId,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user[0] || null;
  }

  async getUserById(id: string) {
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        phoneNumber: users.phoneNumber,
        roleId: users.roleId,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user[0] || null;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const result = await db
      .select({ count: users.id })
      .from(users)
      .where(eq(users.email, email));

    return result.length > 0;
  }

  async checkPhoneExists(phoneNumber: string): Promise<boolean> {
    const result = await db
      .select({ count: users.id })
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber));

    return result.length > 0;
  }

  async createUser(
    email: string,
    hashedPassword: string,
    phoneNumber: string,
    roleId: number = 2
  ) {
    const result = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        phoneNumber,
        roleId,
      })
      .returning({
        id: users.id,
        email: users.email,
        phoneNumber: users.phoneNumber,
        roleId: users.roleId,
        createdAt: users.createdAt,
      });

    return result[0];
  }

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await Bun.password.verify(plainPassword, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return await Bun.password.hash(password);
  }
}
