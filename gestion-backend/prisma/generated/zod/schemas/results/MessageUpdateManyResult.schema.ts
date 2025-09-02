import { z } from 'zod';
export const MessageUpdateManyResultSchema = z.object({
  count: z.number()
});