// src/features/tickets/tickets.router.js
import { Router } from "express";

import {
    commonCreateController,
    commonDeleteController,
    commonGetController,
    commonGetSingleController,
    commonUpdateController,
} from "../../common/feature/common.controller.js";
import { tickets, destinations } from "#/db/schema/index.js";
import { insertTicketSchema, updateTicketStatusSchema } from "./ticketing.schema.js";
import { join } from "#/common/utils/queryhelper.js";
import { getTableColumns, eq } from "drizzle-orm";

import {
    authenticateUser,
    authorizePermissions,
} from "#/common/authentication/auth.js";

export const router = Router();

const ticketsWithDestination = () =>
    join(tickets, destinations, {
        on: eq(tickets.destinationId, destinations.id),
        fields: {
            ...getTableColumns(tickets),
            destinationName: destinations.name,
        },
    });

router
    .route("/")
    .post((req, res) =>
        commonCreateController(req, res, tickets, insertTicketSchema),
    )
    .get(authenticateUser, authorizePermissions("admin"), (req, res) =>
        commonGetController(
            req,
            res,
            ticketsWithDestination(),
            [
                tickets.customerName,
                tickets.customerEmail,
                tickets.origin,
                destinations.name,
            ],
            undefined,
            ["status", "travelMode"],
        ),
    );

router
    .route("/:id")
    .all(authenticateUser, authorizePermissions("admin"))
    .get((req, res) =>
        commonGetSingleController(req, res, ticketsWithDestination()),
    )
    .patch((req, res) =>
        commonUpdateController(req, res, tickets, updateTicketStatusSchema),
    )
    .delete((req, res) => commonDeleteController(req, res, tickets));

export default router;
