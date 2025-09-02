import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { FloatNullableWithAggregatesFilterObjectSchema } from './FloatNullableWithAggregatesFilter.schema';
import { IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const TranscriptScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.TranscriptScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.TranscriptScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => TranscriptScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TranscriptScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TranscriptScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TranscriptScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TranscriptScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  semester: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  academicYear: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  gpa: z.union([z.lazy(() => FloatNullableWithAggregatesFilterObjectSchema), z.number()]).nullish(),
  totalCredits: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).nullish(),
  creditsEarned: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).nullish(),
  generatedDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()]).optional()
}).strict();
export const TranscriptScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => TranscriptScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TranscriptScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TranscriptScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TranscriptScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TranscriptScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  semester: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  academicYear: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  gpa: z.union([z.lazy(() => FloatNullableWithAggregatesFilterObjectSchema), z.number()]).nullish(),
  totalCredits: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).nullish(),
  creditsEarned: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).nullish(),
  generatedDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()]).optional()
}).strict();
