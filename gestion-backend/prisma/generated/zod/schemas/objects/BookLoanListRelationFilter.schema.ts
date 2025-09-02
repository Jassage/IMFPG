import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanWhereInputObjectSchema } from './BookLoanWhereInput.schema'

export const BookLoanListRelationFilterObjectSchema: z.ZodType<Prisma.BookLoanListRelationFilter, z.ZodTypeDef, Prisma.BookLoanListRelationFilter> = z.object({
  every: z.lazy(() => BookLoanWhereInputObjectSchema).optional(),
  some: z.lazy(() => BookLoanWhereInputObjectSchema).optional(),
  none: z.lazy(() => BookLoanWhereInputObjectSchema).optional()
}).strict();
export const BookLoanListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => BookLoanWhereInputObjectSchema).optional(),
  some: z.lazy(() => BookLoanWhereInputObjectSchema).optional(),
  none: z.lazy(() => BookLoanWhereInputObjectSchema).optional()
}).strict();
