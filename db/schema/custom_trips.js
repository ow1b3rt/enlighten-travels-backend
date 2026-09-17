import * as t from "drizzle-orm/pg-core";

import { pkid } from "./helpers.js";
import { timestamp } from "drizzle-orm/pg-core";

export const customTrips = t.pgTable(
  "custom_trips",
  {
    ...pkid,

    name: t.varchar("name", { length: 255 }).notNull(),

    email: t.varchar("email", { length: 255 }).notNull(),

    phone: t.varchar("phone", { length: 15 }),

    destination: t.varchar("destination", { length: 255 }).notNull(),

    travelDate: t.date("travel_date"),

    noOfTravellers: t.integer("no_of_travellers"),

    tripType: t.varchar("trip_type", { length: 50 }),

    accommodation: t.varchar("accommodation", { length: 50 }),

    tripNotes: t.text("trip_notes"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    t.index("trip_inquiries_email_idx").on(table.email),
    t.index("trip_inquiries_destination_idx").on(table.destination),
    t.index("trip_inquiries_created_at_idx").on(table.createdAt),
  ],
);
