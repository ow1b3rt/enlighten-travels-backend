import * as t from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { pkid, timestamps } from "./helpers.js";
import { media } from "./media.js";

export const testimonials = t.pgTable("testimonials", {
  ...pkid,
  ...timestamps,

  name: t.varchar("name", { length: 255 }).notNull(),
  image: t.uuid("image").references(() => media.id),

  description: t.text("description"),
});
