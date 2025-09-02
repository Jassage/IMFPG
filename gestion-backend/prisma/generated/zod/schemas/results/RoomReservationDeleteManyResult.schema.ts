import { z } from 'zod';
export const RoomReservationDeleteManyResultSchema = z.object({
  count: z.number()
});