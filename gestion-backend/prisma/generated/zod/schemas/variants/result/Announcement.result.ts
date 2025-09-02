import { z } from 'zod';

// prettier-ignore
export const AnnouncementResultSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    authorId: z.string(),
    publishDate: z.date(),
    expiryDate: z.date().nullable(),
    targetAudience: z.string(),
    priority: z.string(),
    attachments: z.array(z.unknown()),
    isActive: z.boolean()
}).strict();

export type AnnouncementResultType = z.infer<typeof AnnouncementResultSchema>;
