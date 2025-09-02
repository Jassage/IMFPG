import { z } from 'zod';
export const AnalyticsCreateResultSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.unknown(),
  generatedDate: z.date(),
  parameters: z.unknown()
});