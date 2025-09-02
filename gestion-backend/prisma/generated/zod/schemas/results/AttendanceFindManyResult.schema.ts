import { z } from 'zod';
export const AttendanceFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  student: z.unknown(),
  studentId: z.string(),
  schedule: z.unknown(),
  scheduleId: z.string(),
  date: z.date(),
  status: z.string(),
  notes: z.string().optional(),
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