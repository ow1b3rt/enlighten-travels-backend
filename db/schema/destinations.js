import * as t from "drizzle-orm/pg-core";
import { pkid, timestamps } from "./helpers.js";
import { media } from "./media.js";

export const destinations = t.pgTable("destinations", {
  ...pkid,
  ...timestamps,

  name: t.varchar("name", { length: 255 }).notNull(),
  googleUrl: t.text("google_url"),
  description: t.text("description"),
  thumbnail: t.uuid("thumbnail").references(() => media.id),
});
