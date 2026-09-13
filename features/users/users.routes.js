import { Router } from "express";
import { createUser, deleteUser, getUsers, updateUserController } from "./users.controller.js";
import { authenticateUser, authorizePermissions } from "../../common/authentication/auth.js";
import { commonGetController, commonGetSingleController } from "#/common/feature/common.controller.js";
import { users } from "#/db/schema/users.js";

const router = Router();

router.route("/").all(authenticateUser, authorizePermissions("admin"))
  .get((req, res) => commonGetController(req, res, users, [users.name, users.email], undefined, ["role"]))
  .post(createUser);

router.route("/:id").all(authenticateUser, authorizePermissions("admin"))
  .patch(updateUserController)
  .delete(deleteUser)
  .get((req, res) => commonGetSingleController(req, res, users));

export default router;
