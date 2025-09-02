import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { EnumRetakeStatusFilterObjectSchema } from './EnumRetakeStatusFilter.schema';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema'

export const RetakeScalarWhereInputObjectSchema: z.ZodType<Prisma.RetakeScalarWhereInput, z.ZodTypeDef, Prisma.RetakeScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => RetakeScalarWhereInputObjectSchema), z.lazy(() => RetakeScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RetakeScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RetakeScalarWhereInputObjectSchema), z.lazy(() => RetakeScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ueId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  originalGrade: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  retakeGrade: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).nullish(),
  scheduledSemester: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => EnumRetakeStatusFilterObjectSchema), RetakeStatusSchema]).optional()
}).strict();
export const RetakeScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => RetakeScalarWhereInputObjectSchema), z.lazy(() => RetakeScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RetakeScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RetakeScalarWhereInputObjectSchema), z.lazy(() => RetakeScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ueId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  originalGrade: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  retakeGrade: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).nullish(),
  scheduledSemester: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => EnumRetakeStatusFilterObjectSchema), RetakeStatusSchema]).optional()
}).strict();
