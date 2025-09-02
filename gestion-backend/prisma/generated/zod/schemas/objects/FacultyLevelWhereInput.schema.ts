import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { FacultyScalarRelationFilterObjectSchema } from './FacultyScalarRelationFilter.schema';
import { FacultyWhereInputObjectSchema } from './FacultyWhereInput.schema';
import { CourseAssignmentListRelationFilterObjectSchema } from './CourseAssignmentListRelationFilter.schema'

export const FacultyLevelWhereInputObjectSchema: z.ZodType<Prisma.FacultyLevelWhereInput, z.ZodTypeDef, Prisma.FacultyLevelWhereInput> = z.object({
  AND: z.union([z.lazy(() => FacultyLevelWhereInputObjectSchema), z.lazy(() => FacultyLevelWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => FacultyLevelWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => FacultyLevelWhereInputObjectSchema), z.lazy(() => FacultyLevelWhereInputObjectSchema).array()]).optional(),
  facultyId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(10)]).optional(),
  faculty: z.union([z.lazy(() => FacultyScalarRelationFilterObjectSchema), z.lazy(() => FacultyWhereInputObjectSchema)]).optional(),
  assignments: z.lazy(() => CourseAssignmentListRelationFilterObjectSchema).optional()
}).strict();
export const FacultyLevelWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => FacultyLevelWhereInputObjectSchema), z.lazy(() => FacultyLevelWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => FacultyLevelWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => FacultyLevelWhereInputObjectSchema), z.lazy(() => FacultyLevelWhereInputObjectSchema).array()]).optional(),
  facultyId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(10)]).optional(),
  faculty: z.union([z.lazy(() => FacultyScalarRelationFilterObjectSchema), z.lazy(() => FacultyWhereInputObjectSchema)]).optional(),
  assignments: z.lazy(() => CourseAssignmentListRelationFilterObjectSchema).optional()
}).strict();
