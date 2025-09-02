import { z } from 'zod';
export const AnalyticsAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    type: z.number(),
    data: z.number(),
    generatedDate: z.number(),
    parameters: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    type: z.string().nullable(),
    generatedDate: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    type: z.string().nullable(),
    generatedDate: z.date().nullable()
  }).nullable().optional()});