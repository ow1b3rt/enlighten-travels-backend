import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { workshopInquiries } from "#/db/schema/workshopInquiries.js";

export const insertWorkshopInquirySchema = createInsertSchema(workshopInquiries, {
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(1, "Phone number is required"),
    org: z.string().min(1, "Company/Organization is required"),
    workshopDetails: z.enum([
        "team_building_workshop",
        "corporate_team_building",
        "leadership_workshop",
        "outdoor_team_activity",
        "customized_workshop",
        "other",
    ]),
    participants: z.enum(["0-10", "10-20", "20-50"]),
    preferredTime: z.enum(["morning", "afternoon", "full_day"]),
    additionalInformation: z.string().optional(),
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

// workshopInquiry.schema.js — add
export const updateWorkshopInquiryStatusSchema = z.object({
    status: z.enum(["new", "contacted", "converted", "closed"]),
});
