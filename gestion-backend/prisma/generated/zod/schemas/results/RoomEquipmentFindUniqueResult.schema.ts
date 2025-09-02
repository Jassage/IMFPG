import { z } from 'zod';
export const RoomEquipmentFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  roomId: z.string(),
  room: z.unknown(),
  name: z.string()
}));