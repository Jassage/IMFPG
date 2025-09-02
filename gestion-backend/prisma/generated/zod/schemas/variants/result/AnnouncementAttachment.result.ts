import { z } from 'zod';

// prettier-ignore
export const AnnouncementAttachmentResultSchema = z.object({
    id: z.string(),
    announcementId: z.string(),
    announcement: z.unknown(),
    url: z.string()
}).strict();

export type AnnouncementAttachmentResultType = z.infer<typeof AnnouncementAttachmentResultSchema>;
