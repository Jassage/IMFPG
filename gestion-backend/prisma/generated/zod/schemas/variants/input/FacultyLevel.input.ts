import { z } from 'zod';

// prettier-ignore
export const FacultyLevelInputSchema = z.object({
    facultyId: z.string(),
    faculty: z.unknown(),
    level: z.string(),
    assignments: z.array(z.unknown())
}).strict();

export type FacultyLevelInputType = z.infer<typeof FacultyLevelInputSchema>;
