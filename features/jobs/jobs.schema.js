import {createInsertSchema,createUpdateSchema,createSelectSchema} from "drizzle-zod";
import {jobs} from "#/db/schema/careers.js";


export const insertJobSchema=createInsertSchema(jobs)
export const updateJobSchema=createUpdateSchema(jobs)
export const selectJobSchema=createSelectSchema(jobs)