import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { FloatWithAggregatesFilterObjectSchema } from './FloatWithAggregatesFilter.schema';
import { EnumGradeStatusWithAggregatesFilterObjectSchema } from './EnumGradeStatusWithAggregatesFilter.schema';
import { GradeStatusSchema } from '../enums/GradeStatus.schema';
import { EnumSessionTypeWithAggregatesFilterObjectSchema } from './EnumSessionTypeWithAggregatesFilter.schema';
import { SessionTypeSchema } from '../enums/SessionType.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema'

export const GradeScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.GradeScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.GradeScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => GradeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => GradeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => GradeScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => GradeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => GradeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  ueId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  grade: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  status: z.union([z.lazy(() => EnumGradeStatusWithAggregatesFilterObjectSchema), GradeStatusSchema]).optional(),
  session: z.union([z.lazy(() => EnumSessionTypeWithAggregatesFilterObjectSchema), SessionTypeSchema]).optional(),
  semester: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  transcriptId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish(),
  professeurId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish()
}).strict();
export const GradeScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => GradeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => GradeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => GradeScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => GradeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => GradeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  ueId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  grade: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  status: z.union([z.lazy(() => EnumGradeStatusWithAggregatesFilterObjectSchema), GradeStatusSchema]).optional(),
  session: z.union([z.lazy(() => EnumSessionTypeWithAggregatesFilterObjectSchema), SessionTypeSchema]).optional(),
  semester: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  transcriptId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish(),
  professeurId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish()
}).strict();
