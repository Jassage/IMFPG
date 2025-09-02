import { z } from 'zod';

import { EnrollmentStatusSchema } from '../../enums/EnrollmentStatus.schema';
// prettier-ignore
export const EnrollmentInputSchema = z.object({
    student: z.unknown(),
    studentId: z.string(),
    faculty: z.unknown(),
    facultyId: z.string(),
    level: z.string(),
    academicYearId: z.string(),
    academicYear: z.unknown(),
    enrollmentDate: z.date(),
    status: EnrollmentStatusSchema
}).strict();

export type EnrollmentInputType = z.infer<typeof EnrollmentInputSchema>;
