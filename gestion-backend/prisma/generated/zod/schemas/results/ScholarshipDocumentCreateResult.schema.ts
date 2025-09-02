import { z } from 'zod';
export const ScholarshipDocumentCreateResultSchema = z.object({
  id: z.string(),
  scholarshipApplicationId: z.string(),
  scholarshipApplication: z.unknown(),
  url: z.string()
});