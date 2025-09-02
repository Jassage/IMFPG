import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanUncheckedCreateNestedManyWithoutBookInputObjectSchema } from './BookLoanUncheckedCreateNestedManyWithoutBookInput.schema'

export const BookUncheckedCreateInputObjectSchema: z.ZodType<Prisma.BookUncheckedCreateInput, z.ZodTypeDef, Prisma.BookUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  author: z.string(),
  isbn: z.string().nullish(),
  category: z.string().nullish(),
  faculty: z.string().nullish(),
  quantity: z.number().int().optional(),
  available: z.number().int().optional(),
  location: z.string().nullish(),
  status: z.string(),
  bookLoans: z.lazy(() => BookLoanUncheckedCreateNestedManyWithoutBookInputObjectSchema).optional()
}).strict();
export const BookUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  author: z.string(),
  isbn: z.string().nullish(),
  category: z.string().nullish(),
  faculty: z.string().nullish(),
  quantity: z.number().int().optional(),
  available: z.number().int().optional(),
  location: z.string().nullish(),
  status: z.string(),
  bookLoans: z.lazy(() => BookLoanUncheckedCreateNestedManyWithoutBookInputObjectSchema).optional()
}).strict();
