import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookLoanCreateManyBookInputObjectSchema: z.ZodType<Prisma.BookLoanCreateManyBookInput, z.ZodTypeDef, Prisma.BookLoanCreateManyBookInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullish(),
  status: z.string(),
  renewalCount: z.number().int().optional(),
  fine: z.number().nullish()
}).strict();
export const BookLoanCreateManyBookInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullish(),
  status: z.string(),
  renewalCount: z.number().int().optional(),
  fine: z.number().nullish()
}).strict();
