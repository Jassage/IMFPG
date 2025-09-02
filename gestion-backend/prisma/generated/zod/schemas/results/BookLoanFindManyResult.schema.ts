import { z } from 'zod';
export const BookLoanFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  book: z.unknown(),
  bookId: z.string(),
  student: z.unknown(),
  studentId: z.string(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().optional(),
  status: z.string(),
  renewalCount: z.number().int(),
  fine: z.number().optional()
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