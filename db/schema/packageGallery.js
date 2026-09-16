import * as t from "drizzle-orm/pg-core";
import { pkid, timestamps } from "./helpers.js";
import { media } from "./media.js";
import { packages } from "./packages.js";

export const packageGallery = t.pgTable(
  "package_gallery",
  {
    ...pkid,
    ...timestamps,

    packageId: t
      .uuid("package_id")
      .notNull()
      .references(() => packages.id, {
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
    uniqueGallery: t.unique("unique_package_gallery").on(table.packageId, table.mediaId),
  })
);
