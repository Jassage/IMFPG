import { z } from 'zod';
export const RoomEquipmentUpsertResultSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  room: z.unknown(),
  name: z.string()
});