import { z } from 'zod';
export const MessageAttachmentUpsertResultSchema = z.object({
  id: z.string(),
  messageId: z.string(),
  message: z.unknown(),
  url: z.string()
});