import { z } from 'zod';

// prettier-ignore
export const RoomEquipmentResultSchema = z.object({
    id: z.string(),
    roomId: z.string(),
    room: z.unknown(),
    name: z.string()
}).strict();

export type RoomEquipmentResultType = z.infer<typeof RoomEquipmentResultSchema>;
