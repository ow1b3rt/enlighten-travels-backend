import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { destinations } from "#/db/schema/index.js";
import { z } from "zod";

export const createDestinationSchema = createInsertSchema(destinations)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    gallery: z.array(z.uuid()).optional(),
  });

export const updateDestinationSchema = createUpdateSchema(destinations)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    gallery: z.array(z.uuid()).optional(),
  });
