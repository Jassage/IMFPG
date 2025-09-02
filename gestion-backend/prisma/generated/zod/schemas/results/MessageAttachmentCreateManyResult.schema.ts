import { z } from 'zod';
export const MessageAttachmentCreateManyResultSchema = z.object({
  count: z.number()
});