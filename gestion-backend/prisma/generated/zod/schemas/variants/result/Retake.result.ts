import { z } from 'zod';

import { RetakeStatusSchema } from '../../enums/RetakeStatus.schema';
// prettier-ignore
export const RetakeResultSchema = z.object({
    id: z.string(),
    student: z.unknown(),
    studentId: z.string(),
    ue: z.unknown(),
    ueId: z.string(),
    originalGrade: z.number(),
    retakeGrade: z.number().nullable(),
    scheduledSemester: z.string(),
    status: RetakeStatusSchema
}).strict();

export type RetakeResultType = z.infer<typeof RetakeResultSchema>;
