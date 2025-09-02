import { z } from 'zod';

// prettier-ignore
export const EventParticipantResultSchema = z.object({
    id: z.string(),
    eventId: z.string(),
    event: z.unknown(),
    name: z.string()
}).strict();

export type EventParticipantResultType = z.infer<typeof EventParticipantResultSchema>;
