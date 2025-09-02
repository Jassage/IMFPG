import { z } from 'zod';

// prettier-ignore
export const AnnouncementInputSchema = z.object({
    title: z.string(),
    content: z.string(),
    authorId: z.string(),
    publishDate: z.date(),
    expiryDate: z.date().optional().nullable(),
    targetAudience: z.string(),
    priority: z.string(),
    attachments: z.array(z.unknown()),
    isActive: z.boolean()
}).strict();

export type AnnouncementInputType = z.infer<typeof AnnouncementInputSchema>;
