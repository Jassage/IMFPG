import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentSelectObjectSchema } from './CourseAssignmentSelect.schema';
import { CourseAssignmentIncludeObjectSchema } from './CourseAssignmentInclude.schema'

export const CourseAssignmentArgsObjectSchema = z.object({
  select: z.lazy(() => CourseAssignmentSelectObjectSchema).optional(),
  include: z.lazy(() => CourseAssignmentIncludeObjectSchema).optional()
}).strict();
export const CourseAssignmentArgsObjectZodSchema = z.object({
  select: z.lazy(() => CourseAssignmentSelectObjectSchema).optional(),
  include: z.lazy(() => CourseAssignmentIncludeObjectSchema).optional()
}).strict();
