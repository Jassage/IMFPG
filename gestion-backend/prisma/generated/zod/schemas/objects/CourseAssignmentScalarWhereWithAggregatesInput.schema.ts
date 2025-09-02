import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumSemesterWithAggregatesFilterObjectSchema } from './EnumSemesterWithAggregatesFilter.schema';
import { SemesterSchema } from '../enums/Semester.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema'

export const CourseAssignmentScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.CourseAssignmentScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.CourseAssignmentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => CourseAssignmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CourseAssignmentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CourseAssignmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  ueId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  facultyId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  professeurId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  semester: z.union([z.lazy(() => EnumSemesterWithAggregatesFilterObjectSchema), SemesterSchema]).optional(),
  level: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  facultyLevelId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const CourseAssignmentScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => CourseAssignmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CourseAssignmentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CourseAssignmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  ueId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  facultyId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  professeurId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  semester: z.union([z.lazy(() => EnumSemesterWithAggregatesFilterObjectSchema), SemesterSchema]).optional(),
  level: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  facultyLevelId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
