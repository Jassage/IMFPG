import { z } from 'zod';

// prettier-ignore
export const RoomModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    capacity: z.number().int(),
    equipment: z.array(z.unknown()),
    location: z.string().nullable(),
    status: z.string(),
    reservations: z.array(z.unknown())
}).strict();

export type RoomModelType = z.infer<typeof RoomModelSchema>;
