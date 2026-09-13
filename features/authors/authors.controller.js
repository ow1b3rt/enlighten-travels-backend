import { createUserSchema } from "../users/users.schema.js";
import { createUserService } from "../users/users.services.js";
import { insertAuthorSchema, updateAuthorSchema } from "./authors.schema.js";
import HttpError from "../../common/errors/HttpError.js";
import { StatusCodes } from "http-status-codes";
import { commonCreateService, commonDeleteService, commonGetSingleService } from "../../common/feature/common.services.js";
import { commonFindById } from "../../common/feature/common.repository.js";
import { authors, users } from "../../db/schema/index.js";
import { updateAuthorService } from "./authors.services.js";
import { parseBody } from "../../common/utils/parse.js";


export async function createAuthorController(req, res) {
  req.body.role = "author";
  const userdata = parseBody(createUserSchema, req.body);

  const user = await createUserService(userdata)
  if (!user) {
    throw new HttpError("Failed to create author user", StatusCodes.INTERNAL_SERVER_ERROR);
  }

  req.body.userId = user.id;
  const authordata = parseBody(insertAuthorSchema, req.body);

  const author = await commonCreateService(authors, authordata);
  if (!author) {
    throw new HttpError("Failed to create author profile", StatusCodes.INTERNAL_SERVER_ERROR);
  }

  res.status(StatusCodes.CREATED).json({
    success: true,
    author: {
      name: user.name,
      email: user.email,
      role: user.role,
      ...author,
    }
  });
}

export async function updateAuthorController(req, res) {
  const { id } = req.params;
  req.body.role = "author";

  const result = await updateAuthorService(id, req.body);

  res.status(StatusCodes.OK).json({
    success: true,
    ...result
  });
}

export async function deleteAuthorController(req, res) {
  const { id } = req.params;

  const author = await commonGetSingleService(authors, id);
  const user = await commonGetSingleService(users, author.userId);

  if (!user || user.role !== "author") {
    throw new HttpError("User not found or not an author", StatusCodes.NOT_FOUND);
  }

  await commonDeleteService(users, user.id);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Author with id ${id} and associated user deleted successfully`
  });
}

