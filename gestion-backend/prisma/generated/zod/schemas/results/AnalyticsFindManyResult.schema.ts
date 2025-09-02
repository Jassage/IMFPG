import { z } from 'zod';
export const AnalyticsFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  type: z.string(),
  data: z.unknown(),
  generatedDate: z.date(),
  parameters: z.unknown()
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