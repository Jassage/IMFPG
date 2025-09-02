import { z } from 'zod';

// prettier-ignore
export const ScholarshipResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    amount: z.number(),
    criteria: z.string().nullable(),
    applicationDeadline: z.date(),
    academicYearId: z.string(),
    academicYear: z.unknown(),
    maxRecipients: z.number().int(),
    currentRecipients: z.number().int(),
    status: z.string(),
    applications: z.array(z.unknown())
}).strict();

export type ScholarshipResultType = z.infer<typeof ScholarshipResultSchema>;
