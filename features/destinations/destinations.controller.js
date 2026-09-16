import * as s from "#/common/feature/common.services.js";
import HttpError from "#/common/errors/HttpError.js";
import { StatusCodes } from "http-status-codes";
import { media, destinations, destinationGallery } from "#/db/schema/index.js";
import { createDestinationSchema, updateDestinationSchema } from "./destinations.schema.js";
import { parseBody } from "#/common/utils/parse.js";
import { db } from "#/config/db.js";
import { eq, and } from "drizzle-orm";
import { updateDestinationGalleryService, createDestinationGalleryService } from "./destinations.services.js";
import { slugify } from "#/common/utils/slugify.js";

export async function createDestinationController(req, res) {
  const data = parseBody(createDestinationSchema, req.body);
  data.slug = slugify(data.name);

  const createdDestination = await db.transaction(async (tx) => {
    const destination = await s.commonCreateService(destinations, data, tx);

    if (!destination) {
      throw new HttpError("Failed to create destination", StatusCodes.BAD_REQUEST);
    }

    const galleryItems = await createDestinationGalleryService(req, destination, data, tx);

    return { destination, galleryItems };
  });
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Destination created successfully",
    ...createdDestination,
  });
}

//===========================================================================================================

export async function updateDestinationController(req, res) {
  const data = parseBody(updateDestinationSchema, req.body);
  if (data.name) {
    data.slug = slugify(data.name);
  }

  const updatedDestination = await db.transaction(async (tx) => {
    const destination = await s.commonUpdateService(destinations, req.params.id, data, tx);

    if (!destination) {
      throw new HttpError("Failed to update destination", StatusCodes.BAD_REQUEST);
    }

    const galleryUpdateResult = await updateDestinationGalleryService(req, data, tx);

    return { destination, galleryUpdateResult };
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Destination updated successfully",
    ...updatedDestination,
  });
}

//===========================================================================================================

export async function getSingleDestinationController(req, res) {
  const destination = await s.commonGetSingleService(destinations, req.params.id);

  const destinationThumbnail = await s.commonGetSingleService(media, destination.thumbnail);
  destination.thumbnailUrl = destinationThumbnail.url;

  const galleryItems = await db.select({ mediaId: destinationGallery.mediaId })
    .from(destinationGallery)
    .where(eq(destinationGallery.destinationId, req.params.id));

  destination.gallery = galleryItems.map(item => item.mediaId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Destination fetched successfully",
    item: destination,
  });
}

export async function getSingleDestinationBySlugController(req, res) {
  const destination = await s.commonGetSingleServiceBySlug(destinations, req.params.slug);

  const destinationThumbnail = await s.commonGetSingleService(media, destination.thumbnail);
  destination.thumbnailUrl = destinationThumbnail.url;

  const query = db.select({ mediaUrl: media.url })
      .from(destinationGallery)
      .leftJoin(media, eq(destinationGallery.mediaId, media.id))
      .where(eq(destinationGallery.destinationId, destination.id));

  const galleryItems = await query

  destination.gallery = galleryItems.map(item => item.mediaUrl);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Destination fetched successfully",
    item: destination,
  });
}


