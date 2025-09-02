import { z } from 'zod';
export const RoomReservationCreateManyResultSchema = z.object({
  count: z.number()
});