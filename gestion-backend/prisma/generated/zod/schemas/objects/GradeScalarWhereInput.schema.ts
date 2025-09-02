import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { EnumGradeStatusFilterObjectSchema } from './EnumGradeStatusFilter.schema';
import { GradeStatusSchema } from '../enums/GradeStatus.schema';
import { EnumSessionTypeFilterObjectSchema } from './EnumSessionTypeFilter.schema';
import { SessionTypeSchema } from '../enums/SessionType.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema'

export const GradeScalarWhereInputObjectSchema: z.ZodType<Prisma.GradeScalarWhereInput, z.ZodTypeDef, Prisma.GradeScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => GradeScalarWhereInputObjectSchema), z.lazy(() => GradeScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => GradeScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => GradeScalarWhereInputObjectSchema), z.lazy(() => GradeScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ueId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  grade: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  status: z.union([z.lazy(() => EnumGradeStatusFilterObjectSchema), GradeStatusSchema]).optional(),
  session: z.union([z.lazy(() => EnumSessionTypeFilterObjectSchema), SessionTypeSchema]).optional(),
  semester: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  transcriptId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  professeurId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish()
}).strict();
export const GradeScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => GradeScalarWhereInputObjectSchema), z.lazy(() => GradeScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => GradeScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => GradeScalarWhereInputObjectSchema), z.lazy(() => GradeScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ueId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  grade: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  status: z.union([z.lazy(() => EnumGradeStatusFilterObjectSchema), GradeStatusSchema]).optional(),
  session: z.union([z.lazy(() => EnumSessionTypeFilterObjectSchema), SessionTypeSchema]).optional(),
  semester: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  transcriptId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  professeurId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish()
}).strict();
