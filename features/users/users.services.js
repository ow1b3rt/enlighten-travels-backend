import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import HttpError from "../../common/errors/HttpError.js";
import {
  findUserByEmail,
  createUser,
  findUserById,
  deleteUser,
  findAllUsers,
  updateUser,
} from "./users.repository.js";
import { comparator } from "../../common/utils/patcher.js";
import { emptyObject } from "../../common/utils/objectutils.js";

export async function createUserService(data) {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new HttpError("Email is already registered", StatusCodes.CONFLICT);
  }

  if (data.role == "admin") {
    throw new HttpError("Cannot create admin user", StatusCodes.FORBIDDEN);
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await createUser({
    name: data.name,
    email: data.email,
    role: data.role,
    password: passwordHash,
    avatar: data.avatar,
  });

  return user;
}

export async function deleteUserService(data) {
  const user = await findUserById(data.id);

  if (!user) {
    throw new HttpError("User not found", StatusCodes.NOT_FOUND);
  }
  await deleteUser(user.id);
}

export async function updateUserService(id, userData) {
  const existingUser = await findUserById(id);

  if (!existingUser) {
    throw new HttpError(`User with id ${id} does not exist`, StatusCodes.NOT_FOUND);
  }

  if (existingUser.role === "admin") {
    throw new HttpError("Cannot update admin user", StatusCodes.FORBIDDEN);
  }

  if (userData.role === "admin") {
    throw new HttpError("Cannot make admin user", StatusCodes.FORBIDDEN);
  }

  const changes = comparator(existingUser, userData)

  
  if(changes.password) changes.password = await bcrypt.hash(changes.password, 12)


  const filteredUser = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
    createdAt: existingUser.createdAt,
  }

  const updatedUser = emptyObject(changes) ? filteredUser : await updateUser(id, changes);
  return updatedUser;
}

export async function getUsersService() {
  const users = await findAllUsers();
  return users;
}
