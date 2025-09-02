import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { EnumUETypeWithAggregatesFilterObjectSchema } from './EnumUETypeWithAggregatesFilter.schema';
import { UETypeSchema } from '../enums/UEType.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema'

export const UEScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.UEScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.UEScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => UEScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => UEScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UEScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UEScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => UEScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  code: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  credits: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  type: z.union([z.lazy(() => EnumUETypeWithAggregatesFilterObjectSchema), UETypeSchema]).optional(),
  passingGrade: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish(),
  objectives: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish(),
  createdById: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const UEScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => UEScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => UEScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UEScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UEScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => UEScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  code: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  credits: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  type: z.union([z.lazy(() => EnumUETypeWithAggregatesFilterObjectSchema), UETypeSchema]).optional(),
  passingGrade: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish(),
  objectives: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish(),
  createdById: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
