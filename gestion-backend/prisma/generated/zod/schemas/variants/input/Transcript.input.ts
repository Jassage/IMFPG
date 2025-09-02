import { z } from 'zod';

// prettier-ignore
export const TranscriptInputSchema = z.object({
    student: z.unknown(),
    studentId: z.string(),
    semester: z.string(),
    academicYear: z.string(),
    gpa: z.number().optional().nullable(),
    totalCredits: z.number().int().optional().nullable(),
    creditsEarned: z.number().int().optional().nullable(),
    generatedDate: z.date(),
    grades: z.array(z.unknown())
}).strict();

export type TranscriptInputType = z.infer<typeof TranscriptInputSchema>;
