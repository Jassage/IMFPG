import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookLoanCreateManyInputObjectSchema: z.ZodType<Prisma.BookLoanCreateManyInput, z.ZodTypeDef, Prisma.BookLoanCreateManyInput> = z.object({
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
export const BookLoanCreateManyInputObjectZodSchema = z.object({
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
