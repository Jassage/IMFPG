import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookCreateNestedOneWithoutBookLoansInputObjectSchema } from './BookCreateNestedOneWithoutBookLoansInput.schema';
import { StudentCreateNestedOneWithoutBookLoansInputObjectSchema } from './StudentCreateNestedOneWithoutBookLoansInput.schema'

export const BookLoanCreateInputObjectSchema: z.ZodType<Prisma.BookLoanCreateInput, z.ZodTypeDef, Prisma.BookLoanCreateInput> = z.object({
  id: z.string().optional(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullish(),
  status: z.string(),
  renewalCount: z.number().int().optional(),
  fine: z.number().nullish(),
  book: z.lazy(() => BookCreateNestedOneWithoutBookLoansInputObjectSchema),
  student: z.lazy(() => StudentCreateNestedOneWithoutBookLoansInputObjectSchema)
}).strict();
export const BookLoanCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullish(),
  status: z.string(),
  renewalCount: z.number().int().optional(),
  fine: z.number().nullish(),
  book: z.lazy(() => BookCreateNestedOneWithoutBookLoansInputObjectSchema),
  student: z.lazy(() => StudentCreateNestedOneWithoutBookLoansInputObjectSchema)
}).strict();
