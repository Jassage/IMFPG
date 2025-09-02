import { z } from 'zod';
export const FacultyLevelGroupByResultSchema = z.array(z.object({
  id: z.string(),
  facultyId: z.string(),
  level: z.string(),
  _count: z.object({
    id: z.number(),
    facultyId: z.number(),
    faculty: z.number(),
    level: z.number(),
    assignments: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    facultyId: z.string().nullable(),
    level: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    facultyId: z.string().nullable(),
    level: z.string().nullable()
  }).nullable().optional()
}));