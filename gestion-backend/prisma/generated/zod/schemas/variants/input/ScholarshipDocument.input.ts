import { z } from 'zod';

// prettier-ignore
export const ScholarshipDocumentInputSchema = z.object({
    scholarshipApplicationId: z.string(),
    scholarshipApplication: z.unknown(),
    url: z.string()
}).strict();

export type ScholarshipDocumentInputType = z.infer<typeof ScholarshipDocumentInputSchema>;
