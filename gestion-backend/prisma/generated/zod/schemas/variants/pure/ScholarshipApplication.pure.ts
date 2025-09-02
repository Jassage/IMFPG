import { z } from 'zod';

// prettier-ignore
export const ScholarshipApplicationModelSchema = z.object({
    id: z.string(),
    scholarship: z.unknown(),
    scholarshipId: z.string(),
    student: z.unknown(),
    studentId: z.string(),
    applicationDate: z.date(),
    documents: z.array(z.unknown()),
    motivation: z.string().nullable(),
    status: z.string(),
    reviewNotes: z.string().nullable()
}).strict();

export type ScholarshipApplicationModelType = z.infer<typeof ScholarshipApplicationModelSchema>;
