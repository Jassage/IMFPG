import { z } from 'zod';

// prettier-ignore
export const AnnouncementAttachmentModelSchema = z.object({
    id: z.string(),
    announcementId: z.string(),
    announcement: z.unknown(),
    url: z.string()
}).strict();

export type AnnouncementAttachmentModelType = z.infer<typeof AnnouncementAttachmentModelSchema>;
