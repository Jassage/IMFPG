import { z } from 'zod';
export const RoomFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  equipment: z.array(z.unknown()),
  location: z.string().optional(),
  status: z.string(),
  reservations: z.array(z.unknown())
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