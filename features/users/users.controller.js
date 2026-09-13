import { StatusCodes } from "http-status-codes";

import { createUserSchema, deleteUserSchema, updateUserSchema } from "./users.schema.js";
import { parseBody } from "../../common/utils/parse.js";
import {
  createUserService,
  deleteUserService,
  getUsersService,
  updateUserService,
} from "./users.services.js";

export async function createUser(req, res) {
  const data = parseBody(createUserSchema, req.body);
  const result = await createUserService(data);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "User created successfully",
    user: result.user,
  });
}

export async function updateUserController(req, res) {
  
  const data = parseBody(updateUserSchema, req.body);
  
  const result = await updateUserService(req.params.id, data);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "User updated successfully",
    user: result.user,
  });
}

export async function deleteUser(req, res) {
  const data = parseBody(deleteUserSchema, req.params);

  await deleteUserService(data);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "User deleted successfully",
  });
}

export async function getUsers(req, res) {
  const users = await getUsersService();

  res.status(StatusCodes.OK).json({
    success: true,
    users,
  });
}
