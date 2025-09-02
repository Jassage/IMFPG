import { z } from 'zod';

// prettier-ignore
export const ScheduleInputSchema = z.object({
    assignment: z.unknown(),
    assignmentId: z.string(),
    dayOfWeek: z.number().int(),
    startTime: z.string(),
    endTime: z.string(),
    classroom: z.string().optional().nullable(),
    recurrence: z.string().optional().nullable(),
    exceptions: z.unknown().optional().nullable(),
    professeur: z.unknown().optional().nullable(),
    professeurId: z.string().optional().nullable(),
    attendances: z.array(z.unknown())
}).strict();

export type ScheduleInputType = z.infer<typeof ScheduleInputSchema>;
