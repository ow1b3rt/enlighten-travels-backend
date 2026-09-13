import { Router } from "express";
import { join } from "#/common/utils/queryhelper.js";
import { desc, eq } from "drizzle-orm";
import { media } from "#/db/schema/media.js";
import { getTableColumns } from "drizzle-orm";
import {
  commonCreateController,
  commonGetController,
  commonGetSingleController,
} from "#/common/feature/common.controller.js";

import {
  authenticateUser,
  authorizePermissions,
} from "#/common/authentication/auth.js";
import {
  commonDeleteController,
  commonGetSingleBySlugController,
  commonUpdateController,
} from "../../common/feature/common.controller.js";

import { testimonials } from "../../db/schema/testimonials.js";
import {
  createSuccessSchema,
  updateSuccessSchema,
} from "./testimonials.schema.js";

const router = Router();

router
  .route("/")
  .get((req, res) =>
    commonGetController(
      req,
      res,
      join(testimonials, media, {
        on: eq(testimonials.image, media.id),
        name: "testimonials",
        fields: {
          ...getTableColumns(testimonials),
          mediaUrl: media.url,
          mediaType: media.type,
          mediaAlt: media.alt,
        },
        type: "left",
      }),
      [],
      desc(testimonials.createdAt),
    ),
  )
  .post(authenticateUser, authorizePermissions("admin"), (req, res) =>
    commonCreateController(req, res, testimonials, createSuccessSchema),
  );

router.route("/:id").get((req, res) =>
  commonGetSingleController(
    req,
    res,
    join(testimonials, media, {
      on: eq(testimonials.image, media.id),
      name: "testimonials",
      fields: {
        ...getTableColumns(testimonials),
        mediaUrl: media.url,
        mediaType: media.type,
      },
      type: "left",
    }),
  ),
);

router.route("/slug/:slug").get((req, res) =>
  commonGetSingleBySlugController(
    req,
    res,
    join(testimonials, media, {
      on: eq(testimonials.image, media.id),
      name: "testimonials",
      fields: {
        ...getTableColumns(testimonials),
        mediaUrl: media.url,
        mediaType: media.type,
      },
      type: "left",
    }),
  ),
);

router
  .route("/:id")
  .all(authenticateUser, authorizePermissions("admin"))
  .patch((req, res) =>
    commonUpdateController(req, res, testimonials, updateSuccessSchema),
  )
  .delete((req, res) => commonDeleteController(req, res, testimonials));

export default router;
