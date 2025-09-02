import { z } from 'zod';
export const EventParticipantUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  eventId: z.string(),
  event: z.unknown(),
  name: z.string()
}));