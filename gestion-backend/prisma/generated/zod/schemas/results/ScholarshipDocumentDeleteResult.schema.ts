import { z } from 'zod';
export const ScholarshipDocumentDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  scholarshipApplicationId: z.string(),
  scholarshipApplication: z.unknown(),
  url: z.string()
}));