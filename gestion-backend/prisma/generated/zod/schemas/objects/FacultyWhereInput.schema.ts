import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { FacultyLevelListRelationFilterObjectSchema } from './FacultyLevelListRelationFilter.schema';
import { CourseAssignmentListRelationFilterObjectSchema } from './CourseAssignmentListRelationFilter.schema';
import { EnrollmentListRelationFilterObjectSchema } from './EnrollmentListRelationFilter.schema'

export const FacultyWhereInputObjectSchema: z.ZodType<Prisma.FacultyWhereInput, z.ZodTypeDef, Prisma.FacultyWhereInput> = z.object({
  AND: z.union([z.lazy(() => FacultyWhereInputObjectSchema), z.lazy(() => FacultyWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => FacultyWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => FacultyWhereInputObjectSchema), z.lazy(() => FacultyWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  dean: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  studentsCount: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  coursesCount: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  studyDuration: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  levels: z.lazy(() => FacultyLevelListRelationFilterObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentListRelationFilterObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentListRelationFilterObjectSchema).optional()
}).strict();
export const FacultyWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => FacultyWhereInputObjectSchema), z.lazy(() => FacultyWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => FacultyWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => FacultyWhereInputObjectSchema), z.lazy(() => FacultyWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  dean: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  studentsCount: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  coursesCount: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  studyDuration: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  levels: z.lazy(() => FacultyLevelListRelationFilterObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentListRelationFilterObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentListRelationFilterObjectSchema).optional()
}).strict();
