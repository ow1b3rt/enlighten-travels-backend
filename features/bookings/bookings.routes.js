import { Router } from "express";

import {
    commonCreateController,
    commonDeleteController,
    commonGetController,
    commonGetSingleController,
    commonUpdateController,
} from "../../common/feature/common.controller.js";
import { bookings, packages } from "#/db/schema/index.js";
import { insertBookingSchema, updateBookingStatusSchema } from "./bookings.schema.js";
import { join } from "#/common/utils/queryhelper.js";
import { getTableColumns, eq } from 'drizzle-orm'

import {
    authenticateUser,
    authorizePermissions,
} from "#/common/authentication/auth.js";

export const router = Router();

router
    .route("/")
    .post((req, res) =>
        commonCreateController(req, res, bookings, insertBookingSchema),
    )
    .get(authenticateUser, authorizePermissions("admin"), (req, res) =>
      commonGetController(req, res, 
        join(bookings, packages, {
          on: eq(bookings.packageId, packages.id),
          fields: {
            ...getTableColumns(bookings),
            packageName: packages.title,
            packagePrice: packages.price,
          },
        }),
        [bookings.customerName, bookings.customerEmail, packages.name],
        undefined,
        ["status"],
      ),
    );

router
    .route("/:id")
    .all(authenticateUser, authorizePermissions("admin"))
    .get((req, res) => commonGetSingleController(req, res, 
      join(bookings, packages, {
        on: eq(bookings.packageId, packages.id),
        fields: {
          ...getTableColumns(bookings),
          packageName: packages.title,
          packagePrice: packages.price,
        },
      }),
    ))
    .patch((req, res) =>
        commonUpdateController(req, res, bookings, updateBookingStatusSchema),
    )
    .delete((req, res) => commonDeleteController(req, res, bookings));

export default router;
