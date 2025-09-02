import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema'

export const ScholarshipApplicationScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.ScholarshipApplicationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => ScholarshipApplicationScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ScholarshipApplicationScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScholarshipApplicationScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScholarshipApplicationScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ScholarshipApplicationScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  scholarshipId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  applicationDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()]).optional(),
  motivation: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  reviewNotes: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish()
}).strict();
export const ScholarshipApplicationScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => ScholarshipApplicationScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ScholarshipApplicationScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScholarshipApplicationScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScholarshipApplicationScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ScholarshipApplicationScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  scholarshipId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  applicationDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()]).optional(),
  motivation: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  reviewNotes: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish()
}).strict();
