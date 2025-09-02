import { z } from 'zod';
export const RetakeFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  student: z.unknown(),
  studentId: z.string(),
  ue: z.unknown(),
  ueId: z.string(),
  originalGrade: z.number(),
  retakeGrade: z.number().optional(),
  scheduledSemester: z.string(),
  status: z.unknown()
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