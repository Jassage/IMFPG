import { z } from 'zod';
export const AnalyticsUpsertResultSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.unknown(),
  generatedDate: z.date(),
  parameters: z.unknown()
});