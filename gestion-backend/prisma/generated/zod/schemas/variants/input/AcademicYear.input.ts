import { z } from 'zod';

// prettier-ignore
export const AcademicYearInputSchema = z.object({
    year: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    isCurrent: z.boolean(),
    grades: z.array(z.unknown()),
    enrollments: z.array(z.unknown()),
    assignments: z.array(z.unknown()),
    payments: z.array(z.unknown()),
    scholarship: z.array(z.unknown())
}).strict();

export type AcademicYearInputType = z.infer<typeof AcademicYearInputSchema>;
