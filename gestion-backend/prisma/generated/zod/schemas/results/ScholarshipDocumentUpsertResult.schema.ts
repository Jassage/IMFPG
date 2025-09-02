import { z } from 'zod';
export const ScholarshipDocumentUpsertResultSchema = z.object({
  id: z.string(),
  scholarshipApplicationId: z.string(),
  scholarshipApplication: z.unknown(),
  url: z.string()
});