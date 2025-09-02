import { z } from 'zod';
export const BookLoanCreateManyResultSchema = z.object({
  count: z.number()
});