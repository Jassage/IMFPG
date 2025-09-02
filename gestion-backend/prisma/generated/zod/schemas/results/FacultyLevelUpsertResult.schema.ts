import { z } from 'zod';
export const FacultyLevelUpsertResultSchema = z.object({
  id: z.string(),
  facultyId: z.string(),
  faculty: z.unknown(),
  level: z.string(),
  assignments: z.array(z.unknown())
});