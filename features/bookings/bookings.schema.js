// booking.schema.js
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { bookings } from "#/db/schema/bookings.js";

export const insertBookingSchema = createInsertSchema(bookings, {
    packageId: z.string().uuid(),
    travelDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    adults: z.number().int().min(0).default(0),
    children: z.number().int().min(0).default(0),
    packageOption: z.enum(["standard", "deluxe", "premium"]).default("standard"),
    customerName: z.string().min(1, "Name is required"),
    customerEmail: z.string().email("Valid email is required"),
    customerPhone: z.string().optional(),
    notes: z.string().optional(),
}).omit({
    id: true,
    status: true,
    totalPrice: true,
    createdAt: true,
    updatedAt: true,
});

export const updateBookingStatusSchema = z.object({
    status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
});
