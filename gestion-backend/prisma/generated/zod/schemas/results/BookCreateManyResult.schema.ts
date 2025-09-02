import { z } from 'zod';
export const BookCreateManyResultSchema = z.object({
  count: z.number()
});