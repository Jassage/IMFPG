import { z } from 'zod';
export const FacultyFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  description: z.string().optional(),
  dean: z.string().optional(),
  studentsCount: z.number().int(),
  coursesCount: z.number().int(),
  studyDuration: z.number().int(),
  levels: z.array(z.unknown()),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  assignments: z.array(z.unknown()),
  enrollments: z.array(z.unknown())
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