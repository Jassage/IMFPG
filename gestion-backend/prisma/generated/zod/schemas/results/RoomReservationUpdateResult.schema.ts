import { z } from 'zod';
export const RoomReservationUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  room: z.unknown(),
  roomId: z.string(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  purpose: z.string().optional(),
  status: z.string()
}));