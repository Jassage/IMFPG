import { z } from 'zod';
export const BookDeleteManyResultSchema = z.object({
  count: z.number()
});