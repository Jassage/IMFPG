import { z } from 'zod';
export const MessageAttachmentDeleteManyResultSchema = z.object({
  count: z.number()
});