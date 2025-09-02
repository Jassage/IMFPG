import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookLoanCreateManyStudentInputObjectSchema: z.ZodType<Prisma.BookLoanCreateManyStudentInput, z.ZodTypeDef, Prisma.BookLoanCreateManyStudentInput> = z.object({
  id: z.string().optional(),
  bookId: z.string(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullish(),
  status: z.string(),
  renewalCount: z.number().int().optional(),
  fine: z.number().nullish()
}).strict();
export const BookLoanCreateManyStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  bookId: z.string(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullish(),
  status: z.string(),
  renewalCount: z.number().int().optional(),
  fine: z.number().nullish()
}).strict();
