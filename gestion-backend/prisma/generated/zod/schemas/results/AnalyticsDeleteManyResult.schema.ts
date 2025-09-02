import { z } from 'zod';
export const AnalyticsDeleteManyResultSchema = z.object({
  count: z.number()
});