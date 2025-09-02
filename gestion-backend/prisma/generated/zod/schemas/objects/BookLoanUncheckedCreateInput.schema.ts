import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookLoanUncheckedCreateInputObjectSchema: z.ZodType<Prisma.BookLoanUncheckedCreateInput, z.ZodTypeDef, Prisma.BookLoanUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  bookId: z.string(),
  studentId: z.string(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullish(),
  status: z.string(),
  renewalCount: z.number().int().optional(),
  fine: z.number().nullish()
}).strict();
export const BookLoanUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  bookId: z.string(),
  studentId: z.string(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullish(),
  status: z.string(),
  renewalCount: z.number().int().optional(),
  fine: z.number().nullish()
}).strict();
