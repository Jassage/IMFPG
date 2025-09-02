import { z } from 'zod';

// prettier-ignore
export const GuardianInputSchema = z.object({
    student: z.unknown(),
    studentId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    relationship: z.string(),
    phone: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    isPrimary: z.boolean()
}).strict();

export type GuardianInputType = z.infer<typeof GuardianInputSchema>;
