import { z } from 'zod';
export const ScholarshipDocumentFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  scholarshipApplicationId: z.string(),
  scholarshipApplication: z.unknown(),
  url: z.string()
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});