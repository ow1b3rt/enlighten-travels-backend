// packages.repository.js

import { and, eq, getTableColumns, inArray, sql } from "drizzle-orm";
import {
  packages,
  packageDestinations,
  packageDays,
  destinations,
  media,
} from "#/db/schema/index.js";
import { db } from "#/config/db.js";
import { buildWhereFromQuery } from "#/common/utils/queryhelper.js";

export function buildPackagesSource() {
  const packageColumns = getTableColumns(packages);

  const dayCounts = db
    .select({
      packageId: packageDays.packageId,
      duration: sql`count(*)::int`.as("duration"),
    })
    .from(packageDays)
    .groupBy(packageDays.packageId)
    .as("day_counts");

  const locations = db
    .select({
      packageId: packageDestinations.packageId,
      location: sql`string_agg(${destinations.name}, ', ' order by ${packageDestinations.destinationOrder})`.as(
        "location"
      ),
    })
    .from(packageDestinations)
    .innerJoin(destinations, eq(packageDestinations.destinationId, destinations.id))
    .groupBy(packageDestinations.packageId)
    .as("locations");

  const fields = {
    ...packageColumns,
    thumbnailUrl: media.url,
    duration: sql`coalesce(${dayCounts.duration}, 0)`.as("duration"),
    location: locations.location,
  };

  const dataQuery = db
    .select(fields)
    .from(packages)
    .leftJoin(media, eq(packages.thumbnail, media.id))
    .leftJoin(dayCounts, eq(packages.id, dayCounts.packageId))
    .leftJoin(locations, eq(packages.id, locations.packageId));

  const countQuery = db
    .select({ count: sql`count(*)::int` })
    .from(packages)
    .leftJoin(media, eq(packages.thumbnail, media.id));

  return { dataQuery, countQuery, columns: fields, name: "packages", baseTable: packages };
}

export function buildPackagesWhere(source, query) {
  const filters = ["category", "subcategory", "packageType"];
  const baseWhere = buildWhereFromQuery(source, query, filters);

  let priceWhere;
  if (query.maxPrice !== undefined && query.maxPrice !== "" && !isNaN(query.maxPrice)) {
    priceWhere = sql`coalesce(${packages.discountedPrice}, ${packages.price}) <= ${Number(query.maxPrice)}`;
  }

  let destinationWhere;
  if (query.destinationIds) {
    const ids = query.destinationIds.split(",").filter(Boolean);
    if (ids.length > 0) {
      destinationWhere = inArray(
        packages.id,
        db
          .select({ id: packageDestinations.packageId })
          .from(packageDestinations)
          .where(inArray(packageDestinations.destinationId, ids))
      );
    }
  }

  const conditions = [baseWhere, priceWhere, destinationWhere].filter(Boolean);
  return conditions.length > 0 ? and(...conditions) : undefined;
}
