import { z } from 'zod';

// prettier-ignore
export const RoomInputSchema = z.object({
    name: z.string(),
    type: z.string(),
    capacity: z.number().int(),
    equipment: z.array(z.unknown()),
    location: z.string().optional().nullable(),
    status: z.string(),
    reservations: z.array(z.unknown())
}).strict();

export type RoomInputType = z.infer<typeof RoomInputSchema>;
