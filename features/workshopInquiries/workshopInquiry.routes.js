import { Router } from "express";

import {
    commonCreateController,
    commonDeleteController,
    commonGetController,
    commonGetSingleController,
    commonUpdateController,
} from "../../common/feature/common.controller.js";
import { workshopInquiries } from "#/db/schema/workshopInquiries.js";
import { 
  insertWorkshopInquirySchema,
  updateWorkshopInquiryStatusSchema
} from "./workshopInquiry.schema.js";

import {
    authenticateUser,
    authorizePermissions,
} from "#/common/authentication/auth.js";

export const router = Router();

router
    .route("/")
    .post((req, res) =>
        commonCreateController(req, res, workshopInquiries, insertWorkshopInquirySchema),
    )
    .get(authenticateUser, authorizePermissions("admin"), (req, res) =>
        commonGetController(req, res, workshopInquiries),
    );

router
    .route("/:id")
    .all(authenticateUser, authorizePermissions("admin"))
    .get((req, res) => commonGetSingleController(req, res, workshopInquiries))
    .patch((req, res) =>
        commonUpdateController(req, res, workshopInquiries, updateWorkshopInquiryStatusSchema),
    )
    .delete((req, res) => commonDeleteController(req, res, workshopInquiries));

export default router;
