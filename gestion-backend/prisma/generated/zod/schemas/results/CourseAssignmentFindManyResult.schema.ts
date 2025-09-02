import { z } from 'zod';
export const CourseAssignmentFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  ue: z.unknown(),
  ueId: z.string(),
  faculty: z.unknown(),
  facultyId: z.string(),
  professeur: z.unknown(),
  professeurId: z.string(),
  academicYearId: z.string(),
  academicYear: z.unknown(),
  semester: z.unknown(),
  level: z.string(),
  facultyLevel: z.unknown().optional(),
  facultyLevelId: z.string().optional(),
  schedules: z.array(z.unknown()),
  status: z.string(),
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