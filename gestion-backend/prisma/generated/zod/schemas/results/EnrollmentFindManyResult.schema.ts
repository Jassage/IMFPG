import { z } from 'zod';
export const EnrollmentFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  student: z.unknown(),
  studentId: z.string(),
  faculty: z.unknown(),
  facultyId: z.string(),
  level: z.string(),
  academicYearId: z.string(),
  academicYear: z.unknown(),
  enrollmentDate: z.date(),
  status: z.unknown(),
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