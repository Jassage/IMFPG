import { z } from 'zod';
export const ScholarshipDocumentFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  scholarshipApplicationId: z.string(),
  scholarshipApplication: z.unknown(),
  url: z.string()
}));