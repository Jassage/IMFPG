import { z } from 'zod';
export const UEPrerequisiteAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    ueId: z.number(),
    prerequisiteId: z.number(),
    ue: z.number(),
    prerequisite: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    ueId: z.string().nullable(),
    prerequisiteId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    ueId: z.string().nullable(),
    prerequisiteId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});