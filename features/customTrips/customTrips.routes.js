import { Router } from "express";

import {
    commonCreateController,
    commonDeleteController,
    commonGetController,
    commonGetSingleController,
} from "../../common/feature/common.controller.js";
import { customTrips } from "#/db/schema/index.js";
import { insertCustomTripSchema } from "./customTrips.schema.js";

import {
    authenticateUser,
    authorizePermissions,
} from "#/common/authentication/auth.js";

export const router = Router();

router
    .route("/")
    .post((req, res) =>
        commonCreateController(req, res, customTrips, insertCustomTripSchema),
    )
    .get(authenticateUser, authorizePermissions("admin"), (req, res) =>
        commonGetController(req, res, customTrips),
    );

router
    .route("/:id")
    .all(authenticateUser, authorizePermissions("admin"))
    .get((req, res) => commonGetSingleController(req, res, customTrips))
    .delete((req, res) => commonDeleteController(req, res, customTrips));

export default router;
