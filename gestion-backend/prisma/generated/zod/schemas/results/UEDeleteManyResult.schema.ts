import { z } from 'zod';
export const UEDeleteManyResultSchema = z.object({
  count: z.number()
});