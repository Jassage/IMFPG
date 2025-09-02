import { z } from 'zod';
export const BookFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  isbn: z.string().optional(),
  category: z.string().optional(),
  faculty: z.string().optional(),
  quantity: z.number().int(),
  available: z.number().int(),
  location: z.string().optional(),
  status: z.string(),
  bookLoans: z.array(z.unknown())
}));