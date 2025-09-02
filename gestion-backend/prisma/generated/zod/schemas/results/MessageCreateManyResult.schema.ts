import { z } from 'zod';
export const MessageCreateManyResultSchema = z.object({
  count: z.number()
});