import { z } from 'zod';

// prettier-ignore
export const RoomEquipmentModelSchema = z.object({
    id: z.string(),
    roomId: z.string(),
    room: z.unknown(),
    name: z.string()
}).strict();

export type RoomEquipmentModelType = z.infer<typeof RoomEquipmentModelSchema>;
