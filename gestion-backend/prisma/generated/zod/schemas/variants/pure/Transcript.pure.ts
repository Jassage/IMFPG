import { z } from 'zod';

// prettier-ignore
export const TranscriptModelSchema = z.object({
    id: z.string(),
    student: z.unknown(),
    studentId: z.string(),
    semester: z.string(),
    academicYear: z.string(),
    gpa: z.number().nullable(),
    totalCredits: z.number().int().nullable(),
    creditsEarned: z.number().int().nullable(),
    generatedDate: z.date(),
    grades: z.array(z.unknown())
}).strict();

export type TranscriptModelType = z.infer<typeof TranscriptModelSchema>;
