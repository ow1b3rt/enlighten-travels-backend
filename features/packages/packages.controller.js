import * as s from "#/common/feature/common.services.js";
import HttpError from "#/common/errors/HttpError.js";
import { StatusCodes } from "http-status-codes";
import {
  packages,
  packageDestinations,
  packageDays,
  packageGallery,
  media,
} from "#/db/schema/index.js";
import { createPackageSchema, updatePackageSchema } from "./packages.schema.js";
import { parseBody } from "#/common/utils/parse.js";
import { db } from "#/config/db.js";

import { sql, and, eq, getTableColumns, inArray } from "drizzle-orm";
import {
  join,
  paginateAndSearch,
  buildWhereFromQuery,
} from "#/common/utils/queryhelper.js";
import { asc, desc } from "drizzle-orm";
import { getPackagesListService } from "./packages.services.js";

import {
  createPackageDestinationsService,
  createPackageDaysService,
  createPackageGalleryService,
  updatePackageDestinationsService,
  updatePackageDaysService,
  updatePackageGalleryService,
} from "./packages.services.js";
import { slugify } from "#/common/utils/slugify.js";
import { destinations } from "../../db/schema/destinations.js";

export async function createPackageController(req, res) {
  const data = parseBody(createPackageSchema, req.body);
  data.slug = slugify(data.title);

  const createdPackage = await db.transaction(async (tx) => {
    const pkg = await s.commonCreateService(packages, data, tx);

    if (!pkg) {
      throw new HttpError("Failed to create package", StatusCodes.BAD_REQUEST);
    }

    const destinationItems = await createPackageDestinationsService(
      pkg,
      data,
      tx,
    );
    const dayItems = await createPackageDaysService(pkg, data, tx);
    const galleryItems = await createPackageGalleryService(req, pkg, data, tx);

    return { package: pkg, destinationItems, dayItems, galleryItems };
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
  if (data.title) {
    data.slug = slugify(data.title);
  }

  const updatedPackage = await db.transaction(async (tx) => {
    const pkg = await s.commonUpdateService(packages, req.params.id, data, tx);

    if (!pkg) {
      throw new HttpError("Failed to update package", StatusCodes.BAD_REQUEST);
    }

    const destinationUpdateResult = await updatePackageDestinationsService(
      req,
      data,
      tx,
    );
    const dayUpdateResult = await updatePackageDaysService(req, data, tx);
    const galleryUpdateResult = await updatePackageGalleryService(
      req,
      data,
      tx,
    );

    return {
      package: pkg,
      destinationUpdateResult,
      dayUpdateResult,
      galleryUpdateResult,
    };
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

  const packageThumbnail = pkg.thumbnail
    ? await s.commonGetSingleService(media, pkg.thumbnail)
    : {};
  pkg.thumbnailUrl = packageThumbnail.url;

  const destinationRows = await db
    .select({
      destinationId: packageDestinations.destinationId,
      order: packageDestinations.destinationOrder,
      destinationName: packageDestinations,
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

  const galleryItems = await db
    .select({ mediaId: packageGallery.mediaId })
    .from(packageGallery)
    .where(eq(packageGallery.packageId, req.params.id));

  pkg.destinations = destinationRows;
  pkg.days = dayRows;
  pkg.gallery = galleryItems.map((item) => item.mediaId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Package fetched successfully",
    item: pkg,
  });
}

export async function getSinglePackageBySlugController(req, res) {
  const pkg = await s.commonGetSingleServiceBySlug(packages, req.params.slug);
  const packageThumbnail = pkg.thumbnail
    ? await s.commonGetSingleService(media, pkg.thumbnail)
    : {};
  pkg.thumbnailUrl = packageThumbnail.url;

  const destinationRows = await db
    .select({
      destinationId: packageDestinations.destinationId,
      order: packageDestinations.destinationOrder,
      destinationName: destinations.name,
    })
    .from(packageDestinations)
    .innerJoin(
      destinations,
      eq(destinations.id, packageDestinations.destinationId),
    )
    .where(eq(packageDestinations.packageId, pkg.id))
    .orderBy(packageDestinations.destinationOrder);

  const dayRows = await db
    .select({
      dayNumber: packageDays.day,
      title: packageDays.title,
      description: packageDays.description,
    })
    .from(packageDays)
    .where(eq(packageDays.packageId, pkg.id))
    .orderBy(packageDays.day);

  const galleryQuery = db
    .select({ mediaUrl: media.url })
    .from(packageGallery)
    .leftJoin(media, eq(packageGallery.mediaId, media.id))
    .where(eq(packageGallery.packageId, pkg.id));

  const galleryItems = await galleryQuery;

  pkg.destinations = destinationRows;
  pkg.days = dayRows;
  pkg.gallery = galleryItems.map((item) => item.mediaUrl);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Package fetched successfully",
    item: pkg,
  });
}
