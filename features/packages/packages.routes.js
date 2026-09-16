import { Router } from 'express';
import {
    authenticateUser,
    authorizePermissions,
} from '#/common/authentication/auth.js';
import * as c from "#/common/feature/common.controller.js";
import { packages } from '#/db/schema/index.js';
import { createPackageSchema, updatePackageSchema } from './packages.schema.js';
import {
  createPackageController,
  updatePackageController,
  getSinglePackageController,
  getPackagesController,
  getSinglePackageBySlugController,
} from './packages.controller.js';


const router = Router();

router.route('/')
  .get(getPackagesController)
  .post(authenticateUser, authorizePermissions("author", "admin", "editor"), createPackageController);

router.route('/:id')
  .get(getSinglePackageController)
  .patch(authenticateUser, authorizePermissions("author", "admin", "editor"), updatePackageController)
  .delete(authenticateUser, authorizePermissions("author", "admin", "editor"),
    (req, res) => c.commonDeleteController(req, res, packages)
  );

router.route('/slug/:slug')
  .get(getSinglePackageBySlugController);

export default router;
