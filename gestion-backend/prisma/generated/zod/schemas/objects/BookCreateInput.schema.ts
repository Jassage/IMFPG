import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanCreateNestedManyWithoutBookInputObjectSchema } from './BookLoanCreateNestedManyWithoutBookInput.schema'

export const BookCreateInputObjectSchema: z.ZodType<Prisma.BookCreateInput, z.ZodTypeDef, Prisma.BookCreateInput> = z.object({
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
  bookLoans: z.lazy(() => BookLoanCreateNestedManyWithoutBookInputObjectSchema).optional()
}).strict();
export const BookCreateInputObjectZodSchema = z.object({
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
  bookLoans: z.lazy(() => BookLoanCreateNestedManyWithoutBookInputObjectSchema).optional()
}).strict();
