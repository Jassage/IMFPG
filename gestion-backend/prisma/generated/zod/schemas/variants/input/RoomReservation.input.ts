import { z } from 'zod';

// prettier-ignore
export const RoomReservationInputSchema = z.object({
    room: z.unknown(),
    roomId: z.string(),
    userId: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    purpose: z.string().optional().nullable(),
    status: z.string()
}).strict();

export type RoomReservationInputType = z.infer<typeof RoomReservationInputSchema>;
