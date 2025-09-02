import { z } from 'zod';

import { RetakeStatusSchema } from '../../enums/RetakeStatus.schema';
// prettier-ignore
export const RetakeInputSchema = z.object({
    student: z.unknown(),
    studentId: z.string(),
    ue: z.unknown(),
    ueId: z.string(),
    originalGrade: z.number(),
    retakeGrade: z.number().optional().nullable(),
    scheduledSemester: z.string(),
    status: RetakeStatusSchema
}).strict();

export type RetakeInputType = z.infer<typeof RetakeInputSchema>;
