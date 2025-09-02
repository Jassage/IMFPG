import { z } from 'zod';

import { SemesterSchema } from '../../enums/Semester.schema';
// prettier-ignore
export const CourseAssignmentModelSchema = z.object({
    id: z.string(),
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
    facultyLevel: z.unknown().nullable(),
    facultyLevelId: z.string().nullable(),
    schedules: z.array(z.unknown()),
    status: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type CourseAssignmentModelType = z.infer<typeof CourseAssignmentModelSchema>;
