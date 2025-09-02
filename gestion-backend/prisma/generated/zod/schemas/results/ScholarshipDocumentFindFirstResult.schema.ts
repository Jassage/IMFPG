import { z } from 'zod';
export const ScholarshipDocumentFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  scholarshipApplicationId: z.string(),
  scholarshipApplication: z.unknown(),
  url: z.string()
}));