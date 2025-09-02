import { z } from 'zod';
export const MessageAttachmentCreateResultSchema = z.object({
  id: z.string(),
  messageId: z.string(),
  message: z.unknown(),
  url: z.string()
});