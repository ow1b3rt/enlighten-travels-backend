import { commonFindById, commonUpdate } from "../../common/feature/common.repository.js";
import { comparator } from "../../common/utils/patcher.js";
import { authors } from "../../db/schema/index.js";
import { updateUserSchema } from "../users/users.schema.js";
import { updateUserService } from "../users/users.services.js";
import HttpError from "#/common/errors/HttpError.js";
import { StatusCodes } from "http-status-codes";
import { emptyObject } from "#/common/utils/objectutils.js";
import { updateAuthorSchema } from "./authors.schema.js";
import { parseBody } from '#/common/utils/parse.js';


export async function updateAuthorService(id, data) {
  const existingAuthor = await commonFindById(authors, id)

  if (!existingAuthor) {
      throw new HttpError(`Author with id ${id} does not exist`, StatusCodes.NOT_FOUND)
  }

  const authordata = parseBody(updateAuthorSchema, data)

  const changes = comparator(existingAuthor, authordata)
  const updatedAuthor = emptyObject(changes) ? existingAuthor : await commonUpdate(authors, id, changes)

  const userdata = parseBody(updateUserSchema, data)

  const updatedUser = await updateUserService(existingAuthor.userId, userdata)


  return { updatedAuthor, updatedUser }
}
