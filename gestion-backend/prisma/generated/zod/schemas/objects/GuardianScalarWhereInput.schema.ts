import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const GuardianScalarWhereInputObjectSchema: z.ZodType<Prisma.GuardianScalarWhereInput, z.ZodTypeDef, Prisma.GuardianScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => GuardianScalarWhereInputObjectSchema), z.lazy(() => GuardianScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => GuardianScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => GuardianScalarWhereInputObjectSchema), z.lazy(() => GuardianScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  firstName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  lastName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  relationship: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  phone: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  email: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  address: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  isPrimary: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional()
}).strict();
export const GuardianScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => GuardianScalarWhereInputObjectSchema), z.lazy(() => GuardianScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => GuardianScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => GuardianScalarWhereInputObjectSchema), z.lazy(() => GuardianScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  firstName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  lastName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  relationship: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  phone: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  email: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  address: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  isPrimary: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional()
}).strict();
