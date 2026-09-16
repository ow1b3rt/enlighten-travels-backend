import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { packages, packageDestinations, packageDays } from "#/db/schema/index.js";
import { z } from "zod";

export const createPackageSchema = createInsertSchema(packages)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    slug: true, // slug will be generated from name
  })
  .extend({
    destinations: z.array(z.object({
      destinationId: z.string().uuid(),
      order: z.number().int().optional(),
    })).optional(),
    days: z.array(z.object({
      dayNumber: z.number().int(),
      title: z.string(),
      description: z.string().optional(),
    })).optional(),
    gallery: z.array(z.uuid()).optional(),
  });

export const updatePackageSchema = createUpdateSchema(packages)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    slug: true, // slug will be generated from name
  })
  .extend({
    destinations: z.array(z.object({
      destinationId: z.string().uuid(),
      order: z.number().int().optional(),
    })).optional(),
    days: z.array(z.object({
      dayNumber: z.number().int(),
      title: z.string(),
      description: z.string().optional(),
    })).optional(),
    gallery: z.array(z.uuid()).optional(),
  });
