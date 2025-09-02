import { z } from 'zod';
export const RoomReservationFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  room: z.unknown(),
  roomId: z.string(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  purpose: z.string().optional(),
  status: z.string()
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