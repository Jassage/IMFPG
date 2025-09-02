import { z } from 'zod';
export const ScheduleFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  assignment: z.unknown(),
  assignmentId: z.string(),
  dayOfWeek: z.number().int(),
  startTime: z.string(),
  endTime: z.string(),
  classroom: z.string().optional(),
  recurrence: z.string().optional(),
  exceptions: z.unknown().optional(),
  professeur: z.unknown().optional(),
  professeurId: z.string().optional(),
  attendances: z.array(z.unknown()),
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