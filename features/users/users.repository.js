import { eq } from "drizzle-orm";

import { db } from "../../config/db.js";
import { users } from "../../db/schema/index.js";

export async function findUserByEmail(email) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user;
}

export async function findUserById(id) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user;
}

export async function createUser(data) {
  const [user] = await db.insert(users).values(data).returning({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    createdAt: users.createdAt,
  });

  return user;
}

export async function deleteUser(id) {
  await db.delete(users).where(eq(users.id, id));
}

export async function findAllUsers() {
  const userData = await db.select().from(users);
  return userData;
}

export async function updateUser(id, data) {
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    });

  return user;
}
