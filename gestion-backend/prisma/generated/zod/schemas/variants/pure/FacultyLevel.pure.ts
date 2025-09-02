import { z } from 'zod';

// prettier-ignore
export const FacultyLevelModelSchema = z.object({
    id: z.string(),
    facultyId: z.string(),
    faculty: z.unknown(),
    level: z.string(),
    assignments: z.array(z.unknown())
}).strict();

export type FacultyLevelModelType = z.infer<typeof FacultyLevelModelSchema>;
