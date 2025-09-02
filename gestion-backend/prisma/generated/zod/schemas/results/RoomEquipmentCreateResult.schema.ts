import { z } from 'zod';
export const RoomEquipmentCreateResultSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  room: z.unknown(),
  name: z.string()
});