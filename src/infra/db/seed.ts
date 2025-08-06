import { db } from "./index";
import { roles } from "./schema";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Insert default roles
    await db
      .insert(roles)
      .values([
        { id: 1, name: "admin" },
        { id: 2, name: "user" },
      ])
      .onConflictDoNothing();

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
