import { z } from 'zod';

// prettier-ignore
export const BookLoanResultSchema = z.object({
    id: z.string(),
    book: z.unknown(),
    bookId: z.string(),
    student: z.unknown(),
    studentId: z.string(),
    loanDate: z.date(),
    dueDate: z.date(),
    returnDate: z.date().nullable(),
    status: z.string(),
    renewalCount: z.number().int(),
    fine: z.number().nullable()
}).strict();

export type BookLoanResultType = z.infer<typeof BookLoanResultSchema>;
