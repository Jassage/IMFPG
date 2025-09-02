import { z } from 'zod';

// prettier-ignore
export const ScholarshipApplicationInputSchema = z.object({
    scholarship: z.unknown(),
    scholarshipId: z.string(),
    student: z.unknown(),
    studentId: z.string(),
    applicationDate: z.date(),
    documents: z.array(z.unknown()),
    motivation: z.string().optional().nullable(),
    status: z.string(),
    reviewNotes: z.string().optional().nullable()
}).strict();

export type ScholarshipApplicationInputType = z.infer<typeof ScholarshipApplicationInputSchema>;
