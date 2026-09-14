import { eq, and } from "drizzle-orm";
import { destinations, destinationGallery } from "#/db/schema/index.js";
import * as s from "#/common/feature/common.services.js";
import { diffIds } from "#/common/utils/diffid.js";

export async function createDestinationGalleryService(req, destination, data, tx) {
  let galleryItems = [];
  if (!data.gallery || data.gallery.length === 0) {
    return galleryItems;
  }

  for (const mediaId of data.gallery || []) {
    const galleryItem = await s.commonCreateService(destinationGallery, {
      destinationId: destination.id,
      mediaId: mediaId,
    }, tx);

    galleryItems.push(galleryItem.mediaId);
    
    if (!galleryItem) {
      throw new HttpError("Failed to create destination gallery item", StatusCodes.BAD_REQUEST);
    }
  }

  return galleryItems;
}

//===========================================================================================================

export async function updateDestinationGalleryService(req, data, tx) {
    let galleryUpdateResult = {};

    if (data.gallery && data.gallery.length > 0) {
      const existingGalleryItems = await tx
        .select({ mediaId: destinationGallery.mediaId })
        .from(destinationGallery)
        .where(eq(destinationGallery.destinationId, req.params.id));

      if (existingGalleryItems.length > 0) {
        const mediaIds = existingGalleryItems.map(item => item.mediaId);
        const { remove, add } = diffIds(mediaIds, data.gallery);

        for (const id of remove) {
          await tx.delete(destinationGallery)
            .where(
              and(
                eq(destinationGallery.destinationId, req.params.id),
                eq(destinationGallery.mediaId, id)
              )
            );
        }

        for (const id of add) {
          await s.commonCreateService(destinationGallery, {
            destinationId: req.params.id,
            mediaId: id,
          }, tx);
        }

        galleryUpdateResult = { remove, add };
      }
    }

    return galleryUpdateResult;
}


