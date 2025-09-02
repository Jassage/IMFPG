import { z } from 'zod';

// prettier-ignore
export const FacultyModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    description: z.string().nullable(),
    dean: z.string().nullable(),
    studentsCount: z.number().int(),
    coursesCount: z.number().int(),
    studyDuration: z.number().int(),
    levels: z.array(z.unknown()),
    status: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    assignments: z.array(z.unknown()),
    enrollments: z.array(z.unknown())
}).strict();

export type FacultyModelType = z.infer<typeof FacultyModelSchema>;
