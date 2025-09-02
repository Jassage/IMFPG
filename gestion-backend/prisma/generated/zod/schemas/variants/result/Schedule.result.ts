import { z } from 'zod';

// prettier-ignore
export const ScheduleResultSchema = z.object({
    id: z.string(),
    assignment: z.unknown(),
    assignmentId: z.string(),
    dayOfWeek: z.number().int(),
    startTime: z.string(),
    endTime: z.string(),
    classroom: z.string().nullable(),
    recurrence: z.string().nullable(),
    exceptions: z.unknown().nullable(),
    professeur: z.unknown().nullable(),
    professeurId: z.string().nullable(),
    attendances: z.array(z.unknown()),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type ScheduleResultType = z.infer<typeof ScheduleResultSchema>;
