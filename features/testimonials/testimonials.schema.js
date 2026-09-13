import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { testimonials } from "../../db/schema/testimonials.js";

export const createSuccessSchema = createInsertSchema(testimonials);
export const updateSuccessSchema = createUpdateSchema(testimonials);
