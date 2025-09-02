import { z } from 'zod';

import { SemesterSchema } from '../../enums/Semester.schema';
// prettier-ignore
export const CourseAssignmentInputSchema = z.object({
    ue: z.unknown(),
    ueId: z.string(),
    faculty: z.unknown(),
    facultyId: z.string(),
    professeur: z.unknown(),
    professeurId: z.string(),
    academicYearId: z.string(),
    academicYear: z.unknown(),
    semester: SemesterSchema,
    level: z.string(),
    facultyLevel: z.unknown().optional().nullable(),
    facultyLevelId: z.string().optional().nullable(),
    schedules: z.array(z.unknown()),
    status: z.string()
}).strict();

export type CourseAssignmentInputType = z.infer<typeof CourseAssignmentInputSchema>;
