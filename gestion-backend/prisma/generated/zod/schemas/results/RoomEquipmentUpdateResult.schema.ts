import { z } from 'zod';
export const RoomEquipmentUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  roomId: z.string(),
  room: z.unknown(),
  name: z.string()
}));