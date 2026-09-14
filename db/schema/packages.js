import * as t from "drizzle-orm/pg-core";
import { pkid, timestamps } from "./helpers.js";
import { media } from "./media.js";

export const categoryEnum = t.pgEnum("category", ["adventure", "tour"])

export const packages = t.pgTable("packages", {
  ...pkid,
  ...timestamps,

  title: t.varchar("title", { length: 255 }).notNull(),
  thumbnail: t.uuid("thumbnail").references(() => media.id),
  price: t.integer("price").notNull(),
  discountedPrice: t.integer("discounted_price"),
  description: t.text("description"),
  category: categoryEnum("category").notNull(),
  subcategory: t.varchar("subcategory", { length: 255 }).notNull(),
  packageType: t.varchar("package_type", { length: 255 }).notNull(),
});

