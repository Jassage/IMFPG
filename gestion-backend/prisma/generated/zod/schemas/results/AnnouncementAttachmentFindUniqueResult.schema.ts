import { z } from 'zod';
export const AnnouncementAttachmentFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  announcementId: z.string(),
  announcement: z.unknown(),
  url: z.string()
}));