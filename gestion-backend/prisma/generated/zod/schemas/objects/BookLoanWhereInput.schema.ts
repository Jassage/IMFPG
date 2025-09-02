import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { BookScalarRelationFilterObjectSchema } from './BookScalarRelationFilter.schema';
import { BookWhereInputObjectSchema } from './BookWhereInput.schema';
import { StudentScalarRelationFilterObjectSchema } from './StudentScalarRelationFilter.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema'

export const BookLoanWhereInputObjectSchema: z.ZodType<Prisma.BookLoanWhereInput, z.ZodTypeDef, Prisma.BookLoanWhereInput> = z.object({
  AND: z.union([z.lazy(() => BookLoanWhereInputObjectSchema), z.lazy(() => BookLoanWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BookLoanWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BookLoanWhereInputObjectSchema), z.lazy(() => BookLoanWhereInputObjectSchema).array()]).optional(),
  bookId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  loanDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  dueDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  returnDate: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  renewalCount: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  fine: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).nullish(),
  book: z.union([z.lazy(() => BookScalarRelationFilterObjectSchema), z.lazy(() => BookWhereInputObjectSchema)]).optional(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional()
}).strict();
export const BookLoanWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => BookLoanWhereInputObjectSchema), z.lazy(() => BookLoanWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BookLoanWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BookLoanWhereInputObjectSchema), z.lazy(() => BookLoanWhereInputObjectSchema).array()]).optional(),
  bookId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  loanDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  dueDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  returnDate: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  renewalCount: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  fine: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).nullish(),
  book: z.union([z.lazy(() => BookScalarRelationFilterObjectSchema), z.lazy(() => BookWhereInputObjectSchema)]).optional(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional()
}).strict();
