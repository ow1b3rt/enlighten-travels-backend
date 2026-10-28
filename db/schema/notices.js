import * as t from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { pkid, timestamps } from "./helpers.js";
import { media } from "./media.js";

export const notices = t.pgTable("notices", {
  ...pkid,
  ...timestamps,

  content: t.uuid("content").references(() => media.id),
  title: t.varchar("title", { length: 255 }).notNull(),
  slug: t
    .varchar("slug", { length: 255 })
    .notNull()
    .generatedAlwaysAs(
      sql`trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g')) || '-' || left(id::text, 8)`,
    )
    .unique(),
  description: t.text("description"),
});
