import { z } from 'zod';

// prettier-ignore
export const EventParticipantInputSchema = z.object({
    eventId: z.string(),
    event: z.unknown(),
    name: z.string()
}).strict();

export type EventParticipantInputType = z.infer<typeof EventParticipantInputSchema>;
