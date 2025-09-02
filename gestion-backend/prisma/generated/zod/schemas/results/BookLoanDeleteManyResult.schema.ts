import { z } from 'zod';
export const BookLoanDeleteManyResultSchema = z.object({
  count: z.number()
});