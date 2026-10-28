import * as t from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { pkid, timestamps } from "./helpers.js";
import { media } from "./media.js";

export const Statusenum = t.pgEnum("career_status", [
  "pending",
  "shortlisted",
  "interviewed",
  "hired",
  "rejected",
]);

export const applicationTypeEnum = t.pgEnum("application_type", [
  "Full-Time", "Part-Time", "Internship", "Contract",
]);

export const careers = t.pgTable("careers", {
  ...pkid,
  ...timestamps,

  full_name: t.varchar("full_name", { length: 255 }).notNull(),
  email: t.varchar("email", { length: 255 }).notNull(),
  phone: t.varchar("phone", { length: 15 }).notNull(),
  job_id: t.uuid("job_id").notNull().references(() => jobs.id),
  resume: t.uuid("resume").notNull().references(() => media.id),
  description: t.text("description").notNull(),
  portfolio: t.varchar("portfolio", { length: 255 }),
  status: Statusenum("status").notNull().default("pending"),

  location: t.varchar("location", { length: 255 }),
  linkedin: t.varchar("linkedin", { length: 255 }),
  applicationType: applicationTypeEnum("application_type"),

  highestQualification: t.varchar("highest_qualification", { length: 100 }),
  fieldOfStudy: t.varchar("field_of_study", { length: 255 }),
  institutionName: t.varchar("institution_name", { length: 255 }),
  graduationYear: t.varchar("graduation_year", { length: 4 }),

  totalExperience: t.varchar("total_experience", { length: 50 }),
  currentPosition: t.varchar("current_position", { length: 255 }),

  declarationAccepted: t.boolean("declaration_accepted"),
});
export const jobs = t.pgTable("jobs", {
  ...pkid,
  ...timestamps,

  title: t.varchar("title", { length: 255 }).notNull(),
  slug: t
    .varchar("slug", { length: 255 })
    .notNull()
    .generatedAlwaysAs(
      sql`lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\\s-]', '', 'g'), '\\s+', '-', 'g'))`,
    )
    .unique(),
  description: t.text("description").notNull(),
  salary: t.varchar("salary", { length: 255 }).notNull(),
  experience: t.varchar("experience", { length: 255 }),
  content: t.uuid("content").references(() => media.id),
  workingHours: t.varchar("workingHours", { length: 255 }),
});
