import { z } from 'zod';

// prettier-ignore
export const ScholarshipDocumentResultSchema = z.object({
    id: z.string(),
    scholarshipApplicationId: z.string(),
    scholarshipApplication: z.unknown(),
    url: z.string()
}).strict();

export type ScholarshipDocumentResultType = z.infer<typeof ScholarshipDocumentResultSchema>;
