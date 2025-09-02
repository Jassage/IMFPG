import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { FloatWithAggregatesFilterObjectSchema } from './FloatWithAggregatesFilter.schema';
import { FloatNullableWithAggregatesFilterObjectSchema } from './FloatNullableWithAggregatesFilter.schema';
import { EnumRetakeStatusWithAggregatesFilterObjectSchema } from './EnumRetakeStatusWithAggregatesFilter.schema';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema'

export const RetakeScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.RetakeScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.RetakeScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => RetakeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => RetakeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RetakeScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RetakeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => RetakeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  ueId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  originalGrade: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  retakeGrade: z.union([z.lazy(() => FloatNullableWithAggregatesFilterObjectSchema), z.number()]).nullish(),
  scheduledSemester: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => EnumRetakeStatusWithAggregatesFilterObjectSchema), RetakeStatusSchema]).optional()
}).strict();
export const RetakeScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => RetakeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => RetakeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RetakeScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RetakeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => RetakeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  ueId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  originalGrade: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  retakeGrade: z.union([z.lazy(() => FloatNullableWithAggregatesFilterObjectSchema), z.number()]).nullish(),
  scheduledSemester: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => EnumRetakeStatusWithAggregatesFilterObjectSchema), RetakeStatusSchema]).optional()
}).strict();
