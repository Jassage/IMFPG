import { z } from 'zod';
export const BookLoanGroupByResultSchema = z.array(z.object({
  id: z.string(),
  bookId: z.string(),
  studentId: z.string(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date(),
  status: z.string(),
  renewalCount: z.number().int(),
  fine: z.number(),
  _count: z.object({
    id: z.number(),
    book: z.number(),
    bookId: z.number(),
    student: z.number(),
    studentId: z.number(),
    loanDate: z.number(),
    dueDate: z.number(),
    returnDate: z.number(),
    status: z.number(),
    renewalCount: z.number(),
    fine: z.number()
  }).optional(),
  _sum: z.object({
    renewalCount: z.number().nullable(),
    fine: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    renewalCount: z.number().nullable(),
    fine: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    bookId: z.string().nullable(),
    studentId: z.string().nullable(),
    loanDate: z.date().nullable(),
    dueDate: z.date().nullable(),
    returnDate: z.date().nullable(),
    status: z.string().nullable(),
    renewalCount: z.number().int().nullable(),
    fine: z.number().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    bookId: z.string().nullable(),
    studentId: z.string().nullable(),
    loanDate: z.date().nullable(),
    dueDate: z.date().nullable(),
    returnDate: z.date().nullable(),
    status: z.string().nullable(),
    renewalCount: z.number().int().nullable(),
    fine: z.number().nullable()
  }).nullable().optional()
}));