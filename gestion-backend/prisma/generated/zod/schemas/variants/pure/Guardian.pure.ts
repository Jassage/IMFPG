import { z } from 'zod';

// prettier-ignore
export const GuardianModelSchema = z.object({
    id: z.string(),
    student: z.unknown(),
    studentId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    relationship: z.string(),
    phone: z.string().nullable(),
    email: z.string().nullable(),
    address: z.string().nullable(),
    isPrimary: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type GuardianModelType = z.infer<typeof GuardianModelSchema>;
