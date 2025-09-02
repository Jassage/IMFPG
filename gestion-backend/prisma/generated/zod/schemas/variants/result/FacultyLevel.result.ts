import { z } from 'zod';

// prettier-ignore
export const FacultyLevelResultSchema = z.object({
    id: z.string(),
    facultyId: z.string(),
    faculty: z.unknown(),
    level: z.string(),
    assignments: z.array(z.unknown())
}).strict();

export type FacultyLevelResultType = z.infer<typeof FacultyLevelResultSchema>;
