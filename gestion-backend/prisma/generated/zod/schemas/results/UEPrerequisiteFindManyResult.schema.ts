import { z } from 'zod';
export const UEPrerequisiteFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  ueId: z.string(),
  prerequisiteId: z.string(),
  ue: z.unknown(),
  prerequisite: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date()
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