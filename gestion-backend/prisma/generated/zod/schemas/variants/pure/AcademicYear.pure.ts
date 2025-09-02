import { z } from 'zod';

// prettier-ignore
export const AcademicYearModelSchema = z.object({
    id: z.string(),
    year: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    isCurrent: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    grades: z.array(z.unknown()),
    enrollments: z.array(z.unknown()),
    assignments: z.array(z.unknown()),
    payments: z.array(z.unknown()),
    scholarship: z.array(z.unknown())
}).strict();

export type AcademicYearModelType = z.infer<typeof AcademicYearModelSchema>;
