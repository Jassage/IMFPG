import { z } from 'zod';
export const RoomFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  equipment: z.array(z.unknown()),
  location: z.string().optional(),
  status: z.string(),
  reservations: z.array(z.unknown())
}));