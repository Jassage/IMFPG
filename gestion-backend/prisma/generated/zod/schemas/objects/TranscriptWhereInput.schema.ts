import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StudentScalarRelationFilterObjectSchema } from './StudentScalarRelationFilter.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { GradeListRelationFilterObjectSchema } from './GradeListRelationFilter.schema'

export const TranscriptWhereInputObjectSchema: z.ZodType<Prisma.TranscriptWhereInput, z.ZodTypeDef, Prisma.TranscriptWhereInput> = z.object({
  AND: z.union([z.lazy(() => TranscriptWhereInputObjectSchema), z.lazy(() => TranscriptWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TranscriptWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TranscriptWhereInputObjectSchema), z.lazy(() => TranscriptWhereInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  semester: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYear: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  gpa: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).nullish(),
  totalCredits: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).nullish(),
  creditsEarned: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).nullish(),
  generatedDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional(),
  grades: z.lazy(() => GradeListRelationFilterObjectSchema).optional()
}).strict();
export const TranscriptWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => TranscriptWhereInputObjectSchema), z.lazy(() => TranscriptWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TranscriptWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TranscriptWhereInputObjectSchema), z.lazy(() => TranscriptWhereInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  semester: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYear: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  gpa: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).nullish(),
  totalCredits: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).nullish(),
  creditsEarned: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).nullish(),
  generatedDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional(),
  grades: z.lazy(() => GradeListRelationFilterObjectSchema).optional()
}).strict();
