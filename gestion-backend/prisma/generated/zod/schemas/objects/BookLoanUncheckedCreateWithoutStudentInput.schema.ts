import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookLoanUncheckedCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.BookLoanUncheckedCreateWithoutStudentInput, z.ZodTypeDef, Prisma.BookLoanUncheckedCreateWithoutStudentInput> = z.object({
  id: z.string().optional(),
  bookId: z.string(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullish(),
  status: z.string(),
  renewalCount: z.number().int().optional(),
  fine: z.number().nullish()
}).strict();
export const BookLoanUncheckedCreateWithoutStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  bookId: z.string(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullish(),
  status: z.string(),
  renewalCount: z.number().int().optional(),
  fine: z.number().nullish()
}).strict();
