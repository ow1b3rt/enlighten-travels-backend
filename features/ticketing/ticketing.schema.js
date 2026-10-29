// src/features/tickets/tickets.schema.js
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { tickets, ticketStatusEnum, travelModeEnum } from "#/db/schema/index.js";

export const insertTicketSchema = createInsertSchema(tickets, {
    customerEmail: (s) => s.email(),
}).omit({ id: true, createdAt: true, updatedAt: true, status: true });

export const updateTicketStatusSchema = z.object({
    status: z.enum(ticketStatusEnum.enumValues),
});
