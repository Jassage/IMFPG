import { z } from 'zod';

import { GradeStatusSchema } from '../../enums/GradeStatus.schema';
import { SessionTypeSchema } from '../../enums/SessionType.schema';
// prettier-ignore
export const GradeInputSchema = z.object({
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
    transcript: z.unknown().optional().nullable(),
    transcriptId: z.string().optional().nullable(),
    professeur: z.unknown().optional().nullable(),
    professeurId: z.string().optional().nullable()
}).strict();

export type GradeInputType = z.infer<typeof GradeInputSchema>;
