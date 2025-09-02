import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema'

export const ScholarshipScalarWhereInputObjectSchema: z.ZodType<Prisma.ScholarshipScalarWhereInput, z.ZodTypeDef, Prisma.ScholarshipScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => ScholarshipScalarWhereInputObjectSchema), z.lazy(() => ScholarshipScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScholarshipScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScholarshipScalarWhereInputObjectSchema), z.lazy(() => ScholarshipScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  amount: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  criteria: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  applicationDeadline: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  academicYearId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  maxRecipients: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  currentRecipients: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
export const ScholarshipScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => ScholarshipScalarWhereInputObjectSchema), z.lazy(() => ScholarshipScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScholarshipScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScholarshipScalarWhereInputObjectSchema), z.lazy(() => ScholarshipScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  amount: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  criteria: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  applicationDeadline: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  academicYearId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  maxRecipients: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  currentRecipients: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
