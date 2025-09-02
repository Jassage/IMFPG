import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { EnumSemesterFilterObjectSchema } from './EnumSemesterFilter.schema';
import { SemesterSchema } from '../enums/Semester.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const CourseAssignmentScalarWhereInputObjectSchema: z.ZodType<Prisma.CourseAssignmentScalarWhereInput, z.ZodTypeDef, Prisma.CourseAssignmentScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ueId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  facultyId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  professeurId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  semester: z.union([z.lazy(() => EnumSemesterFilterObjectSchema), SemesterSchema]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  facultyLevelId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional()
}).strict();
export const CourseAssignmentScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ueId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  facultyId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  professeurId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  semester: z.union([z.lazy(() => EnumSemesterFilterObjectSchema), SemesterSchema]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  facultyLevelId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional()
}).strict();
