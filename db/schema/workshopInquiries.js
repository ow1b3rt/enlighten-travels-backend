import * as t from "drizzle-orm/pg-core";
import { pkid, timestamps } from "./helpers.js";

export const workshopTypeEnum = t.pgEnum("workshop_type", [
  "team_building_workshop",
  "corporate_team_building",
  "leadership_workshop",
  "outdoor_team_activity",
  "customized_workshop",
  "other",
]);

export const participantRangeEnum = t.pgEnum("participant_range", [
  "0-10",
  "10-20",
  "20-50",
]);

export const preferredTimeEnum = t.pgEnum("preferred_time", [
  "morning",
  "afternoon",
  "full_day",
]);

export const inquiryStatusEnum = t.pgEnum("inquiry_status", [
  "new",
  "contacted",
  "converted",
  "closed",
]);

export const workshopInquiries = t.pgTable("workshop_inquiries", {
  ...pkid,
  ...timestamps,

  name: t.varchar("name", { length: 255 }).notNull(),
  email: t.varchar("email", { length: 255 }).notNull(),
  phone: t.varchar("phone", { length: 50 }).notNull(),
  status: inquiryStatusEnum("status").notNull().default("new"),
  org: t.varchar("org", { length: 255 }).notNull(),

  workshopDetails: workshopTypeEnum("workshop_details").notNull(),
  participants: participantRangeEnum("participants").notNull(),
  preferredTime: preferredTimeEnum("preferred_time").notNull(),

  additionalInformation: t.text("additional_information"),
});
