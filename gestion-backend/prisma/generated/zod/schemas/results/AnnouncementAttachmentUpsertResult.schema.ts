import { z } from 'zod';
export const AnnouncementAttachmentUpsertResultSchema = z.object({
  id: z.string(),
  announcementId: z.string(),
  announcement: z.unknown(),
  url: z.string()
});