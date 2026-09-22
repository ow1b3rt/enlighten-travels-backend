// src/db/schema/bookings.js
import * as t from "drizzle-orm/pg-core";
import { pkid, timestamps } from "./helpers.js";
import { packages } from "./packages.js";

export const packageOptionEnum = t.pgEnum("package_option", [
  "standard",
  "deluxe",
  "premium",
]);

export const bookingStatusEnum = t.pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);

export const bookings = t.pgTable("bookings", {
  ...pkid,
  ...timestamps,

  packageId: t
    .uuid("package_id")
    .notNull()
    .references(() => packages.id),

  travelDate: t.date("travel_date").notNull(),

  adults: t.integer("adults").notNull().default(0),
  children: t.integer("children").notNull().default(0),

  packageOption: packageOptionEnum("package_option").notNull().default("standard"),

  // Contact details for the person booking — not on the mock, but a
  // booking without a way to reach the customer isn't actionable.
  customerName: t.varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: t.varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: t.varchar("customer_phone", { length: 50 }),

  // Snapshot the price at time of booking rather than deriving it later
  // from packages.price — protects the booking record if the package's
  // price changes afterward.
  totalPrice: t.numeric("total_price", { precision: 10, scale: 2 }),

  notes: t.text("notes"),

  status: bookingStatusEnum("status").notNull().default("pending"),
});
