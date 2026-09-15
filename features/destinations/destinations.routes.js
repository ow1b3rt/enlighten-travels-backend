import { Router } from 'express';
import {
    authenticateUser,
    authorizePermissions,
} from '#/common/authentication/auth.js';
import * as c from "#/common/feature/common.controller.js";
import { destinations, media } from '#/db/schema/index.js';
import { createDestinationSchema, updateDestinationSchema } from './destinations.schema.js';
import { 
  createDestinationController, updateDestinationController, getSingleDestinationController,
  getSingleDestinationBySlugController
} from './destinations.controller.js';
import { eq, getTableColumns } from 'drizzle-orm';
import { join } from '#/common/utils/queryhelper.js';


const router = Router();

router.route('/')
  .get((req, res) => c.commonGetController(
    req, res, 
    join(destinations, media, {
      on: eq(destinations.thumbnail, media.id),
      name: 'destinations',
      type: 'left',
      fields: {
        ...getTableColumns(destinations),
        thumbnailUrl: media.url,
      },
    }),
    [destinations.name, destinations.description],
    undefined, ["type"]
  ))
  .post(authenticateUser, authorizePermissions("author", "admin", "editor"), createDestinationController);

router.route('/:id')
  .get(getSingleDestinationController)
  .patch(authenticateUser, authorizePermissions("author", "admin", "editor"), updateDestinationController)
  .delete(authenticateUser, authorizePermissions("author", "admin", "editor"),
    (req, res) => c.commonDeleteController(req, res, destinations)
  );

router.route('/slug/:slug')
  .get(getSingleDestinationBySlugController);

export default router;
