import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyArgsObjectSchema } from './FacultyArgs.schema';
import { CourseAssignmentFindManySchema } from '../findManyCourseAssignment.schema';
import { FacultyLevelCountOutputTypeArgsObjectSchema } from './FacultyLevelCountOutputTypeArgs.schema'

export const FacultyLevelIncludeObjectSchema: z.ZodType<Prisma.FacultyLevelInclude, z.ZodTypeDef, Prisma.FacultyLevelInclude> = z.object({
  faculty: z.union([z.boolean(), z.lazy(() => FacultyArgsObjectSchema)]).optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => FacultyLevelCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const FacultyLevelIncludeObjectZodSchema = z.object({
  faculty: z.union([z.boolean(), z.lazy(() => FacultyArgsObjectSchema)]).optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => FacultyLevelCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
