import { z } from 'zod';
export const ScholarshipDocumentAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    scholarshipApplicationId: z.number(),
    scholarshipApplication: z.number(),
    url: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    scholarshipApplicationId: z.string().nullable(),
    url: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    scholarshipApplicationId: z.string().nullable(),
    url: z.string().nullable()
  }).nullable().optional()});