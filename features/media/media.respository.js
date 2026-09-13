import { db } from "#/config/db.js"
import { media } from "../../db/schema"

export async function getImages(){

    const media = await db.select().from(media)

}