import { z } from 'zod';

// prettier-ignore
export const EventParticipantModelSchema = z.object({
    id: z.string(),
    eventId: z.string(),
    event: z.unknown(),
    name: z.string()
}).strict();

export type EventParticipantModelType = z.infer<typeof EventParticipantModelSchema>;
