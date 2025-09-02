import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema'

export const ScholarshipApplicationScalarWhereInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationScalarWhereInput, z.ZodTypeDef, Prisma.ScholarshipApplicationScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema), z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema), z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  scholarshipId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  applicationDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  motivation: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  reviewNotes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish()
}).strict();
export const ScholarshipApplicationScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema), z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema), z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  scholarshipId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  applicationDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  motivation: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  reviewNotes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish()
}).strict();
