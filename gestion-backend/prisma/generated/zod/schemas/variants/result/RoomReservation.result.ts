import { z } from 'zod';

// prettier-ignore
export const RoomReservationResultSchema = z.object({
    id: z.string(),
    room: z.unknown(),
    roomId: z.string(),
    userId: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    purpose: z.string().nullable(),
    status: z.string()
}).strict();

export type RoomReservationResultType = z.infer<typeof RoomReservationResultSchema>;
