import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { EnumUETypeFilterObjectSchema } from './EnumUETypeFilter.schema';
import { UETypeSchema } from '../enums/UEType.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const UEScalarWhereInputObjectSchema: z.ZodType<Prisma.UEScalarWhereInput, z.ZodTypeDef, Prisma.UEScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => UEScalarWhereInputObjectSchema), z.lazy(() => UEScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UEScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UEScalarWhereInputObjectSchema), z.lazy(() => UEScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  credits: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  type: z.union([z.lazy(() => EnumUETypeFilterObjectSchema), UETypeSchema]).optional(),
  passingGrade: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  objectives: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  createdById: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
export const UEScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => UEScalarWhereInputObjectSchema), z.lazy(() => UEScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UEScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UEScalarWhereInputObjectSchema), z.lazy(() => UEScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  credits: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  type: z.union([z.lazy(() => EnumUETypeFilterObjectSchema), UETypeSchema]).optional(),
  passingGrade: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  objectives: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  createdById: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
