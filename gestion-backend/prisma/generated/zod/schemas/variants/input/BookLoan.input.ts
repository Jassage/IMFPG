import { z } from 'zod';

// prettier-ignore
export const BookLoanInputSchema = z.object({
    book: z.unknown(),
    bookId: z.string(),
    student: z.unknown(),
    studentId: z.string(),
    loanDate: z.date(),
    dueDate: z.date(),
    returnDate: z.date().optional().nullable(),
    status: z.string(),
    renewalCount: z.number().int(),
    fine: z.number().optional().nullable()
}).strict();

export type BookLoanInputType = z.infer<typeof BookLoanInputSchema>;
