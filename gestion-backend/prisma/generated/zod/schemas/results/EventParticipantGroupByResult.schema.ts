import { z } from 'zod';
export const EventParticipantGroupByResultSchema = z.array(z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string(),
  _count: z.object({
    id: z.number(),
    eventId: z.number(),
    event: z.number(),
    name: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    eventId: z.string().nullable(),
    name: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    eventId: z.string().nullable(),
    name: z.string().nullable()
  }).nullable().optional()
}));