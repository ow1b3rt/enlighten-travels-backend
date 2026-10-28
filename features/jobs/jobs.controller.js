import {
  insertJobSchema,
  updateJobSchema,
  selectJobSchema,
} from "./jobs.schema.js";

import {
  commonCreateService,
  commonGetService,
  commonGetSingleService,
  commonUpdateService,
  commonDeleteService,
  commonGetSingleServiceBySlug,
} from "#/common/feature/common.services.js";
import { join } from "#/common/utils/queryhelper.js";
import { eq, getTableColumns } from "drizzle-orm";
import { media } from "#/db/schema/media.js";

import { StatusCodes } from "http-status-codes";

import { jobs } from "#/db/schema/careers.js";
import { buildWhereFromQuery } from "#/common/utils/queryhelper.js";

function jobsWithMedia() {
  return join(jobs, media, {
    on: eq(jobs.content, media.id),
    name: "jobs",
    type: "left",
    fields: {
      ...getTableColumns(jobs),
      imgSrc: media.url,
    },
  });
}

export async function createJob(req, res) {
  const { data } = insertJobSchema.safeParse(req.body);

  const result = await commonCreateService(jobs, data);

  res.status(StatusCodes.CREATED).json({
    success: true,
    job: result,
  });
}

export async function updateJob(req, res) {
  const { data } = updateJobSchema.safeParse(req.body);

  const { id } = req.params;

  const result = await commonUpdateService(jobs, id, data);

  res.status(StatusCodes.OK).json({
    success: true,
    job: result,
  });
}

export async function getJobs(req, res) {

  const searchFields = [jobs.title, jobs.workingHours, jobs.salary];

  const filters = ["status", "job_id", "jobTitle"];

  const query = {
    search: req.query.search,
    page: req.query.page,
    pageSize: req.query.pageSize,
    searchFields: searchFields,
    orderBy: req.query.orderBy,
    where: buildWhereFromQuery(jobs, req.query, filters),
  };

  const result = await commonGetService(jobsWithMedia(), query);

  res.status(StatusCodes.OK).json({
    success: true,
    ...result,
  });
}

export async function getSingleJob(req, res) {
  // const {id}=req.params;

  const result = await commonGetSingleService(jobs, req.params.id);

  res.status(StatusCodes.OK).json({
    success: true,
    resource: "jobs",
    item: result,
  });
}
export async function getSingleJobBySlug(req, res) {
  const result = await commonGetSingleServiceBySlug(
    jobsWithMedia(),
    req.params.slug,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    resource: "jobs",
    item: result,
  });
}

export async function deleteJob(req, res) {
  const result = await commonDeleteService(jobs, req.params.id);

  res.status(StatusCodes.OK).json({
    sucess: true,
    ...result,
  });
}
