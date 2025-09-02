import { z } from 'zod';
export const EventParticipantUpsertResultSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  event: z.unknown(),
  name: z.string()
});