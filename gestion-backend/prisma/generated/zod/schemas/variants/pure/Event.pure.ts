import { z } from 'zod';

// prettier-ignore
export const EventModelSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    startDate: z.date(),
    endDate: z.date(),
    location: z.string().nullable(),
    organizer: z.string().nullable(),
    category: z.string(),
    participants: z.array(z.unknown()),
    isPublic: z.boolean(),
    status: z.string()
}).strict();

export type EventModelType = z.infer<typeof EventModelSchema>;
