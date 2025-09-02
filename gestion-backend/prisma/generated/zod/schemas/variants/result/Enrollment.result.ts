import { z } from 'zod';

import { EnrollmentStatusSchema } from '../../enums/EnrollmentStatus.schema';
// prettier-ignore
export const EnrollmentResultSchema = z.object({
    id: z.string(),
    student: z.unknown(),
    studentId: z.string(),
    faculty: z.unknown(),
    facultyId: z.string(),
    level: z.string(),
    academicYearId: z.string(),
    academicYear: z.unknown(),
    enrollmentDate: z.date(),
    status: EnrollmentStatusSchema,
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type EnrollmentResultType = z.infer<typeof EnrollmentResultSchema>;
