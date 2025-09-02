import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyArgsObjectSchema } from './FacultyArgs.schema';
import { CourseAssignmentFindManySchema } from '../findManyCourseAssignment.schema';
import { FacultyLevelCountOutputTypeArgsObjectSchema } from './FacultyLevelCountOutputTypeArgs.schema'

export const FacultyLevelSelectObjectSchema: z.ZodType<Prisma.FacultyLevelSelect, z.ZodTypeDef, Prisma.FacultyLevelSelect> = z.object({
  id: z.boolean().optional(),
  facultyId: z.boolean().optional(),
  faculty: z.union([z.boolean(), z.lazy(() => FacultyArgsObjectSchema)]).optional(),
  level: z.boolean().optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => FacultyLevelCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const FacultyLevelSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  facultyId: z.boolean().optional(),
  faculty: z.union([z.boolean(), z.lazy(() => FacultyArgsObjectSchema)]).optional(),
  level: z.boolean().optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => FacultyLevelCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
