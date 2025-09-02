import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookWhereInputObjectSchema } from './BookWhereInput.schema'

export const BookScalarRelationFilterObjectSchema: z.ZodType<Prisma.BookScalarRelationFilter, z.ZodTypeDef, Prisma.BookScalarRelationFilter> = z.object({
  is: z.lazy(() => BookWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => BookWhereInputObjectSchema).optional()
}).strict();
export const BookScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => BookWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => BookWhereInputObjectSchema).optional()
}).strict();
