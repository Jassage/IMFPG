import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { FloatNullableWithAggregatesFilterObjectSchema } from './FloatNullableWithAggregatesFilter.schema'

export const BookLoanScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.BookLoanScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.BookLoanScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => BookLoanScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => BookLoanScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BookLoanScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BookLoanScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => BookLoanScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  bookId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  loanDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()]).optional(),
  dueDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()]).optional(),
  returnDate: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.date()]).nullish(),
  status: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  renewalCount: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  fine: z.union([z.lazy(() => FloatNullableWithAggregatesFilterObjectSchema), z.number()]).nullish()
}).strict();
export const BookLoanScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => BookLoanScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => BookLoanScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BookLoanScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BookLoanScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => BookLoanScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  bookId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  loanDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()]).optional(),
  dueDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()]).optional(),
  returnDate: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.date()]).nullish(),
  status: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  renewalCount: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  fine: z.union([z.lazy(() => FloatNullableWithAggregatesFilterObjectSchema), z.number()]).nullish()
}).strict();
