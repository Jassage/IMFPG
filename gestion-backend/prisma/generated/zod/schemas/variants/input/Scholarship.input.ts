import { z } from 'zod';

// prettier-ignore
export const ScholarshipInputSchema = z.object({
    name: z.string(),
    description: z.string().optional().nullable(),
    amount: z.number(),
    criteria: z.string().optional().nullable(),
    applicationDeadline: z.date(),
    academicYearId: z.string(),
    academicYear: z.unknown(),
    maxRecipients: z.number().int(),
    currentRecipients: z.number().int(),
    status: z.string(),
    applications: z.array(z.unknown())
}).strict();

export type ScholarshipInputType = z.infer<typeof ScholarshipInputSchema>;
