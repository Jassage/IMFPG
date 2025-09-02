import { z } from 'zod';
export const BookLoanCreateResultSchema = z.object({
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
});