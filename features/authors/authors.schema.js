import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { authors } from "../../db/schema/authors.js";

export const insertAuthorSchema = createInsertSchema(authors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateAuthorSchema = createUpdateSchema(authors).omit({
  id: true,
  createdAt: true,
});
