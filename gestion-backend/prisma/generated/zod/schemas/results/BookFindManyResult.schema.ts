import { z } from 'zod';
export const BookFindManyResultSchema = z.object({
  data: z.array(z.object({
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
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});