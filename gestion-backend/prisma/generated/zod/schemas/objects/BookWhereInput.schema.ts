import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { BookLoanListRelationFilterObjectSchema } from './BookLoanListRelationFilter.schema'

export const BookWhereInputObjectSchema: z.ZodType<Prisma.BookWhereInput, z.ZodTypeDef, Prisma.BookWhereInput> = z.object({
  AND: z.union([z.lazy(() => BookWhereInputObjectSchema), z.lazy(() => BookWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BookWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BookWhereInputObjectSchema), z.lazy(() => BookWhereInputObjectSchema).array()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  author: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  isbn: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  category: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  faculty: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  quantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  available: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  location: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  bookLoans: z.lazy(() => BookLoanListRelationFilterObjectSchema).optional()
}).strict();
export const BookWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => BookWhereInputObjectSchema), z.lazy(() => BookWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BookWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BookWhereInputObjectSchema), z.lazy(() => BookWhereInputObjectSchema).array()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  author: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  isbn: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  category: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  faculty: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  quantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  available: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  location: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  bookLoans: z.lazy(() => BookLoanListRelationFilterObjectSchema).optional()
}).strict();
