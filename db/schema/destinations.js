import * as t from "drizzle-orm/pg-core";
import { pkid, timestamps } from "./helpers.js";
import { media } from "./media.js";

export const typeEnum = t.pgEnum("destination_type", ["national", "international"]);
export const destinations = t.pgTable("destinations", {
  ...pkid,
  ...timestamps,

  name: t.varchar("name", { length: 255 }).notNull(),
  slug: t.varchar("slug", { length: 255 }).notNull().unique(),
  type: typeEnum("type").notNull(),
  googleUrl: t.text("google_url"),
  description: t.text("description"),
  content: t.jsonb("content"),
  thumbnail: t.uuid("thumbnail").references(() => media.id),
});
