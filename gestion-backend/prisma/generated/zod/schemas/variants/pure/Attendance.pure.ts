import { z } from 'zod';

// prettier-ignore
export const AttendanceModelSchema = z.object({
    id: z.string(),
    student: z.unknown(),
    studentId: z.string(),
    schedule: z.unknown(),
    scheduleId: z.string(),
    date: z.date(),
    status: z.string(),
    notes: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type AttendanceModelType = z.infer<typeof AttendanceModelSchema>;
