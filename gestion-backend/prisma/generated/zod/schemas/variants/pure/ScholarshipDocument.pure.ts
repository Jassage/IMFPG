import { z } from 'zod';

// prettier-ignore
export const ScholarshipDocumentModelSchema = z.object({
    id: z.string(),
    scholarshipApplicationId: z.string(),
    scholarshipApplication: z.unknown(),
    url: z.string()
}).strict();

export type ScholarshipDocumentModelType = z.infer<typeof ScholarshipDocumentModelSchema>;
