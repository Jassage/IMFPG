import { z } from 'zod';
export const MessageAttachmentFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  messageId: z.string(),
  message: z.unknown(),
  url: z.string()
}));