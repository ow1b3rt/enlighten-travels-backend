import {createInsertSchema, createUpdateSchema, createSelectSchema} from 'drizzle-zod';
import {careers} from "#/db/schema/careers.js";
import { z } from "zod";

export const insertCareerSchema= createInsertSchema(careers, {
  email: z.email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  declarationAccepted: z.enum(["true", "false"]).transform((v) => v === "true"),
})
export const updateCareerSchema= createUpdateSchema(careers)
export const selectCareerSchema= createSelectSchema(careers)

