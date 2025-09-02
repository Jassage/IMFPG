import { z } from 'zod';

// prettier-ignore
export const AttendanceInputSchema = z.object({
    student: z.unknown(),
    studentId: z.string(),
    schedule: z.unknown(),
    scheduleId: z.string(),
    date: z.date(),
    status: z.string(),
    notes: z.string().optional().nullable()
}).strict();

export type AttendanceInputType = z.infer<typeof AttendanceInputSchema>;
