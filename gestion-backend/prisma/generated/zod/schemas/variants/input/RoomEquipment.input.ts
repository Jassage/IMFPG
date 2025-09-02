import { z } from 'zod';

// prettier-ignore
export const RoomEquipmentInputSchema = z.object({
    roomId: z.string(),
    room: z.unknown(),
    name: z.string()
}).strict();

export type RoomEquipmentInputType = z.infer<typeof RoomEquipmentInputSchema>;
