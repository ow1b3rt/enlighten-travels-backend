import { eq, and } from "drizzle-orm";
import { packageDestinations, packageDays } from "#/db/schema/index.js";
import * as s from "#/common/feature/common.services.js";
import HttpError from "#/common/errors/HttpError.js";
import { StatusCodes } from "http-status-codes";
import { diffIds } from "#/common/utils/diffid.js";

export async function createPackageDestinationsService(pkg, data, tx) {
  const items = [];
  if (!data.destinations || data.destinations.length === 0) {
    return items;
  }

  for (const [index, dest] of data.destinations.entries()) {
    const item = await s.commonCreateService(packageDestinations, {
      packageId: pkg.id,
      destinationId: dest.destinationId,
      destinationOrder: dest.order ?? index,
    }, tx);

    if (!item) {
      throw new HttpError("Failed to create package destination", StatusCodes.BAD_REQUEST);
    }

    items.push(item);
  }

  return items;
}

//===========================================================================================================

export async function createPackageDaysService(pkg, data, tx) {
  const items = [];
  if (!data.days || data.days.length === 0) {
    return items;
  }

  for (const day of data.days) {
    const item = await s.commonCreateService(packageDays, {
      packageId: pkg.id,
      day: day.dayNumber,
      title: day.title,
      description: day.description,
    }, tx);

    if (!item) {
      throw new HttpError("Failed to create package day", StatusCodes.BAD_REQUEST);
    }

    items.push(item);
  }

  return items;
}

//===========================================================================================================

export async function updatePackageDestinationsService(req, data, tx) {
  if (!data.destinations) {
    return {}; // field not sent — leave existing rows untouched
  }

  const existing = await tx
    .select({ destinationId: packageDestinations.destinationId, order: packageDestinations.destinationOrder })
    .from(packageDestinations)
    .where(eq(packageDestinations.packageId, req.params.id));

  const { remove, add, update } = diffIds(existing, data.destinations, {
    getId: (item) => item.destinationId,
    isEqual: (oldItem, newItem) => (newItem.order ?? 0) === oldItem.order,
  });

  for (const item of remove) {
    await tx.delete(packageDestinations).where(
      and(
        eq(packageDestinations.packageId, req.params.id),
        eq(packageDestinations.destinationId, item.destinationId)
      )
    );
  }

  for (const item of add) {
    await s.commonCreateService(packageDestinations, {
      packageId: req.params.id,
      destinationId: item.destinationId,
      destinationOrder: item.order ?? 0,
    }, tx);
  }

  for (const item of update) {
    await tx
      .update(packageDestinations)
      .set({ destinationOrder: item.order ?? 0 })
      .where(
        and(
          eq(packageDestinations.packageId, req.params.id),
          eq(packageDestinations.destinationId, item.destinationId)
        )
      );
  }

  return {
    remove: remove.map((item) => item.destinationId),
    add: add.map((item) => item.destinationId),
    updated: update.map((item) => item.destinationId),
  };
}

//===========================================================================================================

export async function updatePackageDaysService(req, data, tx) {
  if (!data.days) {
    return {}; // field not sent — leave existing rows untouched
  }

  const existing = await tx
    .select({ day: packageDays.day, title: packageDays.title, description: packageDays.description })
    .from(packageDays)
    .where(eq(packageDays.packageId, req.params.id));

  const { remove, add, update } = diffIds(existing, data.days, {
    getId: (item) => item.dayNumber ?? item.day, // incoming items use dayNumber, existing rows use day
    isEqual: (oldItem, newItem) =>
      newItem.title === oldItem.title && (newItem.description ?? null) === (oldItem.description ?? null),
  });

  for (const item of remove) {
    await tx.delete(packageDays).where(
      and(
        eq(packageDays.packageId, req.params.id),
        eq(packageDays.day, item.day)
      )
    );
  }

  for (const item of add) {
    await s.commonCreateService(packageDays, {
      packageId: req.params.id,
      day: item.dayNumber,
      title: item.title,
      description: item.description,
    }, tx);
  }

  for (const item of update) {
    await tx
      .update(packageDays)
      .set({ title: item.title, description: item.description })
      .where(
        and(
          eq(packageDays.packageId, req.params.id),
          eq(packageDays.day, item.dayNumber)
        )
      );
  }

  return {
    remove: remove.map((item) => item.day),
    add: add.map((item) => item.dayNumber),
    updated: update.map((item) => item.dayNumber),
  };
}
