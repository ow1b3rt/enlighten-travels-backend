import { StatusCodes } from "http-status-codes";
import { commonCreateService } from "../../common/feature/common.services.js";
import { parseBody } from "../../common/utils/parse.js";
import { media } from "../../db/schema/index.js";
import { createMediaSchema } from "./media.schema.js";

export async function createMediaController(req, res) {
    const file =
        req.files?.media ||
        req.files?.profilePics ||
        req.files?.thumbnails ||
        req.files?.documents;

    let url = file?.[0]?.path.split("/").slice(-3).join("/");



    url = "/" + url;

    req.body.url = url

    const data = parseBody(createMediaSchema, req.body);

    const result = await commonCreateService(media, data)

    res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Media uploaded successfuly",
        ...result
    })

}
