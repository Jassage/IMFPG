import { z } from 'zod';
export const RoomEquipmentFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  roomId: z.string(),
  room: z.unknown(),
  name: z.string()
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});