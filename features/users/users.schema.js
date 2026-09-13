import { z } from "zod";
import { createInsertSchema, createUpdateSchema} from "drizzle-zod"
import { users } from "#/db/schema/index.js"

export const createUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateUserSchema = createUpdateSchema(users).omit({
  id: true,
  createdAt: true,
})

export const deleteUserSchema = z.object({
  id: z.string().trim().min(1),
});
