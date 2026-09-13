import * as t from "drizzle-orm/pg-core";
import { pkid, timestamps } from "./helpers.js";
import { destinations } from "./destinations.js";
import { packages } from "./packages.js";

export const packageDestinations = t.pgTable("package_destinations", {
    ...pkid,
    ...timestamps,

    destinationId: t
      .uuid("destination_id")
      .notNull()
      .references(() => destinations.id, {
        onDelete: "cascade",
      }),

    packageId: t
      .uuid("package_id")
      .notNull()
      .references(() => packages.id, {
        onDelete: "cascade",
      }),

    destinationOrder: t.integer("destination_order").notNull(),
  },

  (table) => ({
    uniquePackageDestination: t.unique("unique_package_destination").on(table.destinationId, table.packageId),
  }),
)
