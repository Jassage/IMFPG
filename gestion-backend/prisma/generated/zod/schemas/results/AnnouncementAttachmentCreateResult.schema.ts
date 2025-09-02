import { z } from 'zod';
export const AnnouncementAttachmentCreateResultSchema = z.object({
  id: z.string(),
  announcementId: z.string(),
  announcement: z.unknown(),
  url: z.string()
});