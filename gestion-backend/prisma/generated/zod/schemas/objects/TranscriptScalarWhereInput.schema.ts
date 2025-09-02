import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const TranscriptScalarWhereInputObjectSchema: z.ZodType<Prisma.TranscriptScalarWhereInput, z.ZodTypeDef, Prisma.TranscriptScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => TranscriptScalarWhereInputObjectSchema), z.lazy(() => TranscriptScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TranscriptScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TranscriptScalarWhereInputObjectSchema), z.lazy(() => TranscriptScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  semester: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYear: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  gpa: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).nullish(),
  totalCredits: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).nullish(),
  creditsEarned: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).nullish(),
  generatedDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional()
}).strict();
export const TranscriptScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => TranscriptScalarWhereInputObjectSchema), z.lazy(() => TranscriptScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TranscriptScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TranscriptScalarWhereInputObjectSchema), z.lazy(() => TranscriptScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  semester: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYear: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  gpa: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).nullish(),
  totalCredits: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).nullish(),
  creditsEarned: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).nullish(),
  generatedDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional()
}).strict();
