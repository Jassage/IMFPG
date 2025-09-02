import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelFindManySchema } from '../findManyFacultyLevel.schema';
import { CourseAssignmentFindManySchema } from '../findManyCourseAssignment.schema';
import { EnrollmentFindManySchema } from '../findManyEnrollment.schema';
import { FacultyCountOutputTypeArgsObjectSchema } from './FacultyCountOutputTypeArgs.schema'

export const FacultyIncludeObjectSchema: z.ZodType<Prisma.FacultyInclude, z.ZodTypeDef, Prisma.FacultyInclude> = z.object({
  levels: z.union([z.boolean(), z.lazy(() => FacultyLevelFindManySchema)]).optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  enrollments: z.union([z.boolean(), z.lazy(() => EnrollmentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => FacultyCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const FacultyIncludeObjectZodSchema = z.object({
  levels: z.union([z.boolean(), z.lazy(() => FacultyLevelFindManySchema)]).optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  enrollments: z.union([z.boolean(), z.lazy(() => EnrollmentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => FacultyCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
