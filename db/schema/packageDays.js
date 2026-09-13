import * as t from "drizzle-orm/pg-core";
import { pkid, timestamps } from "./helpers.js";
import { destinations } from "./destinations.js";
import { packages } from "./packages.js";

export const packageDays = t.pgTable("package_days", {
    ...pkid,
    ...timestamps,

    day: t.integer("day").notNull(),
    title: t.varchar("title", { length: 255 }).notNull(),
    description: t.text("description"),

    packageId: t
      .uuid("package_id")
      .notNull()
      .references(() => packages.id, {
        onDelete: "cascade",
      }),
  },

  (table) => ({
    uniquePackageDay: t.unique("unique_package_day").on(table.packageId, table.day),
  }),
);
