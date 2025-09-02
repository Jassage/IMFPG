import { z } from 'zod';

// prettier-ignore
export const BookResultSchema = z.object({
    id: z.string(),
    title: z.string(),
    author: z.string(),
    isbn: z.string().nullable(),
    category: z.string().nullable(),
    faculty: z.string().nullable(),
    quantity: z.number().int(),
    available: z.number().int(),
    location: z.string().nullable(),
    status: z.string(),
    bookLoans: z.array(z.unknown())
}).strict();

export type BookResultType = z.infer<typeof BookResultSchema>;
