import { z } from 'zod';
export const EventParticipantFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  eventId: z.string(),
  event: z.unknown(),
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