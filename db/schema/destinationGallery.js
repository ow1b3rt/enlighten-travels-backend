import * as t from "drizzle-orm/pg-core";
import { pkid, timestamps } from "./helpers.js";
import { media } from "./media.js";
import { destinations } from "./destinations.js";

export const destinationGallery = t.pgTable(
  "destination_gallery",
  {
    ...pkid,
    ...timestamps,

    destinationId: t
      .uuid("destination_id")
      .notNull()
      .references(() => destinations.id, {
        onDelete: "cascade",
      }),

    mediaId: t
      .uuid("media_id")
      .notNull()
      .references(() => media.id, {
        onDelete: "cascade",
      }),
  },
  (table) => ({
    uniqueGallery: t.unique("unique_gallery").on(table.destinationId, table.mediaId)
  })
);
