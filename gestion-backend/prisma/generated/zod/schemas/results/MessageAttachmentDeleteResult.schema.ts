import { z } from 'zod';
export const MessageAttachmentDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  messageId: z.string(),
  message: z.unknown(),
  url: z.string()
}));