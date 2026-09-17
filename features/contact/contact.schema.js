import { createInsertSchema } from "drizzle-zod";
import { contacts } from "#/db/schema/contact.js";

import { z } from "zod";

const phoneRegex = /^(\d{10}|\+\d{1,13}|\+\d{1,3} \d{10})$/;

const phoneSchema = z.string().trim().regex(phoneRegex, {
  message:
    "Phone number must be exactly 10 digits, or a '+' followed by country code (e.g. +911234567890 or +91 1234567890)",
});

export const insertContactSchema = createInsertSchema(contacts, {
  phone: phoneSchema,
});

export const updateContactSchema = z.strictObject({});
