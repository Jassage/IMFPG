import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookLoanUncheckedCreateWithoutBookInputObjectSchema: z.ZodType<Prisma.BookLoanUncheckedCreateWithoutBookInput, z.ZodTypeDef, Prisma.BookLoanUncheckedCreateWithoutBookInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullish(),
  status: z.string(),
  renewalCount: z.number().int().optional(),
  fine: z.number().nullish()
}).strict();
export const BookLoanUncheckedCreateWithoutBookInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullish(),
  status: z.string(),
  renewalCount: z.number().int().optional(),
  fine: z.number().nullish()
}).strict();
