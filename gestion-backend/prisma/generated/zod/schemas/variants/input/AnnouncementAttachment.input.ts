import { z } from 'zod';

// prettier-ignore
export const AnnouncementAttachmentInputSchema = z.object({
    announcementId: z.string(),
    announcement: z.unknown(),
    url: z.string()
}).strict();

export type AnnouncementAttachmentInputType = z.infer<typeof AnnouncementAttachmentInputSchema>;
