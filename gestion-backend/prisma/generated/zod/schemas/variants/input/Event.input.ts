import { z } from 'zod';

// prettier-ignore
export const EventInputSchema = z.object({
    title: z.string(),
    description: z.string().optional().nullable(),
    startDate: z.date(),
    endDate: z.date(),
    location: z.string().optional().nullable(),
    organizer: z.string().optional().nullable(),
    category: z.string(),
    participants: z.array(z.unknown()),
    isPublic: z.boolean(),
    status: z.string()
}).strict();

export type EventInputType = z.infer<typeof EventInputSchema>;
