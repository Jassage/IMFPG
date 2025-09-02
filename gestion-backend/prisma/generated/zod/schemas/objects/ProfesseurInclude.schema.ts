import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserArgsObjectSchema } from './UserArgs.schema';
import { CourseAssignmentFindManySchema } from '../findManyCourseAssignment.schema';
import { ScheduleFindManySchema } from '../findManySchedule.schema';
import { GradeFindManySchema } from '../findManyGrade.schema';
import { ProfesseurCountOutputTypeArgsObjectSchema } from './ProfesseurCountOutputTypeArgs.schema'

export const ProfesseurIncludeObjectSchema: z.ZodType<Prisma.ProfesseurInclude, z.ZodTypeDef, Prisma.ProfesseurInclude> = z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  schedules: z.union([z.boolean(), z.lazy(() => ScheduleFindManySchema)]).optional(),
  grades: z.union([z.boolean(), z.lazy(() => GradeFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ProfesseurCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ProfesseurIncludeObjectZodSchema = z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  schedules: z.union([z.boolean(), z.lazy(() => ScheduleFindManySchema)]).optional(),
  grades: z.union([z.boolean(), z.lazy(() => GradeFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ProfesseurCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
