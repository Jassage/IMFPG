import { z } from 'zod';
export const MessageAttachmentFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  messageId: z.string(),
  message: z.unknown(),
  url: z.string()
}));