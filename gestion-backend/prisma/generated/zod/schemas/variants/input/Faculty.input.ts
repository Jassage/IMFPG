import { z } from 'zod';

// prettier-ignore
export const FacultyInputSchema = z.object({
    name: z.string(),
    code: z.string(),
    description: z.string().optional().nullable(),
    dean: z.string().optional().nullable(),
    studentsCount: z.number().int(),
    coursesCount: z.number().int(),
    studyDuration: z.number().int(),
    levels: z.array(z.unknown()),
    status: z.string(),
    assignments: z.array(z.unknown()),
    enrollments: z.array(z.unknown())
}).strict();

export type FacultyInputType = z.infer<typeof FacultyInputSchema>;
