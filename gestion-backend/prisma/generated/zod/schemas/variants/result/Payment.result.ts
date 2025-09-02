import { z } from 'zod';

// prettier-ignore
export const PaymentResultSchema = z.object({
    id: z.string(),
    student: z.unknown(),
    studentId: z.string(),
    amount: z.number(),
    type: z.string(),
    moyen: z.string(),
    status: z.string(),
    paidDate: z.date().nullable(),
    description: z.string().nullable(),
    academicYearId: z.string(),
    academicYear: z.unknown(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type PaymentResultType = z.infer<typeof PaymentResultSchema>;
