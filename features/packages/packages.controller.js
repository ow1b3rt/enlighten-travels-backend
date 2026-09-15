import * as s from "#/common/feature/common.services.js";
import HttpError from "#/common/errors/HttpError.js";
import { StatusCodes } from "http-status-codes";
import { packages, packageDestinations, packageDays, media } from "#/db/schema/index.js";
import { createPackageSchema, updatePackageSchema } from "./packages.schema.js";
import { parseBody } from "#/common/utils/parse.js";
import { db } from "#/config/db.js";

import { sql, and, eq, getTableColumns, inArray } from "drizzle-orm";
import { join, paginateAndSearch, buildWhereFromQuery } from "#/common/utils/queryhelper.js";
import { asc, desc } from "drizzle-orm";
import { getPackagesListService } from "./packages.services.js";

// Converts a string like "title" or "-price" into asc(column)/desc(column).
// `columns` should be the same columns object used elsewhere (table.columns or getTableColumns(table)).

import {
  createPackageDestinationsService,
  createPackageDaysService,
  updatePackageDestinationsService,
  updatePackageDaysService,
} from "./packages.services.js";

export async function createPackageController(req, res) {
  const data = parseBody(createPackageSchema, req.body);

  const createdPackage = await db.transaction(async (tx) => {
    const pkg = await s.commonCreateService(packages, data, tx);

    if (!pkg) {
      throw new HttpError("Failed to create package", StatusCodes.BAD_REQUEST);
    }

    const destinationItems = await createPackageDestinationsService(pkg, data, tx);
    const dayItems = await createPackageDaysService(pkg, data, tx);

    return { package: pkg, destinationItems, dayItems };
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Package created successfully",
    ...createdPackage,
  });
}

//===========================================================================================================

export async function updatePackageController(req, res) {
  const data = parseBody(updatePackageSchema, req.body);

  const updatedPackage = await db.transaction(async (tx) => {
    const pkg = await s.commonUpdateService(packages, req.params.id, data, tx);

    if (!pkg) {
      throw new HttpError("Failed to update package", StatusCodes.BAD_REQUEST);
    }

    const destinationUpdateResult = await updatePackageDestinationsService(req, data, tx);
    const dayUpdateResult = await updatePackageDaysService(req, data, tx);

    return { package: pkg, destinationUpdateResult, dayUpdateResult };
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Package updated successfully",
    ...updatedPackage,
  });
}

//===========================================================================================================

export async function getPackagesController(req, res) {
  const data = await getPackagesListService(req.query);

  res.status(StatusCodes.OK).json({
    success: true,
    resource: "packages",
    ...data,
  });
}

//===========================================================================================================

export async function getSinglePackageController(req, res) {
  const pkg = await s.commonGetSingleService(packages, req.params.id);

  const destinationRows = await db
    .select({
      destinationId: packageDestinations.destinationId,
      order: packageDestinations.destinationOrder,
    })
    .from(packageDestinations)
    .where(eq(packageDestinations.packageId, req.params.id))
    .orderBy(packageDestinations.destinationOrder);

  const dayRows = await db
    .select({
      dayNumber: packageDays.day,
      title: packageDays.title,
      description: packageDays.description,
    })
    .from(packageDays)
    .where(eq(packageDays.packageId, req.params.id))
    .orderBy(packageDays.day);

  pkg.destinations = destinationRows;
  pkg.days = dayRows;

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Package fetched successfully",
    item: pkg,
  });
}
