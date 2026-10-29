// src/db/schema/tickets.js
import * as t from "drizzle-orm/pg-core";
import { pkid, timestamps } from "./helpers.js";
import { destinations } from "./destinations.js";

export const travelModeEnum = t.pgEnum("travel_mode", [
  "air",
  "bus",
  "car",
  "train",
  "jeep",
  "other",
]);

export const ticketStatusEnum = t.pgEnum("ticket_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);

export const tickets = t.pgTable("tickets", {
  ...pkid,
  ...timestamps,

  destinationId: t
    .uuid("destination_id")
    .notNull()
    .references(() => destinations.id),

  // Where the customer is departing from. Free text since it's usually
  // a city the customer types in, not necessarily one of our destinations.
  origin: t.varchar("origin", { length: 255 }).notNull(),

  travelMode: travelModeEnum("travel_mode").notNull().default("air"),

  travelDate: t.date("travel_date").notNull(),

  adults: t.integer("adults").notNull().default(1),
  children: t.integer("children").notNull().default(0),

  // Contact details for the person requesting the ticket.
  customerName: t.varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: t.varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: t.varchar("customer_phone", { length: 50 }),

  notes: t.text("notes"),

  status: ticketStatusEnum("status").notNull().default("pending"),
});
