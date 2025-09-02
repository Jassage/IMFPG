import { z } from 'zod';
export const AnalyticsFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  type: z.string(),
  data: z.unknown(),
  generatedDate: z.date(),
  parameters: z.unknown()
}));