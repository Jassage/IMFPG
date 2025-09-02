import { z } from 'zod';
export const FacultyDeleteResultSchema = z.nullable(z.object({
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
}));