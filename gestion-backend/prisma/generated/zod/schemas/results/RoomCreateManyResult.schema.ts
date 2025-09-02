import { z } from 'zod';
export const RoomCreateManyResultSchema = z.object({
  count: z.number()
});