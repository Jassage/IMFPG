import { z } from 'zod';
export const FacultyLevelCreateResultSchema = z.object({
  id: z.string(),
  facultyId: z.string(),
  faculty: z.unknown(),
  level: z.string(),
  assignments: z.array(z.unknown())
});