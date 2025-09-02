import { z } from 'zod';

import { GradeStatusSchema } from '../../enums/GradeStatus.schema';
import { SessionTypeSchema } from '../../enums/SessionType.schema';
// prettier-ignore
export const GradeModelSchema = z.object({
    id: z.string(),
    student: z.unknown(),
    studentId: z.string(),
    ue: z.unknown(),
    ueId: z.string(),
    grade: z.number(),
    status: GradeStatusSchema,
    session: SessionTypeSchema,
    semester: z.string(),
    level: z.string(),
    academicYearId: z.string(),
    academicYear: z.unknown(),
    createdAt: z.date(),
    transcript: z.unknown().nullable(),
    transcriptId: z.string().nullable(),
    professeur: z.unknown().nullable(),
    professeurId: z.string().nullable()
}).strict();

export type GradeModelType = z.infer<typeof GradeModelSchema>;
