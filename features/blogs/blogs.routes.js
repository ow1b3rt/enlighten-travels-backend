import { Router } from "express";

import {
    authenticateUser,
    optionalAuthenticateUser,
} from "../../common/authentication/auth.js";
import { commonGetSingleController } from "../../common/feature/common.controller.js";
import { blogs, media } from "../../db/schema/index.js";
import { join } from "../../common/utils/queryhelper.js";
import { eq, getTableColumns } from "drizzle-orm";

import {
    createBlog,
    deleteBlog,
    getBlogBySlug,
    getBlogs,
    updateBlog,
} from "./blogs.controller.js";

const router = Router();

router
    .route("/")
    .get(optionalAuthenticateUser, getBlogs)
    .post(authenticateUser, createBlog);

router
    .route("/:id")
    .patch(authenticateUser, updateBlog)
    .delete(authenticateUser, deleteBlog)
    .get((req, res) => commonGetSingleController(req, res, 
      join(blogs, media, {
        on: eq(blogs.thumbnail, media.id),
        type: "left",
        name: 'blogs',
        fields: {
          ...getTableColumns(blogs),
          thumbnailUrl: media.url,
        },
      }
    )));

router.get("/slug/:slug", optionalAuthenticateUser, getBlogBySlug);

export default router;
