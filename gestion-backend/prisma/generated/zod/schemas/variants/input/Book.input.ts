import { z } from 'zod';

// prettier-ignore
export const BookInputSchema = z.object({
    title: z.string(),
    author: z.string(),
    isbn: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    faculty: z.string().optional().nullable(),
    quantity: z.number().int(),
    available: z.number().int(),
    location: z.string().optional().nullable(),
    status: z.string(),
    bookLoans: z.array(z.unknown())
}).strict();

export type BookInputType = z.infer<typeof BookInputSchema>;
