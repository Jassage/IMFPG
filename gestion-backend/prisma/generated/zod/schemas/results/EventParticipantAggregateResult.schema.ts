import { z } from 'zod';
export const EventParticipantAggregateResultSchema = z.object({  _count: z.object({
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
  }).nullable().optional()});