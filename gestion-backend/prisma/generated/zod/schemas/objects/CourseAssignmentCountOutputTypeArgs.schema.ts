import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCountOutputTypeSelectObjectSchema } from './CourseAssignmentCountOutputTypeSelect.schema'

export const CourseAssignmentCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => CourseAssignmentCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const CourseAssignmentCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => CourseAssignmentCountOutputTypeSelectObjectSchema).optional()
}).strict();
