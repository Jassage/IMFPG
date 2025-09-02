import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema'

export const BookLoanScalarWhereInputObjectSchema: z.ZodType<Prisma.BookLoanScalarWhereInput, z.ZodTypeDef, Prisma.BookLoanScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => BookLoanScalarWhereInputObjectSchema), z.lazy(() => BookLoanScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BookLoanScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BookLoanScalarWhereInputObjectSchema), z.lazy(() => BookLoanScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  bookId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  loanDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  dueDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  returnDate: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  renewalCount: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  fine: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).nullish()
}).strict();
export const BookLoanScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => BookLoanScalarWhereInputObjectSchema), z.lazy(() => BookLoanScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BookLoanScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BookLoanScalarWhereInputObjectSchema), z.lazy(() => BookLoanScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  bookId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  loanDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  dueDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  returnDate: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  renewalCount: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  fine: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).nullish()
}).strict();
