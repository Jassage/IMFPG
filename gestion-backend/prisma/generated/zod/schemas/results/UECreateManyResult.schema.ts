import { z } from 'zod';
export const UECreateManyResultSchema = z.object({
  count: z.number()
});