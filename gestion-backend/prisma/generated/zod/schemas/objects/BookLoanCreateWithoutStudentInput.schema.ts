import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookCreateNestedOneWithoutBookLoansInputObjectSchema } from './BookCreateNestedOneWithoutBookLoansInput.schema'

export const BookLoanCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.BookLoanCreateWithoutStudentInput, z.ZodTypeDef, Prisma.BookLoanCreateWithoutStudentInput> = z.object({
  id: z.string().optional(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullish(),
  status: z.string(),
  renewalCount: z.number().int().optional(),
  fine: z.number().nullish(),
  book: z.lazy(() => BookCreateNestedOneWithoutBookLoansInputObjectSchema)
}).strict();
export const BookLoanCreateWithoutStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullish(),
  status: z.string(),
  renewalCount: z.number().int().optional(),
  fine: z.number().nullish(),
  book: z.lazy(() => BookCreateNestedOneWithoutBookLoansInputObjectSchema)
}).strict();
