import { z } from 'zod';
export const AnnouncementAttachmentDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  announcementId: z.string(),
  announcement: z.unknown(),
  url: z.string()
}));