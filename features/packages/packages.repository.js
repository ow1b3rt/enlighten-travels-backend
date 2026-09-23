// packages.repository.js

import { and, eq, getTableColumns, ilike, inArray, sql } from "drizzle-orm";
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
      location:
        sql`string_agg(${destinations.name}, ', ' order by ${packageDestinations.destinationOrder})`.as(
          "location",
        ),
    })
    .from(packageDestinations)
    .innerJoin(
      destinations,
      eq(packageDestinations.destinationId, destinations.id),
    )
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

  return {
    dataQuery,
    countQuery,
    columns: fields,
    name: "packages",
    baseTable: packages,
  };
}

export function buildPackagesWhere(source, query) {
  const filters = ["category", "subcategory", "packageType"];
  const baseWhere = buildWhereFromQuery(source, query, filters);

  const conditions = [];
  if (baseWhere) conditions.push(baseWhere);

  if (
    query.maxPrice !== undefined &&
    query.maxPrice !== "" &&
    !isNaN(query.maxPrice)
  ) {
    conditions.push(
      sql`coalesce(${packages.discountedPrice}, ${packages.price}) <= ${Number(query.maxPrice)}`,
    );
  }

  if (query.tourTypes) {
    const tourTypes = query.tourTypes.split(",").filter(Boolean);
    if (tourTypes.length > 0) {
      conditions.push(inArray(packages.packageType, tourTypes));
    }
  }

  if (query.subcategories) {
    const subcategories = query.subcategories.split(",").filter(Boolean);
    if (subcategories.length > 0) {
      conditions.push(inArray(packages.subcategory, subcategories));
    }
  }

  if (query.destinationIds) {
    const ids = query.destinationIds.split(",").filter(Boolean);
    if (ids.length > 0) {
      conditions.push(
        inArray(
          packages.id,
          db
            .select({ id: packageDestinations.packageId })
            .from(packageDestinations)
            .where(inArray(packageDestinations.destinationId, ids)),
        ),
      );
    }
  }

  const hasMinDays =
    query.minDays !== undefined &&
    query.minDays !== "" &&
    !isNaN(query.minDays);
  const hasMaxDays =
    query.maxDays !== undefined &&
    query.maxDays !== "" &&
    !isNaN(query.maxDays);

  if (hasMinDays || hasMaxDays) {
    const havingConditions = [];
    if (hasMinDays)
      havingConditions.push(sql`count(*) >= ${Number(query.minDays)}`);
    if (hasMaxDays)
      havingConditions.push(sql`count(*) <= ${Number(query.maxDays)}`);

    conditions.push(
      inArray(
        packages.id,
        db
          .select({ id: packageDays.packageId })
          .from(packageDays)
          .groupBy(packageDays.packageId)
          .having(and(...havingConditions)),
      ),
    );
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}
