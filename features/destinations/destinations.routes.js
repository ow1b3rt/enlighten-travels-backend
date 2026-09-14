import { Router } from 'express';
import {
    authenticateUser,
    authorizePermissions,
} from '#/common/authentication/auth.js';
import * as c from "#/common/feature/common.controller.js";
import { destinations } from '#/db/schema/index.js';
import { createDestinationSchema, updateDestinationSchema } from './destinations.schema.js';
import { createDestinationController, updateDestinationController, getSingleDestinationController } from './destinations.controller.js';


const router = Router();

router.route('/')
  .get((req, res) => c.commonGetController(
    req, res, destinations, [destinations.name, destinations.description],
    undefined, ["type"]
  ))
  .post(authenticateUser, authorizePermissions("author", "admin", "editor"), createDestinationController);

router.route('/:id')
  .get(getSingleDestinationController)
  .patch(authenticateUser, authorizePermissions("author", "admin", "editor"), updateDestinationController)
  .delete(authenticateUser, authorizePermissions("author", "admin", "editor"),
    (req, res) => c.commonDeleteController(req, res, destinations)
  );

export default router;
