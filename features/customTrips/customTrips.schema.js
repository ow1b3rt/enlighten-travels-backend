import { createInsertSchema } from "drizzle-zod";
import { customTrips } from "#/db/schema/index.js";

import { z } from "zod";

const phoneRegex = /^(\d{10}|\+\d{1,13}|\+\d{1,3} \d{10})$/;

const phoneSchema = z.string().trim().regex(phoneRegex, {
  message:
    "Phone number must be exactly 10 digits, or a '+' followed by country code (e.g. +911234567890 or +91 1234567890)",
});

export const insertCustomTripSchema = createInsertSchema(customTrips, {
  phone: phoneSchema,
}).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const updateCustomTripSchema = z.strictObject({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
});
