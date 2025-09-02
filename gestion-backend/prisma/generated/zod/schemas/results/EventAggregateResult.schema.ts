import { z } from 'zod';
export const EventAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    title: z.number(),
    description: z.number(),
    startDate: z.number(),
    endDate: z.number(),
    location: z.number(),
    organizer: z.number(),
    category: z.number(),
    participants: z.number(),
    isPublic: z.number(),
    status: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    title: z.string().nullable(),
    description: z.string().nullable(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    location: z.string().nullable(),
    organizer: z.string().nullable(),
    category: z.string().nullable(),
    status: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    title: z.string().nullable(),
    description: z.string().nullable(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    location: z.string().nullable(),
    organizer: z.string().nullable(),
    category: z.string().nullable(),
    status: z.string().nullable()
  }).nullable().optional()});