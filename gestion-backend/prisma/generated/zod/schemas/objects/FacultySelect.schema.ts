import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelFindManySchema } from '../findManyFacultyLevel.schema';
import { CourseAssignmentFindManySchema } from '../findManyCourseAssignment.schema';
import { EnrollmentFindManySchema } from '../findManyEnrollment.schema';
import { FacultyCountOutputTypeArgsObjectSchema } from './FacultyCountOutputTypeArgs.schema'

export const FacultySelectObjectSchema: z.ZodType<Prisma.FacultySelect, z.ZodTypeDef, Prisma.FacultySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  code: z.boolean().optional(),
  description: z.boolean().optional(),
  dean: z.boolean().optional(),
  studentsCount: z.boolean().optional(),
  coursesCount: z.boolean().optional(),
  studyDuration: z.boolean().optional(),
  levels: z.union([z.boolean(), z.lazy(() => FacultyLevelFindManySchema)]).optional(),
  status: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  enrollments: z.union([z.boolean(), z.lazy(() => EnrollmentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => FacultyCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const FacultySelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  code: z.boolean().optional(),
  description: z.boolean().optional(),
  dean: z.boolean().optional(),
  studentsCount: z.boolean().optional(),
  coursesCount: z.boolean().optional(),
  studyDuration: z.boolean().optional(),
  levels: z.union([z.boolean(), z.lazy(() => FacultyLevelFindManySchema)]).optional(),
  status: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  enrollments: z.union([z.boolean(), z.lazy(() => EnrollmentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => FacultyCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
