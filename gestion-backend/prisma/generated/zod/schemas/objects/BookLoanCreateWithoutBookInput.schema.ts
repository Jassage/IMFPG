import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateNestedOneWithoutBookLoansInputObjectSchema } from './StudentCreateNestedOneWithoutBookLoansInput.schema'

export const BookLoanCreateWithoutBookInputObjectSchema: z.ZodType<Prisma.BookLoanCreateWithoutBookInput, z.ZodTypeDef, Prisma.BookLoanCreateWithoutBookInput> = z.object({
  id: z.string().optional(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullish(),
  status: z.string(),
  renewalCount: z.number().int().optional(),
  fine: z.number().nullish(),
  student: z.lazy(() => StudentCreateNestedOneWithoutBookLoansInputObjectSchema)
}).strict();
export const BookLoanCreateWithoutBookInputObjectZodSchema = z.object({
  id: z.string().optional(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullish(),
  status: z.string(),
  renewalCount: z.number().int().optional(),
  fine: z.number().nullish(),
  student: z.lazy(() => StudentCreateNestedOneWithoutBookLoansInputObjectSchema)
}).strict();
