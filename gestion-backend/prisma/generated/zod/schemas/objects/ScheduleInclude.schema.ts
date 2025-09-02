import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentArgsObjectSchema } from './CourseAssignmentArgs.schema';
import { ProfesseurArgsObjectSchema } from './ProfesseurArgs.schema';
import { AttendanceFindManySchema } from '../findManyAttendance.schema';
import { ScheduleCountOutputTypeArgsObjectSchema } from './ScheduleCountOutputTypeArgs.schema'

export const ScheduleIncludeObjectSchema: z.ZodType<Prisma.ScheduleInclude, z.ZodTypeDef, Prisma.ScheduleInclude> = z.object({
  assignment: z.union([z.boolean(), z.lazy(() => CourseAssignmentArgsObjectSchema)]).optional(),
  professeur: z.union([z.boolean(), z.lazy(() => ProfesseurArgsObjectSchema)]).optional(),
  attendances: z.union([z.boolean(), z.lazy(() => AttendanceFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ScheduleCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ScheduleIncludeObjectZodSchema = z.object({
  assignment: z.union([z.boolean(), z.lazy(() => CourseAssignmentArgsObjectSchema)]).optional(),
  professeur: z.union([z.boolean(), z.lazy(() => ProfesseurArgsObjectSchema)]).optional(),
  attendances: z.union([z.boolean(), z.lazy(() => AttendanceFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ScheduleCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
