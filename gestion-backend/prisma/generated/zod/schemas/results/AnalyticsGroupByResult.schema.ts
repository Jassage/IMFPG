import { z } from 'zod';
export const AnalyticsGroupByResultSchema = z.array(z.object({
  id: z.string(),
  type: z.string(),
  data: z.unknown(),
  generatedDate: z.date(),
  parameters: z.unknown(),
  _count: z.object({
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
  }).nullable().optional()
}));