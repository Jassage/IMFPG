import { z } from 'zod';

// prettier-ignore
export const PaymentInputSchema = z.object({
    student: z.unknown(),
    studentId: z.string(),
    amount: z.number(),
    type: z.string(),
    moyen: z.string(),
    status: z.string(),
    paidDate: z.date().optional().nullable(),
    description: z.string().optional().nullable(),
    academicYearId: z.string(),
    academicYear: z.unknown()
}).strict();

export type PaymentInputType = z.infer<typeof PaymentInputSchema>;
