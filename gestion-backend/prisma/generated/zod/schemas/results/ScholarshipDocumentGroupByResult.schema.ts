import { z } from 'zod';
export const ScholarshipDocumentGroupByResultSchema = z.array(z.object({
  id: z.string(),
  scholarshipApplicationId: z.string(),
  url: z.string(),
  _count: z.object({
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
  }).nullable().optional()
}));