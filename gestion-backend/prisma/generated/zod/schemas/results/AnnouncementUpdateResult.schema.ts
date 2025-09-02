import { z } from 'zod';
export const AnnouncementUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  publishDate: z.date(),
  expiryDate: z.date().optional(),
  targetAudience: z.string(),
  priority: z.string(),
  attachments: z.array(z.unknown()),
  isActive: z.boolean()
}));