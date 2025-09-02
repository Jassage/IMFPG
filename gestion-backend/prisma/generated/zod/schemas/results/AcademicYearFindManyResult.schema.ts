import { z } from 'zod';
export const AcademicYearFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  year: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isCurrent: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  grades: z.array(z.unknown()),
  enrollments: z.array(z.unknown()),
  assignments: z.array(z.unknown()),
  payments: z.array(z.unknown()),
  scholarship: z.array(z.unknown())
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