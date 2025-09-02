import { z } from 'zod';
export const AnalyticsCreateManyResultSchema = z.object({
  count: z.number()
});